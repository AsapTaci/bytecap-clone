"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle, Sparkles, KeyRound } from "lucide-react";

type AuthMode = "subscription" | "apikey";

const OPTIONS: { mode: AuthMode; title: string; description: string; icon: typeof Sparkles }[] = [
  {
    mode: "subscription",
    title: "Il mio abbonamento Claude",
    description:
      "Usa Claude Code già installato e autenticato su questo Mac (claude -p). Nessun costo extra, nessuna chiave da gestire: consuma il tuo piano Claude Code.",
    icon: Sparkles,
  },
  {
    mode: "apikey",
    title: "Anthropic API key",
    description:
      "Usa la chiave configurata in .env.local (BYTECAP_API_KEY). Costo a consumo, separato dal tuo abbonamento Claude.",
    icon: KeyRound,
  },
];

export default function SettingsPanel() {
  const [mode, setMode] = useState<AuthMode | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<AuthMode | null>(null);
  const [testResult, setTestResult] = useState<
    Record<string, { ok: boolean; message: string }>
  >({});

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d: { claudeAuthMode: AuthMode }) => setMode(d.claudeAuthMode));
  }, []);

  async function selectMode(next: AuthMode) {
    setSaving(true);
    setMode(next);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claudeAuthMode: next }),
    });
    setSaving(false);
  }

  async function testMode(testMode: AuthMode) {
    setTesting(testMode);
    try {
      const res = await fetch("/api/settings/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: testMode }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      setTestResult((prev) => ({
        ...prev,
        [testMode]: {
          ok: data.ok,
          message: data.ok ? "Connessione riuscita." : data.error || "Errore sconosciuto",
        },
      }));
    } catch (err) {
      setTestResult((prev) => ({
        ...prev,
        [testMode]: {
          ok: false,
          message: err instanceof Error ? err.message : "Errore di rete",
        },
      }));
    } finally {
      setTesting(null);
    }
  }

  return (
    <div>
      <h2 className="text-[17px] font-semibold text-white">
        Come modificare le clip con l&apos;AI
      </h2>
      <p className="mt-2 max-w-xl text-[13.5px] leading-6 text-white/45">
        Quando chiedi a Claude di modificare una clip (titolo, taglio,
        colore dei sottotitoli…) nella pagina &quot;Your Clips&quot;, questa
        app deve chiamare Claude. Scegli come:
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {OPTIONS.map((opt) => {
          const selected = mode === opt.mode;
          const result = testResult[opt.mode];
          return (
            <div
              key={opt.mode}
              className={`rounded-2xl border p-5 transition-colors ${
                selected
                  ? "border-violet-400/50 bg-violet-500/[0.06]"
                  : "border-white/[0.08] bg-white/[0.02]"
              }`}
            >
              <button
                onClick={() => selectMode(opt.mode)}
                disabled={saving}
                className="flex w-full items-start gap-3 text-left"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    selected
                      ? "bg-violet-500/20 text-violet-300"
                      : "bg-white/[0.05] text-white/50"
                  }`}
                >
                  <opt.icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-white">
                      {opt.title}
                    </span>
                    {selected && (
                      <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-300">
                        ATTIVA
                      </span>
                    )}
                  </span>
                  <span className="mt-1.5 block text-[12.5px] leading-5 text-white/45">
                    {opt.description}
                  </span>
                </span>
              </button>

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => testMode(opt.mode)}
                  disabled={testing === opt.mode}
                  className="flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-3 py-1.5 text-[12px] font-medium text-white/70 transition-colors hover:text-white disabled:opacity-50"
                >
                  {testing === opt.mode && (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  )}
                  Verifica connessione
                </button>
                {result && (
                  <span
                    className={`flex items-center gap-1.5 text-[12px] ${
                      result.ok ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {result.ok ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5" />
                    )}
                    {result.message}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-[12.5px] leading-6 text-white/45">
        <p className="font-medium text-white/70">
          Nota su &quot;Il mio abbonamento Claude&quot;
        </p>
        <p className="mt-1">
          Richiede Claude Code installato e autenticato su questo Mac. Se
          &quot;Verifica connessione&quot; fallisce, apri un terminale e
          lancia <code className="rounded bg-white/[0.08] px-1 py-0.5">claude</code>{" "}
          una volta per accertarti di essere loggato con il tuo account.
        </p>
      </div>
    </div>
  );
}
