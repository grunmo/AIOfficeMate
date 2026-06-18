from __future__ import annotations

import json
import logging
import re
import sqlite3
import time
from collections import defaultdict
from pathlib import Path
from typing import Any, Optional

from api.config import ensure_within_work_dir, resolve_relative
from api.db import get_db_conn

logger = logging.getLogger(__name__)


class InMemoryIndex:
    def __init__(self) -> None:
        self._chunks_by_space: dict[int, list[dict[str, Any]]] = defaultdict(list)
        self._token_index: dict[tuple[int, str], list[int]] = defaultdict(list)
        self._doc_titles: dict[int, str] = {}

    def reset(self, space_id: int) -> None:
        self._chunks_by_space.pop(space_id, None)
        keys = [k for k in self._token_index.keys() if k[0] == space_id]
        for k in keys:
            del self._token_index[k]

    def add_chunk(self, space_id: int, doc_id: int, chunk_id: int, content: str) -> None:
        self._chunks_by_space[space_id].append({
            "id": chunk_id, "doc_id": doc_id, "content": content
        })
        for token in _tokenize(content):
            self._token_index[(space_id, token)].append(chunk_id)

    def search(self, space_id: int, query: str, top_k: int = 3) -> list[dict[str, Any]]:
        if space_id not in self._chunks_by_space:
            return []
        tokens = _tokenize(query)
        if not tokens:
            return list(self._chunks_by_space[space_id])[:top_k]

        score_map: dict[int, float] = defaultdict(float)
        for tok in tokens:
            for chunk_id in self._token_index.get((space_id, tok), []):
                score_map[chunk_id] += 1.0
        ranked = sorted(score_map.items(), key=lambda kv: kv[1], reverse=True)[:top_k]

        chunks = {c["id"]: c for c in self._chunks_by_space[space_id]}
        hits = []
        for chunk_id, score in ranked:
            data = chunks.get(chunk_id)
            if data:
                hits.append({**data, "score": score})
        return hits


def _tokenize(text: str) -> list[str]:
    tokens = set()
    text = text or ""
    for word in re.findall(r"[A-Za-z0-9]{2,}", text):
        tokens.add(word.lower())
    for ch in text:
        if "\u4e00" <= ch <= "\u9fff":
            tokens.add(ch)
    bigrams = re.findall(r"[\u4e00-\u9fff]{2}", text)
    for b in bigrams:
        tokens.add(b)
    return list(tokens)


_INDEX = InMemoryIndex()


def _row_to_dict(row: sqlite3.Row) -> dict[str, Any]:
    return {k: row[k] for k in row.keys()}


def list_spaces() -> list[dict[str, Any]]:
    conn = get_db_conn()
    rows = conn.execute("SELECT * FROM knowledge_spaces ORDER BY id DESC").fetchall()
    return [_row_to_dict(r) for r in rows]


def create_space(name: str, description: str = "") -> dict[str, Any]:
    conn = get_db_conn()
    if not name or not name.strip():
        raise ValueError("名称不能为空")
    existing = conn.execute("SELECT id FROM knowledge_spaces WHERE name = ?", (name,)).fetchone()
    if existing:
        raise FileExistsError("同名知识空间已存在")
    cur = conn.execute(
        "INSERT INTO knowledge_spaces (name, description) VALUES (?, ?)",
        (name.strip(), description or ""),
    )
    conn.commit()
    return {
        "id": cur.lastrowid,
        "name": name.strip(),
        "description": description or "",
    }


def delete_space(space_id: int) -> None:
    conn = get_db_conn()
    row = conn.execute("SELECT id FROM knowledge_spaces WHERE id = ?", (space_id,)).fetchone()
    if not row:
        raise FileNotFoundError("知识空间不存在")
    conn.execute("DELETE FROM doc_chunks WHERE space_id = ?", (space_id,))
    conn.execute("DELETE FROM documents WHERE space_id = ?", (space_id,))
    conn.execute("DELETE FROM knowledge_spaces WHERE id = ?", (space_id,))
    conn.commit()
    _INDEX.reset(space_id)


