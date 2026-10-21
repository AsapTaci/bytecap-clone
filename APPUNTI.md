# Bytecap clone — APPUNTI.md

## Cosa è stato fatto
- Clonata la homepage di **https://www.bytecap.io** (tool AI per tagliare video lunghi in clip virali).
- Progetto Next.js 16 (App Router, Turbopack, TypeScript, Tailwind v4) creato da zero in questa cartella con `create-next-app`.
- Scaricati tutti gli asset reali dal sito sorgente in `public/sites/bytecap/` (logo, screenshot editor, immagini hero per ogni tab, loghi "trusted by", slider video verticali, icone social) — vedi lista completa nei nomi file.
- Ricostruite tutte le sezioni della home in componenti separati in `components/sites/bytecap/`:
  - `Header.tsx` — nav fissa con mega-menu "Use Cases" (14 voci) e "Features" (14 voci), menu mobile a pannello con back-navigation, toggle hamburger.
  - `Hero.tsx` — titolo, input URL con badge piattaforme (YouTube/Facebook/TikTok/Instagram/X), bottone "Get clips", pannello demo con tab switcher (AI Clipping / AI Captions / Auto B-Roll / Faceless Videos / Publishing) e frecce prev/next, tutto interattivo.
  - `TrustedBy.tsx`, `FindMoments.tsx`, `SpeakersInFrame.tsx` (Auto Reframe), `WorksOnFootage.tsx`, `PromptClipping.tsx` (prompt custom + chip suggerimenti), `MomentIntelligence.tsx` (card punteggio virale S/85/100 con barre), `HowItWorks.tsx` (3 step), `OneEditEverywhere.tsx` (marquee infinito di clip verticali), `VideoEditor.tsx` (screenshot editor reale + 3 smart edit card + griglia 12 funzioni), `Testimonials.tsx` (9 recensioni vere, layout a masonry), `FAQ.tsx` (9 domande/risposte reali, accordion funzionante), `Footer.tsx` (5 colonne di link + riga finale).
- Testo, copy e dati (punteggi, nomi testimonial, risposte FAQ, voci dei menu) presi 1:1 dal sito reale via DOM/JS, non inventati.
- Font: Inter + Architects Daughter (next/font/google), tema dark forzato (`bg-[#050505]`), icone via `lucide-react`.
- Verificato in anteprima su desktop e mobile (375px): hero, mega-menu, menu mobile, marquee animato, FAQ accordion, tutte le sezioni fino al footer — tutto corrisponde da vicino al sito originale.
- `npm run build` completato senza errori (build di produzione pulita).
- Dev server configurato in `~/Desktop/.claude/launch.json` come `bytecap-clone`, porta 3500.

## Backend reale (aggiunto il 2026-10-20): genera clip vere

Pietro ha chiesto che "Get clips" funzioni davvero, non solo l'interfaccia. Ora il bottone Hero (link YouTube o upload file) avvia una pipeline reale e porta a `/studio/[id]` con avanzamento live:

1. **Download** — `pipeline/download.py` (yt-dlp) scarica il video da link YouTube, oppure il file caricato viene copiato direttamente.
2. **Trascrizione** — `pipeline/transcribe.py` (faster-whisper, modello `small`, locale, gratis) produce timestamp parola-per-parola.
3. **Scelta dei momenti migliori** — `lib/claude.ts` manda la trascrizione a **Claude Sonnet 5** (serve `ANTHROPIC_API_KEY` in `.env.local`, già configurata) che restituisce fino a 4 clip candidate con titolo e punteggio (hook/payoff/curiosity/pacing/standalone, come la card "Moment Intelligence" del sito originale). Costo reale: pochi centesimi a video.
4. **Montaggio** — `pipeline/render_clip.py` per ogni clip: taglia con ffmpeg, **reframe automatico a 9:16 con face-tracking** (OpenCV `FaceDetectorYN`/YuNet, modello in `pipeline/models/`), e **sottotitoli animati bruciati nel video** (parola-per-parola, parola attiva evidenziata in giallo, disegnati con Pillow frame-per-frame — niente libass/ffmpeg-full, scelta presa dopo che una build di ffmpeg-full con tutte le dipendenze stava richiedendo troppo tempo/risorse).
5. Risultato: card con video player, titolo, grado (S/A/B/C/D), barre punteggio, bottone download — in `components/sites/bytecap/StudioClient.tsx`.

Orchestrazione in `lib/pipeline.ts` (stato job in `.data/jobs/<id>/status.json`, polling ogni 2s dal frontend), API in `app/api/jobs/`, `app/api/jobs/[id]/`, `app/api/upload/`.

