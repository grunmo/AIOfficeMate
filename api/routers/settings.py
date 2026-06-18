from __future__ import annotations

from typing import Any, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from api.services import settings_service

router = APIRouter(prefix="/api", tags=["settings"])


class SettingsUpdate(BaseModel):
    workDir: Optional[str] = None
    llm: Optional[dict[str, Any]] = None
    scan: Optional[dict[str, Any]] = None
    ui: Optional[dict[str, Any]] = None
    raw: Optional[dict[str, Any]] = None


@router.get("/settings")
async def get_settings() -> dict[str, Any]:
    try:
        stored = settings_service.get_all()
        defaults = settings_service.default_settings()
        merged = {**defaults, **stored}
        return {"settings": merged}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.put("/settings")
async def update_settings(payload: SettingsUpdate) -> dict[str, Any]:
    try:
        if payload.raw:
            settings_service.update_many(payload.raw)
        else:
            if payload.workDir is not None:
                settings_service.set("workDir", payload.workDir)
            if payload.llm is not None:
                settings_service.set("llm", payload.llm)
            if payload.scan is not None:
                settings_service.set("scan", payload.scan)
            if payload.ui is not None:
                settings_service.set("ui", payload.ui)
        return {"ok": True, "settings": settings_service.get_all()}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/settings/{key}")
async def get_setting(key: str) -> dict[str, Any]:
    try:
        value = settings_service.get(key)
        return {"key": key, "value": value}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
