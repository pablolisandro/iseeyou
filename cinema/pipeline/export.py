#!/usr/bin/env python3
"""Export NOW, SEE YOURSELF from the sequence manifest.

Uses only files declared in picture and music. Refuses to invent shots,
animate stills, or pick a temp score. An empty picture writes nothing.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SEQUENCE = ROOT / "sequences" / "now-see-yourself.json"
EXPORTS = ROOT / "exports"

VIDEO_EXT = {".mp4", ".webm", ".mov"}
AUDIO_EXT = {".mp3", ".wav", ".flac", ".m4a", ".aac"}


class ExportError(Exception):
    pass


def resolve_under(src: str, folder: str, extensions: set[str]) -> Path:
    raw = Path(src)
    if raw.is_absolute() or ".." in raw.parts:
        raise ExportError(f"ruta no permitida: {src}")
    path = (ROOT / raw).resolve()
    base = (ROOT / "media" / folder).resolve()
    if path != base and base not in path.parents:
        raise ExportError(f"fuera de media/{folder}: {src}")
    if path.suffix.lower() not in extensions:
        raise ExportError(f"extensión no admitida: {src}")
    if not path.is_file():
        raise ExportError(f"no existe: {src}")
    return path


def probe_duration(path: Path) -> float:
    if shutil.which("ffprobe") is None:
        raise ExportError("ffprobe no está instalado")
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=nw=1:nk=1",
            str(path),
        ],
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise ExportError(result.stderr.strip() or f"ffprobe falló en {path.name}")
    try:
        duration = float(result.stdout.strip())
    except ValueError as error:
        raise ExportError(f"duración ilegible: {path.name}") from error
    if duration <= 0:
        raise ExportError(f"duración vacía: {path.name}")
    return duration


def load_clips(picture: list[dict]) -> list[dict]:
    clips = []
    for item in picture:
        if not isinstance(item, dict) or "src" not in item:
            raise ExportError("cada plano necesita src")
        path = resolve_under(str(item["src"]), "video", VIDEO_EXT)
        duration = probe_duration(path)
        start = float(item.get("in") or 0)
        end = duration if item.get("out") is None else float(item["out"])
        if start < 0 or end <= start:
            raise ExportError(f"in/out inválidos en {item['src']}")
        if end > duration + 0.05:
            raise ExportError(f"out supera al archivo {item['src']}")
        end = min(end, duration)
        clips.append({"path": path, "start": start, "end": end, "dur": end - start})
    return clips


def load_music(music: dict | None, picture_duration: float) -> dict | None:
    if not music:
        return None
    if not isinstance(music, dict) or "src" not in music:
        raise ExportError("music tiene que ser null o un objeto con src")
    path = resolve_under(str(music["src"]), "music", AUDIO_EXT)
    duration = probe_duration(path)
    start = float(music.get("in") or 0)
    if start < 0 or start >= duration:
        raise ExportError("el in de la música cae fuera del archivo")
    if start + picture_duration > duration + 0.05:
        raise ExportError(
            "la música es más corta que la imagen; no se estira ni se repite"
        )
    return {"path": path, "start": start, "end": start + picture_duration}


def ffmpeg_command(clips: list[dict], music: dict | None, dest: Path) -> list[str]:
    if shutil.which("ffmpeg") is None:
        raise ExportError("ffmpeg no está instalado")
    filters = []
    parts = []
    for index, clip in enumerate(clips):
        filters.append(
            f"[{index}:v]trim=start={clip['start']:.3f}:end={clip['end']:.3f},"
            "setpts=PTS-STARTPTS,"
            "scale=1920:1080:force_original_aspect_ratio=decrease,"
            "pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=24"
            f"[v{index}]"
        )
        parts.append(f"[v{index}]")
    filters.append("".join(parts) + f"concat=n={len(clips)}:v=1:a=0[v]")
    command = ["ffmpeg", "-y", "-loglevel", "error"]
    for clip in clips:
        command += ["-i", str(clip["path"])]
    if music:
        command += ["-i", str(music["path"])]
        music_index = len(clips)
        filters.append(
            f"[{music_index}:a]atrim=start={music['start']:.3f}:end={music['end']:.3f},"
            "asetpts=PTS-STARTPTS[a]"
        )
    command += [
        "-filter_complex",
        ";".join(filters),
        "-map",
        "[v]",
    ]
    if music:
        command += ["-map", "[a]", "-c:a", "aac", "-b:a", "192k"]
    else:
        command += ["-an"]
    command += [
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        str(dest),
    ]
    return command


def report_gaps(manifest: dict) -> None:
    for gap in manifest.get("gaps") or []:
        print(f"- {gap.get('id')}: {gap.get('status')} — {gap.get('note')}")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sequence", type=Path, default=SEQUENCE)
    parser.add_argument("--out", type=Path, default=EXPORTS / "now-see-yourself-web.mp4")
    parser.add_argument(
        "--check",
        action="store_true",
        help="valida las rutas y no escribe un archivo",
    )
    args = parser.parse_args(argv)
    try:
        manifest = json.loads(args.sequence.read_text(encoding="utf-8"))
        picture = manifest.get("picture") or []
        if not picture:
            report_gaps(manifest)
            print(
                "Exportación cancelada: no hay picture. No se escribió ningún archivo.",
                file=sys.stderr,
            )
            return 2
        clips = load_clips(picture)
        music = load_music(manifest.get("music"), sum(clip["dur"] for clip in clips))
        if args.check:
            print(f"picture: {len(clips)} plano(s)")
            print("music: asignada" if music else "music: null, la salida sería muda")
            return 0
        args.out.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(ffmpeg_command(clips, music, args.out), check=True)
    except (ExportError, json.JSONDecodeError, OSError, subprocess.CalledProcessError) as error:
        print(str(error), file=sys.stderr)
        return 1
    if manifest.get("music") is None:
        print("Exportación muda: music es null. No se eligió ningún tema.")
    print(args.out)
    return 0


if __name__ == "__main__":
    sys.exit(main())
