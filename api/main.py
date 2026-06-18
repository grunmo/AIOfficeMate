from __future__ import annotations

import logging
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.config import APP_PORT, APP_VERSION, APP_WORK_DIR, ensure_within_work_dir, resolve_relative
from api.db import get_db_conn
from api.routers import ai, files, knowledge, scan, settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s - %(message)s")
logger = logging.getLogger("api.main")


app = FastAPI(
    title="AI Office Helper API",
    version=APP_VERSION,
    description="智能办公助手后端：文件管理、扫描件处理、AI 命名分类、知识空间问答。",
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
    return {"ok": True, "version": APP_VERSION, "workDir": str(APP_WORK_DIR)}


@app.get("/api/", include_in_schema=False)
async def api_root() -> dict[str, Any]:
    return {
        "name": "AI Office Helper",
        "version": APP_VERSION,
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/api/health",
    }


def _bootstrap() -> None:
    get_db_conn()
    if not APP_WORK_DIR.exists():
        APP_WORK_DIR.mkdir(parents=True, exist_ok=True)
    logger.info("工作目录: %s", APP_WORK_DIR)


_bootstrap()


def print_startup_info(port: int = APP_PORT) -> None:
    print(f"✓ AI Office Helper v{APP_VERSION}")
    print(f"  - API Base:  http://127.0.0.1:{port}/api/")
    print(f"  - Docs:      http://127.0.0.1:{port}/docs")
    print(f"  - Redoc:     http://127.0.0.1:{port}/redoc")
    print(f"  - Health:    http://127.0.0.1:{port}/api/health")
    print(f"  - Work Dir:  {APP_WORK_DIR}")


if __name__ == "__main__":
    import uvicorn
    print_startup_info()
    uvicorn.run("api.main:app", host="127.0.0.1", port=APP_PORT, reload=False)
else:
    try:
        print_startup_info()
    except Exception:
        pass
