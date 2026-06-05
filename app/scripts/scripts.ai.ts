/**
 * AnchorFlow AI generation — wraps the agentic scaffold's `invokeLLM` to turn
 * source material (pasted text and/or an uploaded file) into a structured
 * anchor script (Title / Summary / Script / Estimated Reading Time).
 *
 * Client-safe: invokeLLM posts to the scaffold route /api/agents/llm.
 */

import { invokeLLM } from "@qb/agentic";
import type { GeneratedScript, ScriptSettings } from "./scripts.types";

const SCRIPT_SCHEMA = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "A short, suggested on-screen title for the segment.",
    },
    summary: {
      type: "string",
      description: "One short paragraph summarizing the story.",
    },
    script: {
      type: "string",
      description:
        "The teleprompter-ready anchor script. Natural spoken style, short sentences. Use blank lines between paragraphs.",
    },
    estimated_reading_time: {
      type: "string",
      description:
        "Estimated spoken reading time, e.g. '45 seconds' or '1 min 20 sec'.",
    },
  },
  required: ["title", "summary", "script", "estimated_reading_time"],
  additionalProperties: false,
} as const;

const STYLE_GUIDANCE: Record<string, string> = {
  "Anchor Script":
    "Write a full news-anchor script meant to be read aloud on camera.",
  "Short Brief":
    "Write a tight, concise brief — only the essential facts, read quickly on air.",
  "Opening Monologue":
    "Write a warm, engaging opening monologue that hooks the viewer and sets up the story.",
};

interface BuildOptions extends ScriptSettings {
  sourceMaterial: string;
  /** Optional refine instruction layered on top of an existing script. */
  refineInstruction?: string;
  /** Existing script to refine, when refineInstruction is present. */
  currentScript?: string;
  hasFile?: boolean;
}

function buildMessage(opts: BuildOptions): string {
  const lines: string[] = [];

  lines.push("Produce an anchor script with these settings:");
  lines.push(`- Language: ${opts.language} (write the script in this language)`);
  lines.push(`- Tone: ${opts.tone}`);
  lines.push(`- Target duration: ${opts.duration}`);
  lines.push(`- Output style: ${opts.output_style}`);
  const styleNote = STYLE_GUIDANCE[opts.output_style];
  if (styleNote) lines.push(`- Style guidance: ${styleNote}`);
  lines.push(
    `- Match the script length to the target duration (${opts.duration}).`,
  );

  if (opts.refineInstruction && opts.currentScript) {
    lines.push("");
    lines.push(`Refinement instruction: ${opts.refineInstruction}`);
    lines.push("");
    lines.push("Here is the current script to revise:");
    lines.push('"""');
    lines.push(opts.currentScript);
    lines.push('"""');
    if (opts.sourceMaterial.trim()) {
      lines.push("");
      lines.push("Original source material for reference:");
      lines.push('"""');
      lines.push(opts.sourceMaterial.trim());
      lines.push('"""');
    }
  } else {
    lines.push("");
    if (opts.hasFile) {
      lines.push(
        "Use the attached file as the primary source material. Read it fully.",
      );
    }
    if (opts.sourceMaterial.trim()) {
      lines.push("Source material:");
      lines.push('"""');
      lines.push(opts.sourceMaterial.trim());
      lines.push('"""');
    } else if (!opts.hasFile) {
      lines.push("No source material was provided.");
    }
  }

  lines.push("");
  lines.push(
    "Return the title, a one-paragraph summary, the teleprompter-ready script, and an estimated reading time.",
  );

  return lines.join("\n");
}

export interface GenerateArgs extends ScriptSettings {
  sourceMaterial: string;
  systemPrompt: string;
  file?: File | null;
  refineInstruction?: string;
  currentScript?: string;
}

export async function generateScript(
  args: GenerateArgs,
): Promise<GeneratedScript> {
  const message = buildMessage({
    language: args.language,
    tone: args.tone,
    duration: args.duration,
    output_style: args.output_style,
    sourceMaterial: args.sourceMaterial,
    refineInstruction: args.refineInstruction,
    currentScript: args.currentScript,
    hasFile: Boolean(args.file),
  });

  const result = await invokeLLM({
    message,
    schema: SCRIPT_SCHEMA as unknown as Record<string, unknown>,
    systemPrompt: args.systemPrompt,
    files: args.file ? [args.file] : undefined,
  });

  if (result.status === "ERROR" || !result.response) {
    throw new Error(result.error ?? "The AI could not generate a script.");
  }

  const r = result.response as Record<string, unknown>;
  return {
    title: String(r.title ?? "Untitled Script"),
    summary: String(r.summary ?? ""),
    script: String(r.script ?? ""),
    estimated_reading_time: String(r.estimated_reading_time ?? ""),
  };
}
