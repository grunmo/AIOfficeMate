from __future__ import annotations

import json
import sqlite3
from typing import Any, Optional

from api.db import get_db_conn


def _get_raw(key: str) -> Optional[str]:
    conn = get_db_conn()
    row = conn.execute("SELECT value FROM settings WHERE key = ?", (key,)).fetchone()
    if row is None:
        return None
    return row["value"]


def get_all() -> dict[str, Any]:
    conn = get_db_conn()
    rows = conn.execute("SELECT key, value FROM settings").fetchall()
    data: dict[str, Any] = {}
    for r in rows:
        try:
            data[r["key"]] = json.loads(r["value"])
        except (json.JSONDecodeError, TypeError):
            data[r["key"]] = r["value"]
    return data


def get(key: str, default: Any = None) -> Any:
    raw = _get_raw(key)
    if raw is None:
        return default
    try:
        return json.loads(raw)
    except (json.JSONDecodeError, TypeError):
        return raw


def set(key: str, value: Any) -> None:
    conn = get_db_conn()
    if isinstance(value, (dict, list)):
        stored = json.dumps(value, ensure_ascii=False)
    else:
        stored = str(value)
    conn.execute(
        "INSERT INTO settings (key, value) VALUES (?, ?) "
        "ON CONFLICT(key) DO UPDATE SET value = excluded.value",
        (key, stored),
    )
    conn.commit()


def update_many(items: dict[str, Any]) -> None:
    if not items:
        return
    for k, v in items.items():
        set(k, v)


def delete(key: str) -> bool:
    conn = get_db_conn()
    conn.execute("DELETE FROM settings WHERE key = ?", (key,))
    conn.commit()
    return True


def default_settings() -> dict[str, Any]:
    return {
        "workDir": "",
        "llm": {
            "provider": "mock",
            "apiKey": "",
            "baseUrl": "https://api.openai.com/v1",
            "model": "gpt-4o-mini",
        },
        "scan": {
            "deskew": True,
            "contrast": 1.1,
            "brightness": 1.0,
        },
        "ui": {
            "language": "zh-CN",
            "theme": "light",
        },
    }
