from __future__ import annotations

from typing import Any, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from api.services import scan_service

router = APIRouter(prefix="/api", tags=["scan"])


class EnhanceRequest(BaseModel):
    filePath: str
    deskew: Optional[bool] = True
    rotate: Optional[int] = 0
    contrast: Optional[float] = 1.0
    brightness: Optional[float] = 1.0
    auto: Optional[bool] = False


class EnhanceResponse(BaseModel):
    outputPath: str
    applied: list[str]


@router.post("/scan/enhance")
async def enhance(req: EnhanceRequest) -> dict[str, Any]:
    try:
        deskew = True if req.auto else req.deskew
        contrast = 1.1 if req.auto else (req.contrast or 1.0)
        brightness = 1.05 if req.auto else (req.brightness or 1.0)
        rotate = req.rotate or 0
        result = scan_service.enhance_image(
            file_path=req.filePath,
            deskew=deskew,
            rotate=rotate,
            contrast=contrast,
            brightness=brightness,
        )
        return result
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"图像处理失败: {exc}")
