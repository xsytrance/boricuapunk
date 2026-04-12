#!/usr/bin/env python3
import hashlib
import json
import os
import shutil
import sys
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Tuple
from urllib import request as urlrequest

ROOT = Path(__file__).resolve().parents[1]
DROP_ROOT = ROOT / "data" / "dropbox"
INCOMING_DIR = DROP_ROOT / "incoming"
PROCESSED_DIR = DROP_ROOT / "processed"
DUPLICATES_DIR = DROP_ROOT / "duplicates"
FAILED_DIR = DROP_ROOT / "failed"
INDEX_PATH = ROOT / "data" / "runtime" / "dropbox-ingest-index.json"
API_URL = os.getenv("BORICUAPUNK_INGEST_URL", "http://127.0.0.1:9998/api/archive/ingest")
POLL_SECONDS = int(os.getenv("BORICUAPUNK_DROPBOX_POLL_SECONDS", "5"))

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff"}


@dataclass
class IngestResult:
    ok: bool
    status: int
    message: str


def ensure_dirs() -> None:
    for folder in (INCOMING_DIR, PROCESSED_DIR, DUPLICATES_DIR, FAILED_DIR, INDEX_PATH.parent):
        folder.mkdir(parents=True, exist_ok=True)


def load_index() -> Dict:
    if not INDEX_PATH.exists():
        return {"hashes": {}}
    try:
        return json.loads(INDEX_PATH.read_text())
    except Exception:
        return {"hashes": {}}


def save_index(index: Dict) -> None:
    INDEX_PATH.write_text(json.dumps(index, indent=2))


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def timestamp() -> str:
    return datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")


def safe_move(src: Path, dst_dir: Path) -> Path:
    candidate = dst_dir / src.name
    if not candidate.exists():
        shutil.move(str(src), str(candidate))
        return candidate

    stem = src.stem
    suffix = src.suffix
    candidate = dst_dir / f"{stem}-{timestamp()}{suffix}"
    shutil.move(str(src), str(candidate))
    return candidate


def build_multipart(file_path: Path, caption: str) -> Tuple[bytes, str]:
    boundary = f"----boricuapunk-{int(time.time() * 1000)}"
    file_bytes = file_path.read_bytes()
    filename = file_path.name
    mime_type = guess_mime(file_path.suffix.lower())

    lines = []
    lines.append(f"--{boundary}\r\n".encode())
    lines.append(b'Content-Disposition: form-data; name="source"\r\n\r\n')
    lines.append(b"manual\r\n")

    lines.append(f"--{boundary}\r\n".encode())
    lines.append(b'Content-Disposition: form-data; name="caption"\r\n\r\n')
    lines.append(caption.encode("utf-8", errors="ignore"))
    lines.append(b"\r\n")

    lines.append(f"--{boundary}\r\n".encode())
    lines.append(
        f'Content-Disposition: form-data; name="photo"; filename="{filename}"\r\n'.encode()
    )
    lines.append(f"Content-Type: {mime_type}\r\n\r\n".encode())
    lines.append(file_bytes)
    lines.append(b"\r\n")

    lines.append(f"--{boundary}--\r\n".encode())

    body = b"".join(lines)
    content_type = f"multipart/form-data; boundary={boundary}"
    return body, content_type


def guess_mime(ext: str) -> str:
    return {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".gif": "image/gif",
        ".bmp": "image/bmp",
        ".tiff": "image/tiff",
    }.get(ext, "application/octet-stream")


def ingest_file(file_path: Path) -> IngestResult:
    caption = f"dropbox ingest {file_path.stem}"
    body, content_type = build_multipart(file_path, caption)

    req = urlrequest.Request(API_URL, data=body, method="POST")
    req.add_header("Content-Type", content_type)

    try:
        with urlrequest.urlopen(req, timeout=120) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            payload = json.loads(raw)
            if payload.get("ok"):
                return IngestResult(ok=True, status=resp.status, message="ingested")
            return IngestResult(ok=False, status=resp.status, message=payload.get("error", "unknown ingest error"))
    except Exception as exc:
        return IngestResult(ok=False, status=0, message=str(exc))


def process_one(file_path: Path, index: Dict) -> None:
    ext = file_path.suffix.lower()
    if ext not in SUPPORTED_EXTENSIONS:
        return

    file_hash = sha256_file(file_path)
    if file_hash in index["hashes"]:
        moved = safe_move(file_path, DUPLICATES_DIR)
        print(f"[duplicate] {file_path.name} -> {moved}")
        return

    result = ingest_file(file_path)
    if result.ok:
        moved = safe_move(file_path, PROCESSED_DIR)
        index["hashes"][file_hash] = {
            "processedAt": datetime.now(timezone.utc).isoformat(),
            "file": moved.name,
        }
        save_index(index)
        print(f"[ok] {file_path.name} -> {moved}")
    else:
        moved = safe_move(file_path, FAILED_DIR)
        print(f"[failed] {file_path.name} -> {moved} | {result.message}", file=sys.stderr)


def scan_once(index: Dict) -> None:
    files = sorted(
        [p for p in INCOMING_DIR.iterdir() if p.is_file() and not p.name.startswith(".")],
        key=lambda p: p.stat().st_mtime,
    )
    for file_path in files:
        process_one(file_path, index)


def main() -> int:
    once = "--once" in sys.argv
    ensure_dirs()
    index = load_index()

    print(f"watching: {INCOMING_DIR}")
    print(f"ingest API: {API_URL}")

    if once:
        scan_once(index)
        return 0

    while True:
        scan_once(index)
        time.sleep(POLL_SECONDS)


if __name__ == "__main__":
    raise SystemExit(main())
