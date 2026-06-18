from __future__ import annotations

import logging
import os
import sys
import webbrowser
from pathlib import Path
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from api.config import APP_PORT, APP_VERSION, APP_WORK_DIR
from api.db import get_db_conn
from api.routers import ai, files, knowledge, scan, settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s - %(message)s")
logger = logging.getLogger("api.main")


def _resource_path(relative: str = "") -> Path:
    """在 PyInstaller 冻结环境下返回 _MEIPASS 内资源路径；否则返回项目根目录。"""
    if getattr(sys, "frozen", False):
        base = Path(getattr(sys, "_MEIPASS", Path(sys.executable).resolve().parent))
    else:
        base = Path(__file__).resolve().parent.parent
    if relative:
        return base / relative
    return base


APP_NAME = "AI办公助手"
STATIC_DIR = _resource_path("dist")


app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description=f"{APP_NAME} 后端：文件管理、扫描件处理、AI 命名分类、知识空间问答。",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(files.router)
app.include_router(scan.router)
app.include_router(ai.router)
app.include_router(knowledge.router)
app.include_router(settings.router)


@app.get("/api/health", tags=["health"])
async def health() -> dict[str, Any]:
    return {
        "ok": True,
        "version": APP_VERSION,
        "workDir": str(APP_WORK_DIR),
        "frozen": bool(getattr(sys, "frozen", False)),
    }


@app.get("/api/", include_in_schema=False)
async def api_root() -> dict[str, Any]:
    return {
        "name": APP_NAME,
        "version": APP_VERSION,
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/api/health",
        "ui": "/",
    }


def _bootstrap() -> None:
    get_db_conn()
    if not APP_WORK_DIR.exists():
        APP_WORK_DIR.mkdir(parents=True, exist_ok=True)
    logger.info("工作目录: %s", APP_WORK_DIR)


_bootstrap()


# 挂载前端静态资源（放在 API 路由之后以避免 404 误处理）
if STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="ui")
    logger.info("已挂载前端静态资源: %s", STATIC_DIR)
else:
    logger.warning("未找到前端静态目录 %s，仅提供 API 服务。", STATIC_DIR)


def print_startup_info(port: int = APP_PORT) -> None:
    print("=" * 60)
    print(f"  {APP_NAME}  v{APP_VERSION}")
    print("=" * 60)
    print(f"  - 管理界面: http://127.0.0.1:{port}/")
    print(f"  - API 入口: http://127.0.0.1:{port}/api/")
    print(f"  - Docs    : http://127.0.0.1:{port}/docs")
    print(f"  - Health  : http://127.0.0.1:{port}/api/health")
    print(f"  - WorkDir : {APP_WORK_DIR}")
    if getattr(sys, "frozen", False):
        print(f"  - Bundle  : {Path(sys.executable).resolve()}")
    print("=" * 60)


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("APP_PORT", APP_PORT))
    host = os.environ.get("APP_HOST", "127.0.0.1")
    print_startup_info(port)
    try:
        if os.environ.get("NO_BROWSER") not in ("1", "true", "True"):
            webbrowser.open(f"http://127.0.0.1:{port}/")
    except Exception:
        pass
    uvicorn.run(app, host=host, port=port, log_level="info")
else:
    try:
        print_startup_info()
    except Exception:
        pass
