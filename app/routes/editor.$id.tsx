import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Check,
  Copy,
  Loader2,
  Maximize2,
  Minus,
  Plus,
  RefreshCw,
  Smile,
  Briefcase,
  Clock,
} from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { BrandMark } from "~/scripts/components/brand-mark";
import { generateScript } from "~/scripts/scripts.ai";
import { getScript, updateScript } from "~/scripts/scripts.client";
import type { ScriptRecord } from "~/scripts/scripts.types";

type RefineKey =
  | "regenerate"
  | "shorter"
  | "longer"
  | "casual"
  | "professional";

const REFINEMENTS: {
  key: RefineKey;
  label: string;
  icon: typeof RefreshCw;
  instruction: string;
}[] = [
  { key: "regenerate", label: "Regenerate", icon: RefreshCw, instruction: "Rewrite the script fresh from the source material, keeping the same settings." },
  { key: "shorter", label: "Make shorter", icon: Minus, instruction: "Make the script noticeably shorter and tighter while keeping the key facts." },
  { key: "longer", label: "Make longer", icon: Plus, instruction: "Expand the script with a bit more detail and context, staying natural." },
  { key: "casual", label: "More casual", icon: Smile, instruction: "Make the tone warmer and more casual, like a friendly anchor talking to viewers." },
  { key: "professional", label: "More professional", icon: Briefcase, instruction: "Make the tone more polished and professional, broadcast-grade." },
];

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { config } = useConfigurables();

  const [record, setRecord] = useState<ScriptRecord | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState<RefineKey | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;
    if (!id) return;
    getScript(id)
      .then((r) => {
        if (!active) return;
        if (!r) setLoadError("This script could not be found.");
        else setRecord(r);
      })
      .catch(() => active && setLoadError("Failed to load this script."));
    return () => {
      active = false;
    };
  }, [id]);

  // Debounced autosave on edits.
  const scheduleSave = useCallback(
    (next: ScriptRecord) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        try {
          await updateScript(next.id, {
            title: next.title,
            generated_summary: next.generated_summary,
            generated_script: next.generated_script,
            estimated_reading_time: next.estimated_reading_time,
          });
          setSavedFlash(true);
          setTimeout(() => setSavedFlash(false), 1400);
        } catch {
          /* keep editing; autosave will retry on next change */
        }
      }, 800);
    },
    [],
  );

  function patch(partial: Partial<ScriptRecord>) {
    setRecord((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      scheduleSave(next);
      return next;
    });
  }

  async function runRefine(key: RefineKey) {
    if (!record || busy) return;
    const ref = REFINEMENTS.find((r) => r.key === key);
    if (!ref) return;
    setBusy(key);
    try {
      const systemPrompt =
        config?.aiSystemPrompt ||
        "You are a friendly news producer and anchor scriptwriter. Turn the user's material into a clean, casual, easy-to-read anchor script. Write like a real person speaking on camera. Keep sentences short. Make the story clear. Do not invent facts. If a fact is unclear, mark it as 'Needs confirmation'. Avoid hype. Make the script sound natural, smooth, and confident.";

      const generated = await generateScript({
        sourceMaterial: record.source_material,
        systemPrompt,
        language: record.language,
        tone: record.tone,
        duration: record.duration,
        output_style: record.output_style,
        refineInstruction: key === "regenerate" ? undefined : ref.instruction,
        currentScript: key === "regenerate" ? undefined : record.generated_script,
      });

      const next: ScriptRecord = {
        ...record,
        title: generated.title || record.title,
        generated_summary: generated.summary,
        generated_script: generated.script,
        estimated_reading_time: generated.estimated_reading_time,
      };
      setRecord(next);
      await updateScript(next.id, {
        title: next.title,
        generated_summary: next.generated_summary,
        generated_script: next.generated_script,
        estimated_reading_time: next.estimated_reading_time,
      });
    } catch {
      /* surfaced softly; user can retry */
    } finally {
      setBusy(null);
    }
  }

  async function copyScript() {
    if (!record) return;
    try {
      await navigator.clipboard.writeText(record.generated_script);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FAFAFA] px-6 text-center">
        <p className="text-[15px] text-[#6B7280]">{loadError}</p>
        <button
          onClick={() => navigate("/")}
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-white"
          style={{ background: "var(--primary)" }}
        >
          Back to studio
        </button>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="h-6 w-6 animate-spin text-[#9CA3AF]" />
      </div>
    );
  }

  const refining = busy !== null;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="sticky top-0 z-10 border-b border-[#ECECEC] bg-[#FAFAFA]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 py-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-[#6B7280] transition-colors hover:bg-white hover:text-[#111111]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">New script</span>
          </button>
          <BrandMark compact />
          <div className="flex items-center gap-2">
            {savedFlash && (
              <span className="hidden items-center gap-1 text-xs text-[#10B981] sm:flex">
                <Check className="h-3.5 w-3.5" /> Saved
              </span>
            )}
            <button
              type="button"
              onClick={() => navigate(`/teleprompter/${record.id}`)}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_18px_-6px_rgba(79,70,229,0.6)] transition-all hover:translate-y-[-1px]"
              style={{ background: "var(--primary)" }}
            >
              <Maximize2 className="h-4 w-4" />
              <span>Open Teleprompter</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-28 pt-8">
        {/* Meta row */}
        <div className="af-fade-up mb-6 flex flex-wrap items-center gap-2 text-xs">
          {[record.language, record.tone, record.duration, record.output_style].map(
            (chip) => (
              <span
                key={chip}
                className="rounded-full bg-white px-2.5 py-1 font-medium text-[#6B7280] ring-1 ring-[#ECECEC]"
              >
                {chip}
              </span>
            ),
          )}
          {record.estimated_reading_time && (
            <span
              className="ml-auto flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium"
              style={{ color: "var(--primary)", background: "rgba(79,70,229,0.08)" }}
            >
              <Clock className="h-3.5 w-3.5" />
              {record.estimated_reading_time}
            </span>
          )}
        </div>

        {/* Title */}
        <input
          value={record.title}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder="Untitled script"
          className="af-fade-up w-full bg-transparent text-3xl font-semibold tracking-tight text-[#111111] placeholder:text-[#D1D5DB] focus:outline-none"
        />

        {/* Summary */}
        <div className="af-fade-up mt-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">
            Summary
          </p>
          <textarea
            value={record.generated_summary}
            onChange={(e) => patch({ generated_summary: e.target.value })}
            rows={3}
            placeholder="A short summary of the story…"
            className="w-full resize-none rounded-xl border border-[#ECECEC] bg-white px-4 py-3 text-[15px] leading-relaxed text-[#374151] shadow-sm placeholder:text-[#9CA3AF] focus:border-[#C7C9F5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15"
          />
        </div>

        {/* Refinement toolbar */}
        <div className="af-fade-up mt-7 flex flex-wrap items-center gap-2">
          {REFINEMENTS.map((r) => {
            const Icon = r.icon;
            const isBusy = busy === r.key;
            return (
              <button
                key={r.key}
                type="button"
                disabled={refining}
                onClick={() => runRefine(r.key)}
                className="flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-sm font-medium text-[#374151] shadow-sm transition-all hover:border-[#D1D5DB] hover:bg-[#FAFAFA] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isBusy ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Icon className="h-3.5 w-3.5" />
                )}
                {r.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={copyScript}
            className="ml-auto flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-sm font-medium text-[#374151] shadow-sm transition-all hover:border-[#D1D5DB] hover:bg-[#FAFAFA]"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#10B981]" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy
              </>
            )}
          </button>
        </div>

        {/* Script editor */}
        <div className="af-fade-up relative mt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">
            Anchor script
          </p>
          <textarea
            value={record.generated_script}
            onChange={(e) => patch({ generated_script: e.target.value })}
            rows={18}
            spellCheck
            placeholder="Your anchor script will appear here…"
            className="w-full resize-y rounded-2xl border border-[#ECECEC] bg-white px-5 py-5 text-[17px] leading-[1.8] text-[#1F2937] shadow-sm placeholder:text-[#9CA3AF] focus:border-[#C7C9F5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/15"
          />
          {refining && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-white/55 backdrop-blur-[1px]">
              <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#374151] shadow-md">
                <Loader2 className="h-4 w-4 animate-spin" /> Reworking the script…
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