**Testato end-to-end e funzionante**, sia da link YouTube che da upload file, sia via API diretta che dal vero form Hero nel browser. Pietro stesso l'ha già provato con un suo video vero (l'intervista con Erri De Luca, lo stesso progetto che aveva nel suo account bytecap reale) e i risultati sono buoni: 3 clip su 4 con grado A, analisi sensate.

### Reframe migliorato (2026-10-20, seconda parte): riconosce lo speaker, non inquadra il vuoto

Pietro ha notato che il reframe automatico inquadrava anche spazio vuoto/sfondo invece di stare stretto sulla persona. `pipeline/render_clip.py` ora:
- **Campiona 8 volte al secondo** invece di 2, per un tracking molto più reattivo ai movimenti.
- **Riconosce chi sta parlando** quando ci sono più volti in scena: misura il movimento pixel-per-pixel nella zona della bocca di ciascun volto (usando i landmark che YuNet già restituisce) e sceglie il volto con più movimento recente, non più semplicemente "il volto più grande".
- **Zoom adattivo**: non mostra più sempre l'altezza intera del video sorgente. Calcola un riquadro di ritaglio che tiene il volto a circa il 40% dell'altezza inquadrata (zoom fino a 1.6x), così il soggetto riempie il frame invece di lasciare sfondo/spazio morto sopra e sotto.
- Centra anche verticalmente sul volto (prima centrava solo in orizzontale, altezza sempre fissa a tutto il frame sorgente).
- Interpolazione lineare tra i campioni + media mobile (~0.5s) per movimento fluido senza scatti.
- Verificato visivamente estraendo fotogrammi dal video renderizzato: il soggetto ora riempie bene l'inquadratura verticale, segue i suoi movimenti, e quando si gira di profilo (il rilevatore perde il volto) tiene l'ultima posizione buona invece di saltare a vuoto.

### Setup necessario su una macchina nuova
- `pip3 install -r pipeline/requirements.txt` (yt-dlp, faster-whisper, opencv-python-headless, numpy, pillow)
- `ANTHROPIC_API_KEY` in `.env.local` (già presente su questo Mac, mai committata — è in `.gitignore`)
- ffmpeg già installato via brew (quello normale, non serve `ffmpeg-full`)

## Dashboard autenticata (aggiunto il 2026-10-20): "dove si trovano tutte le clip fatte"

Pietro ha fatto login sul vero bytecap.io (`/workspace`) e mi ha fatto vedere la parte dietro l'accesso, che mancava. L'ho clonata osservando dal vivo il suo account reale (1 progetto esistente, "La mano dà ritmo ai pensieri", 14 clip) tramite il browser:

