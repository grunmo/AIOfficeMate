from __future__ import annotations

import os
import shutil
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Optional

from api.config import APP_WORK_DIR, ensure_within_work_dir, resolve_relative


@dataclass
class FileInfo:
    name: str
    path: str
    is_dir: bool
    size: int = 0
    mtime: float = 0
    ext: str = ""
    children: list[dict[str, Any]] = field(default_factory=list)


def _resolve_safe_path(raw: str) -> Path:
    p = resolve_relative(raw)
    if not ensure_within_work_dir(p):
        raise ValueError("操作路径超出工作目录范围")
    return p


def _to_rel(path: Path) -> str:
    try:
        return str(path.relative_to(APP_WORK_DIR))
    except ValueError:
        return str(path)


def _human_size(sz: int) -> int:
    return int(sz)


def list_directory(dir_path: str = "") -> list[dict[str, Any]]:
    target = _resolve_safe_path(dir_path or ".") if dir_path else APP_WORK_DIR
    if not target.exists():
        raise FileNotFoundError(f"路径不存在: {dir_path}")
    if not target.is_dir():
        raise NotADirectoryError(f"目标不是目录: {dir_path}")
    result: list[dict[str, Any]] = []
    for item in sorted(target.iterdir(), key=lambda p: (not p.is_dir(), p.name.lower())):
        info = _stat_item(item)
        result.append(info)
    return result


def _stat_item(item: Path) -> dict[str, Any]:
    is_dir = item.is_dir()
    try:
        stat = item.stat()
        size = stat.st_size if not is_dir else 0
        mtime = stat.st_mtime
    except OSError:
        size = 0
        mtime = 0
    return {
        "name": item.name,
        "path": _to_rel(item),
        "isDir": is_dir,
        "size": _human_size(size),
        "mtime": mtime,
        "ext": item.suffix.lstrip(".") if not is_dir else "",
    }


def build_tree(dir_path: str = "", max_depth: int = 4) -> dict[str, Any]:
    target = _resolve_safe_path(dir_path or ".") if dir_path else APP_WORK_DIR
    if not target.exists():
        raise FileNotFoundError(f"路径不存在: {dir_path}")
    if not target.is_dir():
        raise NotADirectoryError(f"目标不是目录: {dir_path}")

    def _walk(node: Path, depth: int) -> dict[str, Any]:
        children: list[dict[str, Any]] = []
        try:
            for child in sorted(node.iterdir(), key=lambda p: (not p.is_dir(), p.name.lower())):
                if child.is_dir():
                    if depth < max_depth:
                        children.append(_walk(child, depth + 1))
                    else:
                        children.append({
                            "name": child.name,
                            "path": _to_rel(child),
                            "isDir": True,
                            "children": [],
                        })
                else:
                    stat = child.stat()
                    children.append({
                        "name": child.name,
                        "path": _to_rel(child),
                        "isDir": False,
                        "size": int(stat.st_size),
                        "mtime": stat.st_mtime,
                        "ext": child.suffix.lstrip("."),
                    })
        except PermissionError:
            pass
        return {
            "name": node.name,
            "path": _to_rel(node),
            "isDir": True,
            "children": children,
        }

    return _walk(target, 0)


def rename_file(old_path: str, new_name: str) -> dict[str, Any]:
    src = _resolve_safe_path(old_path)
    if not src.exists():
        raise FileNotFoundError(f"源文件不存在")
    target = src.with_name(new_name)
    if target.exists():
        raise FileExistsError(f"目标已存在")
    if not ensure_within_work_dir(target):
        raise ValueError("重命名目标超出工作目录范围")
    src.rename(target)
    return {
        "oldPath": _to_rel(src), "newPath": _to_rel(target), "ok": True}


def move_file(source: str, target_dir: str) -> dict[str, Any]:
    src = _resolve_safe_path(source)
    dst_dir = _resolve_safe_path(target_dir)
    if not src.exists():
        raise FileNotFoundError(f"源文件不存在")
    if not dst_dir.is_dir():
        dst_dir.mkdir(parents=True, exist_ok=True)
    dst = dst_dir / src.name
    if dst.exists():
        stem = src.stem
        suffix = src.suffix
        idx = 1
        while dst.exists():
            dst = dst_dir / f"{stem}_{idx}{suffix}"
            idx += 1
    shutil.move(str(src), str(dst))
    return {
        "source": _to_rel(src),
        "target": _to_rel(dst),
        "ok": True,
    }


def ensure_work_dir() -> Path:
    if not APP_WORK_DIR.exists():
        APP_WORK_DIR.mkdir(parents=True, exist_ok=True)
    return APP_WORK_DIR
