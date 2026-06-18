from __future__ import annotations

import json
import logging
import random
import re
import time
from pathlib import Path
from typing import Any, Optional

import httpx

from api.config import LLM_API_KEY, LLM_BASE_URL, LLM_MODEL, LLM_PROVIDER, ensure_within_work_dir, resolve_relative

logger = logging.getLogger(__name__)


_FILE_CATEGORY_RULES: list[tuple[list[str], str]] = [
    (["pdf", "doc", "docx", "txt"], "文档"),
    (["xls", "xlsx", "csv"], "表格"),
    (["ppt", "pptx"], "演示文稿"),
    (["jpg", "jpeg", "png", "bmp", "tiff", "tif", "webp"], "图片/扫描件"),
    (["mp4", "mov", "avi", "mkv"], "视频"),
    (["mp3", "wav", "flac", "m4a"], "音频"),
    (["zip", "rar", "7z", "tar", "gz"], "压缩包"),
]


_KEYWORD_CATEGORY: list[tuple[list[str], str]] = [
    (["发票", "invoice", "receipt", "账单", "tax", "税务"], "财务"),
    (["合同", "contract", "agreement", "协议"], "合同"),
    (["报告", "report", "analysis", "分析"], "报告"),
    (["会议", "meeting", "minutes", "议程"], "会议纪要"),
    (["简历", "resume", "cv", "招聘"], "人事"),
    (["设计", "design", "ui", "ux", "logo", "海报"], "设计"),
    (["代码", "code", "github", "git", "脚本"], "代码"),
    (["笔记", "note", "todo", "备忘"], "笔记"),
    (["身份证", "护照", "证件", "执照"], "证件"),
    (["产品", "product", "方案", "proposal"], "产品"),
]


_COMMON_PREFIX_BY_CATEGORY: dict[str, str] = {
    "财务": "财务",
    "合同": "合同",
    "报告": "报告",
    "会议纪要": "会议纪要",
    "人事": "人事",
    "设计": "设计",
    "代码": "代码",
    "笔记": "笔记",
    "证件": "证件",
    "产品": "产品",
    "文档": "文档",
    "表格": "表格",
    "演示文稿": "演示",
    "图片/扫描件": "扫描件",
    "视频": "视频",
    "音频": "音频",
    "压缩包": "压缩",
}


def _detect_category(name: str, ext: str) -> tuple[str, str]:
    lowered = (name or "").lower()
    ext = ext.lower().lstrip(".")
    reason = f"文件类型为 {ext.upper() if ext else '未知'}"

    for kws, cat in _KEYWORD_CATEGORY:
        for kw in kws:
            if kw.lower() in lowered:
                return cat, f"文件名包含 '{kw}' 等关键词，建议归入 {cat} 分类"

    for exts, cat in _FILE_CATEGORY_RULES:
        if ext in exts:
            reason = f"文件扩展名 .{ext} 属于 {cat} 类型"
            return cat, reason

    return "其他", reason


def _clean_name(name: str) -> str:
    cleaned = re.sub(r"[\s_]+", "_", name).strip("_")
    cleaned = re.sub(r"_+", "_", cleaned)
    return cleaned


def _mock_analyze_one(file_item: dict[str, Any], mode: str) -> dict[str, Any]:
    path = file_item.get("path") or ""
    file_obj = Path(path)
    name = file_obj.stem or "未命名"
    ext = file_obj.suffix.lstrip(".")
    size = int(file_item.get("size") or 0)

    category, reason_base = _detect_category(name, ext)
    prefix = _COMMON_PREFIX_BY_CATEGORY.get(category, category)
    date_tag = time.strftime("%Y%m%d")
    nice_name = _clean_name(name)

    if mode == "simple":
        suggested = f"{prefix}_{date_tag}_{nice_name}"
    elif mode == "detailed":
        size_kb = size // 1024 if size else 0
        size_tag = f"{size_kb}KB" if size_kb < 1024 else f"{size_kb // 1024}MB"
        suggested = f"{prefix}_{date_tag}_{nice_name}_{size_tag}"
    else:
        suggested = f"{date_tag}_{nice_name}"

    suggested_ext = f".{ext}" if ext else ""
    suggested_name = suggested + suggested_ext

    confidence = round(random.uniform(0.65, 0.93), 3)
    if category == "财务" or category == "合同":
        confidence = round(random.uniform(0.82, 0.95), 3)

    return {
        "file": path,
        "suggestedName": suggested_name,
        "suggestedCategory": category,
        "confidence": confidence,
        "reason": reason_base,
    }


