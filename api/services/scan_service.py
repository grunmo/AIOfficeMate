from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, Optional

from PIL import Image, ImageEnhance, ImageOps

from api.config import ensure_within_work_dir, resolve_relative

logger = logging.getLogger(__name__)

try:
    import cv2
    import numpy as np
    _HAS_CV2 = True
except Exception:
    cv2 = None
    np = None
    _HAS_CV2 = False


def _load_image(path: Path) -> Image.Image:
    img = Image.open(str(path))
    if img.mode != "RGB":
        img = img.convert("RGB")
    return img


def _save_image(img: Image.Image, out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(str(out_path))


def _deskew_cv2(img: Image.Image) -> tuple[Image.Image, float]:
    """使用 OpenCV + 霍夫变换纠偏。若 cv2 不可用，返回原图像。"""
    if not _HAS_CV2 or cv2 is None or np is None:
        return img, 0.0
    try:
        gray = img.convert("L")
        arr = np.asarray(gray, dtype=np.uint8)
        edges = cv2.Canny(arr, 50, 150, apertureSize=3)
        lines = cv2.HoughLines(edges, 1, np.pi / 180, 200)
        if lines is None or len(lines) == 0:
            return img, 0.0
        angles: list[float] = []
        for rho_theta in lines[:50]:
            _, theta = rho_theta[0]
            degree = (theta * 180.0 / np.pi) - 90.0
            if abs(degree) < 45:
                angles.append(degree)
        if not angles:
            return img, 0.0
        angle = float(np.mean(angles))
        if abs(angle) < 0.5:
            return img, 0.0
        arr_full = np.asarray(img, dtype=np.uint8)
        h, w = arr_full.shape[:2]
        center = (w / 2, h / 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(arr_full, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
        new_img = Image.fromarray(rotated)
        return new_img, angle
    except Exception as exc:
        logger.warning("纠偏失败，跳过: %s", exc)
        return img, 0.0


def _build_output_path(src: Path) -> Path:
    name = src.stem + "_enhanced" + src.suffix
    out = src.with_name(name)
    idx = 1
    while out.exists():
        out = src.with_name(f"{src.stem}_enhanced_{idx}{src.suffix}")
        idx += 1
    return out


def enhance_image(
    file_path: str,
    deskew: bool = True,
    rotate: int = 0,
    contrast: float = 1.0,
    brightness: float = 1.0,
) -> dict[str, Any]:
    src = resolve_relative(file_path)
    if not ensure_within_work_dir(src):
        raise ValueError("路径超出工作目录范围")
    if not src.exists():
        raise FileNotFoundError(f"文件不存在: {file_path}")
    if not src.is_file():
        raise ValueError("目标不是文件")

    applied: list[str] = []
    try:
        img = _load_image(src)
    except Exception as exc:
        raise RuntimeError(f"无法读取图像: {exc}")

    img = ImageOps.exif_transpose(img)
    applied.append("exif_orient")

    if deskew:
        new_img, angle = _deskew_cv2(img)
        if angle != 0.0:
            img = new_img
            applied.append(f"deskew:{angle:.2f}deg")
        else:
            if _HAS_CV2:
                applied.append("deskew:skipped")
            else:
                applied.append("deskew:cv2_not_available")

    if rotate and rotate % 360 != 0:
        img = img.rotate(rotate, expand=True, resample=Image.BICUBIC)
        applied.append(f"rotate:{rotate}deg")

    if contrast and abs(contrast - 1.0) > 0.01:
        img = ImageEnhance.Contrast(img).enhance(contrast)
        applied.append(f"contrast:{contrast:.2f}")

    if brightness and abs(brightness - 1.0) > 0.01:
        img = ImageEnhance.Brightness(img).enhance(brightness)
        applied.append(f"brightness:{brightness:.2f}")

    out_path = _build_output_path(src)
    _save_image(img, out_path)

    return {
        "outputPath": str(out_path),
        "applied": applied,
    }
