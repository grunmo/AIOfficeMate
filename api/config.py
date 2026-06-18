from __future__ import annotations

import os
from pathlib import Path
from typing import Optional

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


def _resolve_work_dir(raw: str) -> Path:
    expanded = os.path.expanduser(raw)
    p = Path(expanded).resolve()
    if not p.exists():
        p.mkdir(parents=True, exist_ok=True)
    return p


APP_VERSION = "0.1.0"

APP_WORK_DIR: Path = _resolve_work_dir(
    os.getenv("APP_WORK_DIR", "~/Documents/ai-office-helper")
)

APP_PORT: int = int(os.getenv("APP_PORT", "8000"))

LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "mock")
LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
LLM_BASE_URL: str = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1")
LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-4o-mini")


def get_llm_config() -> dict[str, str]:
    return {
        "provider": LLM_PROVIDER,
        "api_key": LLM_API_KEY,
        "base_url": LLM_BASE_URL,
        "model": LLM_MODEL,
    }


def get_work_dir() -> Path:
    return APP_WORK_DIR


def set_work_dir(path: str) -> Path:
    global APP_WORK_DIR
    APP_WORK_DIR = _resolve_work_dir(path)
    return APP_WORK_DIR


def resolve_relative(path: str) -> Path:
    """把传入路径解析为工作目录下的绝对路径。"""
    p = Path(os.path.expanduser(path))
    if p.is_absolute():
        return p.resolve()
    return (APP_WORK_DIR / p).resolve()


def ensure_within_work_dir(path: Path) -> bool:
    try:
        work = APP_WORK_DIR.resolve()
        target = path.resolve()
        return str(target).startswith(str(work))
    except Exception:
        return False