def _build_llm_prompt(files: list[dict[str, Any]], mode: str, categories: Optional[list[str]]) -> str:
    lines = ["请分析以下文件，给出建议的中文文件名与分类，使用 JSON 数组返回。",
             f"分析模式：{mode}。"]
    if categories:
        lines.append(f"分类仅可在以下列表中选择：{', '.join(categories)}。")
    else:
        lines.append("分类可以选择：财务、合同、报告、会议纪要、人事、设计、代码、笔记、证件、产品、文档、表格、演示、扫描件、视频、音频、压缩、其他。")
    lines.append("要求每条记录包含字段：file、suggestedName、suggestedCategory、confidence、reason。")
    lines.append("suggestedName 保留原始扩展名。reason 使用简短中文说明。confidence 为 0 到 1 的小数。")
    lines.append("文件列表：")
    for idx, f in enumerate(files, 1):
        lines.append(f"- [{idx}] path={f.get('path')}, size={f.get('size', 0)} bytes")
    return "\n".join(lines)


async def _analyze_via_llm(
    files: list[dict[str, Any]],
    mode: str,
    categories: Optional[list[str]],
) -> list[dict[str, Any]]:
    provider = LLM_PROVIDER or "mock"
    base_url = LLM_BASE_URL or ""
    api_key = LLM_API_KEY or ""
    model = LLM_MODEL or ""

    if provider == "mock" or not api_key or not base_url:
        return [_mock_analyze_one(f, mode) for f in files]

    user_prompt = _build_llm_prompt(files, mode, categories)
    system_prompt = "你是一个文件归档助手。只输出 JSON 数组，不要额外说明文字。"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "temperature": 0.2,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    }
    endpoint = base_url.rstrip("/") + "/chat/completions"

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(endpoint, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
    except Exception as exc:
        logger.warning("LLM 调用失败，回退到 Mock 模式: %s", exc)
        return [_mock_analyze_one(f, mode) for f in files]

    try:
        suggestions = json.loads(content)
        if not isinstance(suggestions, list):
            raise ValueError("返回不是数组")
        normalized: list[dict[str, Any]] = []
        for item in suggestions:
            if not isinstance(item, dict):
                continue
            normalized.append({
                "file": item.get("file", ""),
                "suggestedName": item.get("suggestedName", ""),
                "suggestedCategory": item.get("suggestedCategory", "其他"),
                "confidence": float(item.get("confidence", 0.7)),
                "reason": item.get("reason", ""),
            })
        if normalized:
            return normalized
    except Exception as exc:
        logger.warning("解析 LLM 返回失败，回退到 Mock: %s", exc)

    return [_mock_analyze_one(f, mode) for f in files]


async def analyze_files(
    files: list[dict[str, Any]],
    mode: str = "simple",
    categories: Optional[list[str]] = None,
) -> list[dict[str, Any]]:
    enriched: list[dict[str, Any]] = []
    for f in files:
        item = dict(f)
        path = item.get("path") or ""
        try:
            p = resolve_relative(path)
            if p.exists() and p.is_file():
                item["size"] = item.get("size") or p.stat().st_size
                item["_ext"] = p.suffix.lstrip(".")
                if ensure_within_work_dir(p):
                    item["path"] = str(p)
        except Exception:
            pass
        enriched.append(item)

    provider = (LLM_PROVIDER or "mock").lower()
    if provider in ("mock", "none", "") or not LLM_API_KEY:
        return [_mock_analyze_one(f, mode) for f in enriched]
    return await _analyze_via_llm(enriched, mode, categories)


def list_providers() -> list[dict[str, Any]]:
    items = [
        {"id": "mock", "name": "Mock (离线规则)", "available": True},
        {"id": "openai", "name": "OpenAI 兼容接口", "available": bool(LLM_API_KEY)},
        {"id": "anthropic", "name": "Anthropic Claude", "available": False},
    ]
    return items


def get_current_provider() -> dict[str, Any]:
    provider = LLM_PROVIDER or "mock"
    return {
        "provider": provider,
        "model": LLM_MODEL,
        "baseUrl": LLM_BASE_URL,
        "hasApiKey": bool(LLM_API_KEY),
    }
