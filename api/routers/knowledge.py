from __future__ import annotations

from typing import Any, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from api.services import knowledge_service

router = APIRouter(prefix="/api", tags=["knowledge"])


class SpaceCreate(BaseModel):
    name: str
    description: Optional[str] = ""


class FileRef(BaseModel):
    path: str
    title: Optional[str] = None


class ImportRequest(BaseModel):
    files: list[FileRef]


class ChatRequest(BaseModel):
    spaceId: str | int
    question: str


def _parse_space_id(sid: str | int) -> int:
    if isinstance(sid, int):
        return sid
    if isinstance(sid, str):
        try:
            return int(sid)
        except ValueError:
            return hash(sid) % (10**9)
    return int(sid)


@router.get("/knowledge/spaces")
async def list_spaces() -> dict[str, Any]:
    try:
        spaces = knowledge_service.list_spaces()
        for s in spaces:
            s["id"] = str(s.get("id", ""))
            s["docCount"] = s.pop("doc_count", 0) if "doc_count" in s else 0
        return {"spaces": spaces}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/knowledge/spaces")
async def create_space(payload: SpaceCreate) -> dict[str, Any]:
    try:
        space = knowledge_service.create_space(payload.name, payload.description or "")
        space["id"] = str(space.get("id", ""))
        space["docCount"] = space.pop("doc_count", 0) if "doc_count" in space else 0
        return {"space": space}
    except FileExistsError as exc:
        raise HTTPException(status_code=409, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.delete("/knowledge/spaces/{space_id}")
async def delete_space(space_id: str) -> dict[str, Any]:
    try:
        sid = _parse_space_id(space_id)
        knowledge_service.delete_space(sid)
        return {"ok": True, "id": str(space_id)}
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/knowledge/spaces/{space_id}/documents")
async def list_documents(space_id: str) -> dict[str, Any]:
    try:
        sid = _parse_space_id(space_id)
        docs = knowledge_service.list_documents(sid)
        for d in docs:
            d["id"] = str(d.get("id", ""))
            d["spaceId"] = str(space_id)
            d["filePath"] = d.pop("file_path", "")
        return {"documents": docs}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/knowledge/spaces/{space_id}/import")
async def import_docs(space_id: str, payload: ImportRequest) -> dict[str, Any]:
    try:
        sid = _parse_space_id(space_id)
        files: list[dict] = []
        for f in payload.files:
            if isinstance(f, dict):
                files.append({"path": f.get("path", ""), "title": f.get("title")})
            else:
                d = f.model_dump() if hasattr(f, "model_dump") else {}
                files.append({"path": d.get("path", ""), "title": d.get("title")})
        result = knowledge_service.import_documents(sid, files)
        return {"ok": True, **result}
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/knowledge/chat")
async def chat(payload: ChatRequest) -> dict[str, Any]:
    try:
        sid = _parse_space_id(payload.spaceId)
        result = knowledge_service.chat(sid, payload.question)
        for s in result.get("sources", []):
            s["docId"] = str(s.get("docId", ""))
        return result
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
