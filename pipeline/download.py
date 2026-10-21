"""Download a source video from a YouTube (or other yt-dlp supported) URL.

Usage: python3 download.py <url> <out_path.mp4>
Prints a single JSON line with {title, duration} on success.
"""
import sys
import json

from yt_dlp import YoutubeDL


def main() -> None:
    url, out_path = sys.argv[1], sys.argv[2]

    ydl_opts = {
        "format": "bv*[height<=1080][ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b",
        "outtmpl": out_path,
        "merge_output_format": "mp4",
        "quiet": True,
        "no_warnings": True,
        "noplaylist": True,
        "noprogress": True,
    }

    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)

    print(json.dumps({
        "title": info.get("title"),
        "duration": info.get("duration"),
    }))


if __name__ == "__main__":
    main()
