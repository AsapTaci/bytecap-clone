import { spawn } from "node:child_process";
import Anthropic from "@anthropic-ai/sdk";
import { getSettings } from "./settings";

export interface CompletionRequest {
  system: string;
  userMessage: string;
  maxTokens?: number;
}

const CLAUDE_CLI_CANDIDATES = [
  "claude",
  `${process.env.HOME}/.local/bin/claude`,
  "/opt/homebrew/bin/claude",
  "/usr/local/bin/claude",
];

export async function completeWithClaude(req: CompletionRequest): Promise<string> {
  const settings = await getSettings();
  if (settings.claudeAuthMode === "subscription") {
    return completeViaClaudeCode(req);
  }
  return completeViaApiKey(req);
}

export async function completeViaApiKey({
  system,
  userMessage,
  maxTokens = 4000,
}: CompletionRequest): Promise<string> {
  if (!process.env.BYTECAP_API_KEY) {
    throw new Error(
      "Nessuna API key configurata. Vai in Impostazioni e aggiungi una Anthropic API key, oppure passa alla modalità abbonamento."
    );
  }
  const client = new Anthropic({ apiKey: process.env.BYTECAP_API_KEY });
  const response = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: userMessage }],
  });
  const textBlock = response.content.find(
    (b): b is Anthropic.TextBlock => b.type === "text"
  );
  if (!textBlock) {
    throw new Error("Claude non ha restituito testo utilizzabile (API key)");
  }
  return textBlock.text;
}

export function completeViaClaudeCode({
  system,
  userMessage,
}: CompletionRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    const args = [
      "-p",
      userMessage,
      "--system-prompt",
      system,
      "--tools",
      "",
      "--output-format",
      "text",
      "--model",
      "sonnet",
    ];

    const tryBinary = (index: number) => {
      if (index >= CLAUDE_CLI_CANDIDATES.length) {
        reject(
          new Error(
            "Impossibile trovare il comando 'claude' (Claude Code) sul sistema. Installalo o passa alla modalità API key."
          )
        );
        return;
      }
      const bin = CLAUDE_CLI_CANDIDATES[index];
      const child = spawn(/*turbopackIgnore: true*/ bin, args);
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (d) => (stdout += d.toString()));
      child.stderr.on("data", (d) => (stderr += d.toString()));
      child.on("error", (err) => {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") {
          tryBinary(index + 1);
        } else {
          reject(err);
        }
      });
      child.on("close", (code) => {
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          reject(
            new Error(
              `Claude Code (claude -p) ha fallito (codice ${code}): ${stderr.slice(-1000) || stdout.slice(-1000)}`
            )
          );
        }
      });
    };

    tryBinary(0);
  });
}
