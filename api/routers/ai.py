from __future__ import annotations

from typing import Any, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from api.services import ai_service

router = APIRouter(prefix="/api", tags=["ai"])


class FileRef(BaseModel):
    path: str
    size: Optional[int] = None
    name: Optional[str] = None


class AnalyzeRequest(BaseModel):
    files: list
    mode: Optional[str] = "simple"
    categories: Optional[list[str]] = None


def _normalize_files(raw: list) -> list[dict]:
    normalized: list[dict] = []
    for item in raw:
        if isinstance(item, str):
            normalized.append({"path": item, "name": item, "size": None})
        elif isinstance(item, dict):
            normalized.append({
                "path": item.get("path") or item.get("filePath") or item.get("name") or "",
                "name": item.get("name") or item.get("path") or "",
                "size": item.get("size"),
            })
        else:
            d = item.model_dump() if hasattr(item, "model_dump") else {}
            normalized.append({
                "path": d.get("path") or d.get("filePath") or d.get("name") or "",
                "name": d.get("name") or d.get("path") or "",
                "size": d.get("size"),
            })
    return normalized


@router.get("/ai/providers")
async def providers() -> dict[str, Any]:
    try:
        items = ai_service.list_providers()
        return {"providers": items, "current": ai_service.get_current_provider()}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/ai/analyze")
async def analyze(req: AnalyzeRequest) -> dict[str, Any]:
    try:
        if not req.files:
            raise HTTPException(status_code=400, detail="文件列表不能为空")
        payload = _normalize_files(req.files)
        suggestions = await ai_service.analyze_files(
            files=payload,
            mode=req.mode or "simple",
            categories=req.categories,
        )
        return {"suggestions": suggestions}
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"分析失败: {exc}")
