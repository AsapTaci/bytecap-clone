import fs from "node:fs/promises";
import path from "node:path";

const SETTINGS_PATH = path.join(process.cwd(), ".data", "settings.json");

export type ClaudeAuthMode = "subscription" | "apikey";

export interface AppSettings {
  claudeAuthMode: ClaudeAuthMode;
}

const DEFAULT_SETTINGS: AppSettings = {
  claudeAuthMode: "apikey",
};

export async function getSettings(): Promise<AppSettings> {
  try {
    const raw = await fs.readFile(SETTINGS_PATH, "utf-8");
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(
  patch: Partial<AppSettings>
): Promise<AppSettings> {
  const current = await getSettings();
  const next = { ...current, ...patch };
  await fs.mkdir(path.dirname(SETTINGS_PATH), { recursive: true });
  await fs.writeFile(SETTINGS_PATH, JSON.stringify(next, null, 2));
  return next;
}
