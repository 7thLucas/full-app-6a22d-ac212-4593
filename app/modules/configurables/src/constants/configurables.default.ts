/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  primary: string;
  secondary: string;
  accent: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  tagline: string;
  logoUrl: string;
  brandColor: TBrandColor;
  generatorHeading: string;
  generatorSubheading: string;
  inputPlaceholder: string;
  generateButtonLabel: string;
  footerText: string;
  defaultLanguage: string;
  defaultTone: string;
  defaultDuration: string;
  defaultOutputStyle: string;
  aiSystemPrompt: string;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "AnchorFlow",
  tagline: "Turn any material into a clean anchor script.",
  logoUrl: "FILL_LOGO_URL_HERE",
  brandColor: {
    primary: "#4F46E5",
    secondary: "#111111",
    accent: "#6366F1",
  },
  generatorHeading: "Turn any material into a clean anchor script.",
  generatorSubheading:
    "Paste or upload your material, choose your settings, and let AnchorFlow write a smooth, camera-ready anchor script.",
  inputPlaceholder:
    "Paste your article, transcript, notes, or any source material here…",
  generateButtonLabel: "Generate Script",
  footerText: "AnchorFlow — AI scriptwriting and teleprompter studio.",
  defaultLanguage: "English",
  defaultTone: "Casual",
  defaultDuration: "1 minute",
  defaultOutputStyle: "Anchor Script",
  aiSystemPrompt:
    "You are a friendly news producer and anchor scriptwriter. Turn the user's material into a clean, casual, easy-to-read anchor script. Write like a real person speaking on camera. Keep sentences short. Make the story clear. Do not invent facts. If a fact is unclear, mark it as 'Needs confirmation'. Avoid hype. Make the script sound natural, smooth, and confident.",
};
