"""Render one vertical (9:16) clip from a source video: cut, face-tracked
reframe, and burned-in word-highlight captions. Captions are drawn directly
onto frames with Pillow (no libass dependency needed).

Usage:
  python3 render_clip.py <video_path> <start_sec> <end_sec> <words_json> <out_path> [--title "..."]
"""
import sys
import os
import json
import argparse
import subprocess
import tempfile

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

TARGET_W = 720
TARGET_H = 1280

YUNET_MODEL = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "models", "face_detection_yunet_2023mar.onnx"
)

FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial Black.ttf",
    "/System/Library/Fonts/HelveticaNeue.ttc",
]


def load_font(size: int) -> ImageFont.FreeTypeFont:
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except OSError:
                continue
    return ImageFont.load_default(size=size)


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True, capture_output=True)


def ffmpeg_cut(ffmpeg: str, src: str, start: float, duration: float, dst: str) -> None:
    run([
        ffmpeg, "-y", "-ss", str(start), "-i", src, "-t", str(duration),
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
        "-c:a", "aac", "-b:a", "192k", dst,
    ])


def pick_active_speaker(faces, gray, prev_gray):
    """Among detected faces, pick the one most likely talking right now by
    measuring frame-to-frame pixel motion in the mouth region (YuNet gives
    mouth-corner landmarks). Falls back to the largest face when there's
    only one candidate or no previous frame to compare against."""
    if len(faces) == 1 or prev_gray is None:
        return max(faces, key=lambda f: f[2] * f[3])

    best, best_score = None, -1.0
    src_h, src_w = gray.shape[:2]
    for f in faces:
        fw, fh = f[2], f[3]
        rmx, rmy, lmx, lmy = f[10], f[11], f[12], f[13]
        mx, my = int((rmx + lmx) / 2), int((rmy + lmy) / 2)
        mouth_w = max(10, int(abs(lmx - rmx) * 1.4))
        mouth_h = max(8, int(mouth_w * 0.7))
        x0, y0 = max(0, mx - mouth_w // 2), max(0, my - mouth_h // 2)
        x1, y1 = min(src_w, x0 + mouth_w), min(src_h, y0 + mouth_h)
        if x1 <= x0 or y1 <= y0:
            continue
        cur_patch = gray[y0:y1, x0:x1]
        prev_patch = prev_gray[y0:y1, x0:x1]
        if cur_patch.shape != prev_patch.shape or cur_patch.size == 0:
            continue
        motion = float(np.mean(cv2.absdiff(cur_patch, prev_patch)))
        # mild size bias so a small distant face can't win purely on noise
        score = motion * (fw * fh) ** 0.15
        if score > best_score:
            best_score, best = score, f
    return best if best is not None else max(faces, key=lambda f: f[2] * f[3])


def analyze_crop_path(src: str, src_w: int, src_h: int, fps: float):
    """Returns per-frame (cx, cy, crop_h) arrays. crop_h controls zoom: a
    face is kept around ~40% of frame height instead of always showing the
    full source height (which is what left empty/background space in frame
    when the speaker was small or off to one side)."""
    cap = cv2.VideoCapture(src)
    detector = cv2.FaceDetectorYN_create(YUNET_MODEL, "", (src_w, src_h))
    detector.setScoreThreshold(0.6)

    sample_every = max(1, int(round(fps / 8)))  # ~8 detections/sec
    target_face_ratio = 0.40  # desired face-height / crop-height
    min_crop_h = src_h / 1.6  # cap zoom at 1.6x
    max_crop_h = float(src_h)

    last_cx, last_cy = src_w / 2.0, src_h / 2.0
    last_crop_h = max_crop_h
    samples: list[tuple[float, float, float]] = []  # (cx, cy, crop_h) at sampled frames
    sample_idx: list[int] = []

    prev_gray = None
    idx = 0
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        if idx % sample_every == 0:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            _, faces = detector.detect(frame)
            if faces is not None and len(faces) > 0:
                best = pick_active_speaker(faces, gray, prev_gray)
                fx, fy, fw, fh = best[:4]
                last_cx = fx + fw / 2.0
                last_cy = fy + fh * 0.42  # slight headroom above chin
                desired_crop_h = fh / target_face_ratio
                last_crop_h = max(min_crop_h, min(max_crop_h, desired_crop_h))
            prev_gray = gray
            samples.append((last_cx, last_cy, last_crop_h))
            sample_idx.append(idx)
        idx += 1
    total_frames = idx
    cap.release()

    if not samples:
        samples = [(src_w / 2.0, src_h / 2.0, max_crop_h)]
        sample_idx = [0]

    sample_idx_arr = np.array(sample_idx, dtype=np.float64)
    samples_arr = np.array(samples, dtype=np.float64)
    frame_positions = np.arange(total_frames, dtype=np.float64)

    cx = np.interp(frame_positions, sample_idx_arr, samples_arr[:, 0])
    cy = np.interp(frame_positions, sample_idx_arr, samples_arr[:, 1])
    crop_h = np.interp(frame_positions, sample_idx_arr, samples_arr[:, 2])

    def smooth(arr: np.ndarray, window: int) -> np.ndarray:
        if len(arr) <= window:
            return arr
        kernel = np.ones(window) / window
        return np.convolve(arr, kernel, mode="same")

    smooth_window = max(3, int(round(fps * 0.5)) | 1)  # odd, ~0.5s
    cx = smooth(cx, smooth_window)
    cy = smooth(cy, smooth_window)
    crop_h = smooth(crop_h, smooth_window)

    return cx, cy, crop_h


def group_words(
    words: list[dict],
    clip_start: float,
    clip_end: float,
    font: ImageFont.FreeTypeFont,
    max_width: int,
    max_words: int = 5,
) -> list[list[dict]]:
    """Greedily packs words into lines that fit max_width (measured with the
    actual caption font), falling back to max_words as a hard cap."""
    in_range = [w for w in words if w["end"] > clip_start and w["start"] < clip_end]
    measurer = ImageDraw.Draw(Image.new("RGB", (1, 1)))
    spacing = 14

    groups: list[list[dict]] = []
    cur: list[dict] = []
    cur_width = 0.0
    for w in in_range:
        text = w["word"].strip().upper()
        bbox = measurer.textbbox((0, 0), text, font=font)
        w_width = bbox[2] - bbox[0]
        extra = w_width if not cur else spacing + w_width
        if cur and (cur_width + extra > max_width or len(cur) >= max_words):
            groups.append(cur)
            cur = []
            cur_width = 0.0
            extra = w_width
        cur.append(w)
        cur_width += extra
    if cur:
        groups.append(cur)
    return groups


def active_word_text(group: list[dict], t: float, clip_start: float) -> int:
    """Returns index of currently active word within the group."""
    active_idx = -1
    for i, w in enumerate(group):
        if w["start"] - clip_start <= t <= w["end"] - clip_start:
            active_idx = i
            break
    if active_idx == -1:
        for i, w in enumerate(group):
            if w["start"] - clip_start <= t:
                active_idx = i
    return active_idx


def parse_hex_color(value: str | None, default: tuple[int, int, int]) -> tuple[int, int, int]:
    if not value:
        return default
    v = value.strip().lstrip("#")
    if len(v) != 6:
        return default
    try:
        return (int(v[0:2], 16), int(v[2:4], 16), int(v[4:6], 16))
    except ValueError:
        return default


def draw_caption(
    draw: ImageDraw.ImageDraw,
    group: list[dict],
    active_idx: int,
    font: ImageFont.FreeTypeFont,
    width: int,
    y: int,
    highlight_color: tuple[int, int, int] = (255, 214, 10),
) -> None:
    words_text = [w["word"].strip().upper() for w in group]
    spacing = 14
    sizes = [draw.textbbox((0, 0), w, font=font) for w in words_text]
    widths = [b[2] - b[0] for b in sizes]
    total_w = sum(widths) + spacing * (len(words_text) - 1)
    x = (width - total_w) / 2

    for i, w in enumerate(words_text):
        color = highlight_color if i == active_idx else (255, 255, 255)
        for ox, oy in [(-3, 0), (3, 0), (0, -3), (0, 3), (-2, -2), (2, 2), (-2, 2), (2, -2)]:
            draw.text((x + ox, y + oy), w, font=font, fill=(0, 0, 0))
        draw.text((x, y), w, font=font, fill=color)
        x += widths[i] + spacing


def reframe_and_caption(
    src: str,
    dst_noaudio: str,
    words: list[dict],
    clip_start: float,
    clip_end: float,
    title: str | None,
    highlight_color: tuple[int, int, int] = (255, 214, 10),
) -> None:
    cap = cv2.VideoCapture(src)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    src_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    src_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    cap.release()

    cx_path, cy_path, crop_h_path = analyze_crop_path(src, src_w, src_h, fps)

    font = load_font(int(TARGET_H * 0.052))
    title_font = load_font(int(TARGET_H * 0.034))
    caption_max_width = int(TARGET_W * 0.88)
    groups = group_words(words, clip_start, clip_end, font, caption_max_width)
    caption_y = int(TARGET_H * 0.74)

    if title:
        measurer = ImageDraw.Draw(Image.new("RGB", (1, 1)))
        title_max_width = int(TARGET_W * 0.9)
        size = int(TARGET_H * 0.034)
        while size > int(TARGET_H * 0.018):
            title_font = load_font(size)
            tb = measurer.textbbox((0, 0), title.upper(), font=title_font)
            if tb[2] - tb[0] <= title_max_width:
                break
            size -= 2

    cap = cv2.VideoCapture(src)
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(dst_noaudio, fourcc, fps, (TARGET_W, TARGET_H))

    frame_idx = 0
    n_samples = len(cx_path)
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        t = frame_idx / fps
        i = min(frame_idx, n_samples - 1)
        cx, cy, crop_h = cx_path[i], cy_path[i], crop_h_path[i]
        crop_h = max(1.0, min(float(src_h), crop_h))
        crop_w = crop_h * TARGET_W / TARGET_H
        if crop_w > src_w:
            crop_w = float(src_w)
            crop_h = crop_w * TARGET_H / TARGET_W
        crop_w_i, crop_h_i = int(round(crop_w)), int(round(crop_h))
        x0 = int(round(cx - crop_w / 2))
        x0 = max(0, min(x0, src_w - crop_w_i))
        y0 = int(round(cy - crop_h / 2))
        y0 = max(0, min(y0, src_h - crop_h_i))
        cropped = frame[y0:y0 + crop_h_i, x0:x0 + crop_w_i]
        resized = cv2.resize(cropped, (TARGET_W, TARGET_H))

        rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(rgb)
        draw = ImageDraw.Draw(pil_img)

        if title:
            tb = draw.textbbox((0, 0), title.upper(), font=title_font)
            tw = tb[2] - tb[0]
            tx = (TARGET_W - tw) / 2
            ty = int(TARGET_H * 0.06)
            for ox, oy in [(-2, 0), (2, 0), (0, -2), (0, 2)]:
                draw.text((tx + ox, ty + oy), title.upper(), font=title_font, fill=(0, 0, 0))
            draw.text((tx, ty), title.upper(), font=title_font, fill=(255, 255, 255))

        for group in groups:
            g_start = group[0]["start"] - clip_start
            g_end = group[-1]["end"] - clip_start
            if g_start - 0.05 <= t <= g_end + 0.05:
                active_idx = active_word_text(group, t, clip_start)
                draw_caption(draw, group, active_idx, font, TARGET_W, caption_y, highlight_color)
                break

        out_frame = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        out.write(out_frame)
        frame_idx += 1

    cap.release()
    out.release()


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("video_path")
    p.add_argument("start", type=float)
    p.add_argument("end", type=float)
    p.add_argument("words_json")
    p.add_argument("out_path")
    p.add_argument("--ffmpeg", default="ffmpeg")
    p.add_argument("--title", default=None)
    p.add_argument("--highlight-color", default=None, help="Hex color, e.g. #FFD60A")
    args = p.parse_args()

    highlight_color = parse_hex_color(args.highlight_color, (255, 214, 10))

    duration = args.end - args.start
    tmp_dir = tempfile.mkdtemp(prefix="bytecap_")
    cut_path = os.path.join(tmp_dir, "cut.mp4")
    noaudio_path = os.path.join(tmp_dir, "noaudio.mp4")

    ffmpeg_cut(args.ffmpeg, args.video_path, args.start, duration, cut_path)

    with open(args.words_json, "r", encoding="utf-8") as f:
        words = json.load(f)["words"]

    reframe_and_caption(cut_path, noaudio_path, words, args.start, args.end, args.title, highlight_color)

    run([
        args.ffmpeg, "-y", "-i", noaudio_path, "-i", cut_path,
        "-map", "0:v:0", "-map", "1:a:0?",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-c:a", "aac",
        "-shortest", args.out_path,
    ])

    for p_ in (cut_path, noaudio_path):
        try:
            os.remove(p_)
        except OSError:
            pass
    try:
        os.rmdir(tmp_dir)
    except OSError:
        pass

    print(json.dumps({"ok": True, "out": args.out_path}))


if __name__ == "__main__":
    main()
