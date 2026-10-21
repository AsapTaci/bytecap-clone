# Bytecap clone

A working clone of [bytecap.io](https://www.bytecap.io) — an AI tool that turns long videos into
short, vertical, captioned clips for TikTok/Reels/Shorts. This isn't just a UI mockup: it's a real
pipeline that downloads a video, transcribes it, has Claude pick the best moments, and renders
actual vertical clips with face-tracked reframing and burned-in animated captions.

## What it does

- **Paste a YouTube link or upload a video** from the homepage or the dashboard (`/workspace`).
- **Real AI pipeline**: yt-dlp downloads the video → faster-whisper transcribes it locally →
  Claude picks the best 15–75s moments and scores them (hook/payoff/curiosity/pacing/standalone) →
  each moment is cut, reframed to 9:16 with face/active-speaker tracking, and gets burned-in
  word-by-word animated captions.
- **A dashboard** (`/workspace`) listing all your generated projects, matching the real bytecap.io
  app you get after logging in.
- **Edit clips with Claude**: on the results page, describe a change in plain language ("shorten
  the start by 3 seconds", "change the title", "make the captions blue") and Claude re-renders the
  clip accordingly.
- **Choice of Claude auth** (`/workspace/settings`): use your existing Claude Code subscription
  (no extra cost) or a separate Anthropic API key.

## Requirements

- Node.js 20+ and npm
- Python 3.10+
- [ffmpeg](https://ffmpeg.org/) (`brew install ffmpeg` on macOS)
- Either Claude Code installed and logged in (`claude` on your PATH), **or** an
  [Anthropic API key](https://console.anthropic.com/)

## Quick start

```bash
./start.sh
```

This checks/installs everything (Python packages, Node packages, ffmpeg) and opens
`http://localhost:3500/workspace` in your browser.

### Manual setup

```bash
npm install
pip3 install -r pipeline/requirements.txt
npm run dev -- -p 3500
```

Then open `http://localhost:3500`.

### Claude credentials

Go to **Settings** in the sidebar and pick one:

- **My Claude subscription** — uses the `claude` CLI already on your machine (Claude Code),
  authenticated with your existing subscription. No separate billing.
- **Anthropic API key** — add a line to `.env.local`:
  ```
  BYTECAP_API_KEY=sk-ant-...
  ```

Either way, click "Verifica connessione" on the Settings page to confirm it works.

## Project structure

```
app/                    Next.js App Router pages & API routes
  page.tsx               marketing homepage (bytecap.io clone)
  workspace/              dashboard (projects list, settings, ...)
  studio/[id]/             clip results page ("Your Clips")
  api/jobs/                job creation/status/listing
  api/jobs/[id]/clips/[clipId]/edit/   AI-powered clip editing
  api/settings/            Claude auth mode (subscription vs API key)
components/sites/bytecap/  React components (homepage + dashboard UI)
lib/
  pipeline.ts              job orchestration (download → transcribe → analyze → render)
  claude.ts                moment-picking prompt
  claude-client.ts          unified Claude call (API key or `claude -p` subscription)
  settings.ts               persisted app settings
pipeline/                  Python scripts (the actual video processing)
  download.py               yt-dlp
  transcribe.py              faster-whisper
  render_clip.py              ffmpeg cut + face-tracked reframe + burned-in captions
public/sites/bytecap/      cloned marketing-site assets
.data/                     runtime state (jobs, uploads, settings) — not committed
public/generated/          rendered clips — not committed
```

## Notes

- This is a personal local tool, not a multi-tenant SaaS: `/workspace` has no login.
- A few dashboard sidebar sections (Automations, Calendar, Analytics, Thumbnails, Assets, Social
  accounts) are placeholder pages — only the core clipping flow and Settings are fully wired up.
- Publishing directly to social platforms isn't implemented (would need OAuth apps per platform).
- Not affiliated with or endorsed by Bytecap. Built for personal/educational use.
