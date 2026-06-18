from __future__ import annotations

from typing import Any, Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from api.services import file_service

router = APIRouter(prefix="/api", tags=["files"])


class RenameRequest(BaseModel):
    oldPath: str
    newName: str


class MoveRequest(BaseModel):
    source: str
    targetDir: str


class FileNodeResponse(BaseModel):
    name: str
    path: str
    isDir: bool
    children: Optional[list[dict[str, Any]]] = None


@router.get("/files/tree")
async def get_tree(path: str = Query("", description="目录相对路径")) -> dict[str, Any]:
    try:
        tree = file_service.build_tree(path)
        return {"tree": tree}
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except NotADirectoryError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=403, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"读取目录失败: {exc}")


@router.get("/files/list")
async def list_files(path: str = Query("", description="目录相对路径")) -> dict[str, Any]:
    try:
        items = file_service.list_directory(path)
        return {"path": path, "items": items}
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except NotADirectoryError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=403, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"读取目录失败: {exc}")


@router.post("/files/rename")
async def rename(req: RenameRequest) -> dict[str, Any]:
    try:
        result = file_service.rename_file(req.oldPath, req.newName)
        return result
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except FileExistsError as exc:
        raise HTTPException(status_code=409, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=403, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"重命名失败: {exc}")


@router.post("/files/move")
async def move(req: MoveRequest) -> dict[str, Any]:
    try:
        result = file_service.move_file(req.source, req.targetDir)
        return result
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=403, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"移动失败: {exc}")