- **`components/sites/bytecap/DashboardChrome.tsx`** — guscio condiviso: banner piano Free in alto, topbar (hamburger o freccia indietro, breadcrumb, campanella notifiche, contatore crediti "⚡32", avatar), sidebar a drawer con NAVIGATION (Home, Automations "NEW", Calendar, Analytics, Thumbnails, Assets, Social accounts) + card "Upgrade Plan" in basso — tutto preso 1:1 dal vero menu laterale.
- **`/workspace`** (`WorkspaceHome.tsx`) — home della dashboard reale: filtri Type/Sort/cerca, lo stesso input "Paste a link" + Upload/Google Drive/Dropbox della Hero (funzionante, stessa pipeline), griglia di 6 scorciatoie (AI Video Clipper/Captions/Reframe/B-Roll/Audio Clipper/Story), sezione **Projects con i progetti REALI** (letti da `.data/jobs/` via nuova `listJobs()` in `lib/pipeline.ts` + `GET /api/jobs`), grafico "Views over time" e sezione calendario "Connect once. Publish everywhere." (entrambi cosmetici, come nell'originale per chi non ha ancora collegato i social).
- **`/studio/[id]`** (`StudioClient.tsx`, riscritta) — ora rispecchia da vicino la vera pagina "Your Clips" vista nell'account di Pietro: card sorgente con titolo+durata, intestazione "Ready to Edit" con "Sort by: Score" e conteggio clip, e per ogni clip: fascia oraria (`mm:ss - mm:ss`), Viral Score + Grade, barre punteggio, **tab Analysis/Transcript funzionanti con dati reali** (il campo `analysis` ora richiesto a Claude in `lib/claude.ts`, il `transcript` tagliato dalle parole Whisper nell'intervallo della clip), bottoni Edit clip/Publish (disattivati con lucchetto, onesto sul fatto che non c'è editor/publishing reale) e Save (download vero, funzionante).
- I link "Log in" e "Get started free" del sito marketing ora portano a `/workspace` invece che a route inesistenti `/login`/`/signup`.
- Sei pagine placeholder create per le altre voci della sidebar (`/workspace/{automations,calendar,analytics,thumbnails,assets,social-accounts}`), ognuna con lo stesso guscio e un messaggio "In arrivo" — navigabili ma non funzionanti, scelta deliberata per tenere lo scope ragionevole (vedi sotto).

**Testato end-to-end**: build di produzione pulita, navigazione sidebar, generazione di un job nuovo con verifica che Analysis/Transcript si popolino con dati reali.

## Modifica clip con Claude + scelta dell'auth (2026-10-21)

Pietro voleva poter modificare davvero le clip parlando con Claude ("titolo", "taglio", "sottotitoli"), scegliendo se consumare il suo abbonamento Claude Code o una API key separata.

- **`/workspace/settings`** (nuova voce in sidebar) — due modalità selezionabili, con bottone "Verifica connessione" per ciascuna:
  - **Il mio abbonamento Claude**: lancia `claude -p "<messaggio>" --system-prompt "..." --tools "" --model sonnet` (Claude Code già installato e loggato su questo Mac) in `lib/claude-client.ts`. Nessun costo a parte, usa il piano Claude Code di Pietro. **Modalità predefinita selezionata ora, dopo test riuscito.**
  - **Anthropic API key**: usa `BYTECAP_API_KEY` da `.env.local` (rinominata da `ANTHROPIC_API_KEY` apposta, per evitare che interferisca con la risoluzione OAuth della modalità abbonamento).
  - Scelta salvata in `.data/settings.json`, letta da `lib/claude-client.ts::completeWithClaude()` sia per la scelta dei momenti migliori (`lib/claude.ts`) sia per la modifica clip.
- **Bottone "Edit clip with Claude"** in `/studio/[id]` ora funziona davvero: apre un campo di testo, l'istruzione in linguaggio naturale (es. "accorcia l'inizio di 3 secondi", "cambia il titolo", "sottotitoli in azzurro") viene mandata a Claude insieme a titolo/taglio/colore correnti e alla trascrizione nelle vicinanze (±20s) della clip. Claude risponde con un JSON strutturato (nuovo titolo/inizio/fine/colore + una frase di spiegazione), `lib/pipeline.ts::editClip()` ri-renderizza la clip con `pipeline/render_clip.py` (ora accetta anche `--highlight-color`) e aggiorna la card senza ricaricare la pagina.
- **Testato end-to-end** in modalità abbonamento: chiesto di cambiare il titolo di una clip, Claude ha risposto con un titolo nuovo coerente ("Proboscide XXL: Il Club delle Trombe Lunghissime"), la clip si è ri-renderizzata e la UI si è aggiornata da sola.
- "Publish" resta disattivato (nessuna integrazione social reale, fuori scope). "Save" scarica davvero il file.

## Cosa resta da fare (eventuale, su richiesta)
- Pagine secondarie marketing non clonate: `/pricing`, `/blog`, `/affiliates` restano link placeholder.
- Le sei pagine sidebar rimaste (Automations, Calendar, Analytics, Thumbnails, Assets, Social accounts) sono solo "In arrivo" — nessuna di queste è stata osservata a fondo né implementata per davvero; se servono, vanno esplorate nel vero account e costruite una per una.
- Warning minori non bloccanti in console dev: alcune `<Image fill>` senza prop `sizes` (solo perf, non visivi).
- Light mode / toggle chiaro-scuro presente nel menu mobile del sito originale ("Appearance") non implementato (qui il clone è solo dark, come default del sito).
- **Pubblicazione diretta sui social** (TikTok/YouTube/Instagram) non implementata: richiederebbe creare app/developer account su ogni piattaforma e gestire OAuth — esplicitamente lasciata fuori scope in questa fase (vedi scelta fatta con Pietro).
- **Nessuna autenticazione reale**: `/workspace` è raggiungibile direttamente, senza login — l'app è pensata come strumento personale locale per Pietro, non multi-utente. Se serve un login vero andrebbe aggiunto.
- La modifica clip con Claude capisce titolo/taglio/colore sottotitoli; non sa (ancora) fare cose come "aggiungi musica" o "cambia il font" — andrebbe esteso caso per caso.
- Il bottone "Get Clips" dentro la sezione demo "Or just tell it what to find" (prompt custom) sulla homepage marketing resta solo cosmetico — gli ingressi funzionanti reali sono l'input URL/upload in Hero e in `/workspace`.
- La pipeline gira in locale sul Mac di Pietro (no deploy cloud): video lunghi richiedono più tempo per la trascrizione (CPU, faster-whisper "small").

## Sito di riferimento
- Sorgente clonata: https://www.bytecap.io (homepage pubblica + `/workspace` e `/create/...` dietro login, osservate dall'account reale di Pietro)
- Anteprima locale: http://localhost:3500 (avviare con il task "bytecap-clone" / `npm run dev` in questa cartella, porta 3500)
- Dashboard: http://localhost:3500/workspace
