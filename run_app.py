"""PyInstaller 入口脚本：运行此文件可启动服务。"""
from __future__ import annotations

import os
import sys

# 让模块解析到项目根
_ROOT = os.path.dirname(os.path.abspath(__file__))
if _ROOT not in sys.path:
    sys.path.insert(0, _ROOT)

if __name__ == "__main__":
    # 延迟导入，便于 PyInstaller 打包
    os.environ.setdefault("APP_PORT", "8000")
    os.environ.setdefault("APP_HOST", "127.0.0.1")
    from api.main import app  # noqa: F401
    import uvicorn

    port = int(os.environ.get("APP_PORT", "8000"))
    host = os.environ.get("APP_HOST", "127.0.0.1")
    try:
        if os.environ.get("NO_BROWSER") not in ("1", "true", "True"):
            import webbrowser
            webbrowser.open(f"http://127.0.0.1:{port}/")
    except Exception:
        pass
    uvicorn.run(app, host=host, port=port, log_level="info")
