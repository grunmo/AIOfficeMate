from __future__ import annotations

import sqlite3
import threading
from pathlib import Path
from typing import Iterator, Optional

_db_path: Optional[Path] = None
_local = threading.local()


def _init_db_path() -> Path:
    global _db_path
    if _db_path is None:
        home = Path.home()
        base = home / ".ai-office-helper"
        base.mkdir(parents=True, exist_ok=True)
        _db_path = base / "data.db"
    return _db_path


def _create_tables(conn: sqlite3.Connection) -> None:
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS knowledge_spaces (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT DEFAULT '',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            space_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            file_path TEXT DEFAULT '',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(space_id) REFERENCES knowledge_spaces(id) ON DELETE CASCADE
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS doc_chunks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            doc_id INTEGER NOT NULL,
            space_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            FOREIGN KEY(doc_id) REFERENCES documents(id) ON DELETE CASCADE,
            FOREIGN KEY(space_id) REFERENCES knowledge_spaces(id) ON DELETE CASCADE
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS ai_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            provider TEXT,
            model TEXT,
            mode TEXT,
            input_text TEXT,
            output_text TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.commit()


def get_db_conn() -> sqlite3.Connection:
    """获取一个数据库连接（线程隔离）。"""
    db_path = _init_db_path()
    if not hasattr(_local, "conn") or _local.conn is None:
        conn = sqlite3.connect(str(db_path), check_same_thread=False)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON")
        _create_tables(conn)
        _local.conn = conn
    return _local.conn


def new_db_conn() -> sqlite3.Connection:
    """创建一个全新的连接，适合独立事务。"""
    db_path = _init_db_path()
    conn = sqlite3.connect(str(db_path), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    _create_tables(conn)
    return conn


def iter_cursor() -> Iterator[sqlite3.Cursor]:
    conn = get_db_conn()
    cur = conn.cursor()
    try:
        yield cur
        conn.commit()
    finally:
        cur.close()