def _ensure_space_index(space_id: int) -> None:
    if _INDEX._chunks_by_space.get(space_id):
        return
    conn = get_db_conn()
    docs = conn.execute("SELECT id, title FROM documents WHERE space_id = ?", (space_id,)).fetchall()
    for doc in docs:
        _INDEX._doc_titles[int(doc["id"])] = doc["title"]
    chunks = conn.execute(
        "SELECT id, doc_id, space_id, content FROM doc_chunks WHERE space_id = ?",
        (space_id,),
    ).fetchall()
    for c in chunks:
        _INDEX.add_chunk(int(c["space_id"]), int(c["doc_id"]), int(c["id"]), c["content"])


def _read_text_file(path: Path) -> str:
    for enc in ("utf-8", "gbk", "utf-16"):
        try:
            return path.read_text(encoding=enc)
        except UnicodeDecodeError:
            continue
        except OSError:
            return ""
    return path.read_bytes().decode("utf-8", errors="replace")


def _split_paragraphs(text: str, max_len: int = 800) -> list[str]:
    text = text or ""
    parts = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    chunks: list[str] = []
    for part in parts:
        if len(part) <= max_len:
            chunks.append(part)
        else:
            for i in range(0, len(part), max_len):
                chunks.append(part[i:i + max_len])
    return chunks


def import_documents(space_id: int, files: list[dict[str, Any]]) -> dict[str, Any]:
    conn = get_db_conn()
    row = conn.execute("SELECT id FROM knowledge_spaces WHERE id = ?", (space_id,)).fetchone()
    if not row:
        raise FileNotFoundError("知识空间不存在")

    added_docs: list[dict[str, Any]] = []
    total_chunks = 0
    for f in files:
        path_raw = f.get("path") or f.get("filePath") or ""
        if not path_raw:
            continue
        p = resolve_relative(path_raw)
        if not ensure_within_work_dir(p):
            continue
        if not p.exists() or not p.is_file():
            continue
        content = _read_text_file(p)
        title = f.get("title") or p.stem or p.name
        cur = conn.execute(
            "INSERT INTO documents (space_id, title, file_path) VALUES (?, ?, ?)",
            (space_id, title, str(p)),
        )
        doc_id = int(cur.lastrowid)
        _INDEX._doc_titles[doc_id] = title
        added_docs.append({"docId": doc_id, "title": title, "path": str(p)})
        for chunk in _split_paragraphs(content):
            ccur = conn.execute(
                "INSERT INTO doc_chunks (doc_id, space_id, content) VALUES (?, ?, ?)",
                (doc_id, space_id, chunk),
            )
            chunk_id = int(ccur.lastrowid)
            _INDEX.add_chunk(space_id, doc_id, chunk_id, chunk)
            total_chunks += 1
    conn.commit()
    _ensure_space_index(space_id)
    return {"docs": added_docs, "chunks": total_chunks}


def _mock_answer(question: str, hits: list[dict[str, Any]]) -> dict[str, Any]:
    summary_parts: list[str] = []
    sources: list[dict[str, Any]] = []
    for idx, hit in enumerate(hits, 1):
        title = _INDEX._doc_titles.get(int(hit.get("doc_id", 0)), "未命名文档")
        snippet = hit.get("content", "")[:120]
        sources.append({
            "docId": hit.get("doc_id"),
            "title": title,
            "snippet": snippet,
            "score": hit.get("score"),
        })
        summary_parts.append(f"【{idx}】{snippet}")
    if not hits:
        answer = "暂无匹配资料，建议向知识空间中补充相关文档后再提问。"
    else:
        answer = (
            f"针对问题「{question}」，综合召回的 {len(hits)} 段相关内容可以给出如下回答："
            + " ".join(summary_parts)
            + "（此结果基于关键词索引生成，如接入 LLM 可获得更自然的摘要。）"
        )
    return {"answer": answer, "sources": sources}


def chat(space_id: int, question: str) -> dict[str, Any]:
    if not question or not question.strip():
        raise ValueError("问题不能为空")
    conn = get_db_conn()
    row = conn.execute("SELECT id FROM knowledge_spaces WHERE id = ?", (space_id,)).fetchone()
    if not row:
        raise FileNotFoundError("知识空间不存在")
    _ensure_space_index(space_id)
    hits = _INDEX.search(space_id, question, top_k=3)
    return _mock_answer(question.strip(), hits)


def list_documents(space_id: int) -> list[dict[str, Any]]:
    conn = get_db_conn()
    rows = conn.execute(
        "SELECT id, space_id, title, file_path, created_at FROM documents WHERE space_id = ? ORDER BY id DESC",
        (space_id,),
    ).fetchall()
    return [_row_to_dict(r) for r in rows]
