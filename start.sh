#!/usr/bin/env bash
# One-command launcher for the Bytecap clone.
# Checks dependencies, installs what's missing, starts the app, opens it in the browser.
set -euo pipefail
cd "$(dirname "$0")"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✓${NC} $1"; }
warn() { echo -e "${YELLOW}!${NC} $1"; }
err()  { echo -e "${RED}✗${NC} $1"; }

echo "Bytecap clone — avvio"
echo "======================"

# 1. ffmpeg
if ! command -v ffmpeg >/dev/null 2>&1; then
  warn "ffmpeg non trovato."
  if command -v brew >/dev/null 2>&1; then
    echo "  Installo con Homebrew…"
    brew install ffmpeg
  else
    err "Installa ffmpeg manualmente (https://ffmpeg.org/download.html) e rilancia questo script."
    exit 1
  fi
else
  ok "ffmpeg trovato"
fi

# 2. Python 3
if ! command -v python3 >/dev/null 2>&1; then
  err "python3 non trovato. Installalo (es. da python.org) e rilancia questo script."
  exit 1
fi
ok "python3 trovato ($(python3 --version))"

# 3. Python deps for the clipping pipeline
echo "Controllo le dipendenze Python della pipeline…"
python3 -m pip install --quiet --user -r pipeline/requirements.txt
ok "Dipendenze Python pronte (yt-dlp, faster-whisper, opencv, pillow, numpy)"

# 4. Node deps
if [ ! -d node_modules ]; then
  warn "node_modules mancante, eseguo npm install…"
  npm install
else
  ok "Dipendenze Node già installate"
fi

# 5. Claude credentials
if [ -f .env.local ] && grep -q "^BYTECAP_API_KEY=" .env.local 2>/dev/null; then
  ok "API key Claude trovata in .env.local"
else
  warn "Nessuna API key in .env.local (BYTECAP_API_KEY)."
  echo "  Va bene se userai la modalità 'Il mio abbonamento Claude' in Impostazioni."
  echo "  Altrimenti aggiungi una riga: BYTECAP_API_KEY=sk-ant-... in .env.local"
fi

if ! command -v claude >/dev/null 2>&1; then
  warn "Comando 'claude' (Claude Code) non trovato nel PATH."
  echo "  Va bene se userai la modalità 'Anthropic API key' in Impostazioni."
fi

echo ""
echo "Avvio il server su http://localhost:3500 …"
echo "Premi Ctrl+C per fermarlo."
echo ""

PORT=3500
( sleep 2 && command -v open >/dev/null 2>&1 && open "http://localhost:${PORT}/workspace" ) &

npm run dev -- -p "$PORT"
