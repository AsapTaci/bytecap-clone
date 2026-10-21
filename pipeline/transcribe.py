"""Transcribe a video to word-level timestamps using faster-whisper (local, CPU).

Usage: python3 transcribe.py <video_path> <out_json_path> [model_size]
Writes a transcript JSON to out_json_path and prints a summary JSON line.
"""
import sys
import json

from faster_whisper import WhisperModel


def main() -> None:
    video_path, out_path = sys.argv[1], sys.argv[2]
    model_size = sys.argv[3] if len(sys.argv) > 3 else "small"

    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    segments, info = model.transcribe(
        video_path,
        word_timestamps=True,
        vad_filter=True,
    )

    seg_list = []
    words = []
    for seg in segments:
        seg_list.append({"start": seg.start, "end": seg.end, "text": seg.text.strip()})
        if seg.words:
            for w in seg.words:
                words.append({"start": w.start, "end": w.end, "word": w.word.strip()})

    result = {
        "language": info.language,
        "duration": info.duration,
        "segments": seg_list,
        "words": words,
    }

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f)

    print(json.dumps({"ok": True, "wordCount": len(words), "duration": info.duration}))


if __name__ == "__main__":
    main()
