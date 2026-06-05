/**
 * Shared, client-safe types and option constants for the AnchorFlow script domain.
 */

export type Language = "English" | "Bahasa Indonesia";
export type Tone = "Casual" | "Business News" | "Formal News";
export type Duration = "30 seconds" | "1 minute" | "2 minutes" | "3 minutes";
export type OutputStyle = "Anchor Script" | "Short Brief" | "Opening Monologue";

export const LANGUAGE_OPTIONS: Language[] = ["English", "Bahasa Indonesia"];
export const TONE_OPTIONS: Tone[] = ["Casual", "Business News", "Formal News"];
export const DURATION_OPTIONS: Duration[] = [
  "30 seconds",
  "1 minute",
  "2 minutes",
  "3 minutes",
];
export const OUTPUT_STYLE_OPTIONS: OutputStyle[] = [
  "Anchor Script",
  "Short Brief",
  "Opening Monologue",
];

export interface ScriptSettings {
  language: string;
  tone: string;
  duration: string;
  output_style: string;
}

export interface ScriptRecord extends ScriptSettings {
  id: string;
  title: string;
  source_material: string;
  generated_summary: string;
  generated_script: string;
  estimated_reading_time: string;
  created_at?: string;
  updated_at?: string;
}

export interface GeneratedScript {
  title: string;
  summary: string;
  script: string;
  estimated_reading_time: string;
}
