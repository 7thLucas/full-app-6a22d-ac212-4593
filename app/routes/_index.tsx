import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { FileText, Upload, X, Loader2, Sparkles, History } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { BrandMark } from "~/scripts/components/brand-mark";
import { SettingGroup } from "~/scripts/components/setting-group";
import {
  LANGUAGE_OPTIONS,
  TONE_OPTIONS,
  DURATION_OPTIONS,
  OUTPUT_STYLE_OPTIONS,
} from "~/scripts/scripts.types";
import { generateScript } from "~/scripts/scripts.ai";
import { createScript, uploadSourceDocument } from "~/scripts/scripts.client";

const ACCEPTED =
  ".pdf,.doc,.docx,.txt,.rtf,.md,.vtt,.srt,application/pdf,text/plain";

export function meta() {
  return [{ title: "AnchorFlow — AI Anchor Scripts & Teleprompter" }];
}

export default function GeneratorPage() {
  const navigate = useNavigate();
  const { config } = useConfigurables();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [material, setMaterial] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState(config?.defaultLanguage || "English");
  const [tone, setTone] = useState(config?.defaultTone || "Casual");
  const [duration, setDuration] = useState(config?.defaultDuration || "1 minute");
  const [outputStyle, setOutputStyle] = useState(
    config?.defaultOutputStyle || "Anchor Script",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const heading = config?.generatorHeading || config?.tagline || "Turn any material into a clean anchor script.";
  const subheading =
    config?.generatorSubheading ||
    "Paste or upload your material, choose your settings, and let the studio write a smooth, camera-ready script.";
  const placeholder =
    config?.inputPlaceholder ||
    "Paste your article, transcript, notes, or any source material here…";
  const buttonLabel = config?.generateButtonLabel || "Generate Script";
  const footerText = config?.footerText || "";

  const canGenerate = (material.trim().length > 0 || file !== null) && !loading;

  const onPickFile = useCallback((picked: File | null) => {
    setFile(picked);
    setError(null);
  }, []);

  async function handleGenerate() {
    if (!canGenerate) return;
    setLoading(true);
    setError(null);

    try {
      const systemPrompt =
        config?.aiSystemPrompt ||
        "You are a friendly news producer and anchor scriptwriter. Turn the user's material into a clean, casual, easy-to-read anchor script. Write like a real person speaking on camera. Keep sentences short. Make the story clear. Do not invent facts. If a fact is unclear, mark it as 'Needs confirmation'. Avoid hype. Make the script sound natural, smooth, and confident.";

      // Persist a reference to the uploaded source (best-effort; non-blocking failure).
      let sourceRef = material.trim();
      if (file) {
        try {
          const uploaded = await uploadSourceDocument(file);
          if (!sourceRef) {
            sourceRef = `[Uploaded file: ${uploaded.originalname}]`;
          }
        } catch {
          // Upload of the reference copy failed — generation can still proceed
          // since the file is sent directly to the AI below.
        }
      }

      const generated = await generateScript({
        sourceMaterial: material,
        systemPrompt,
        language,
        tone,
        duration,
        output_style: outputStyle,
        file,
      });

      const saved = await createScript({
        title: generated.title,
        source_material: sourceRef,
        generated_summary: generated.summary,
        generated_script: generated.script,
        estimated_reading_time: generated.estimated_reading_time,
        language,
        tone,
        duration,
        output_style: outputStyle,
      });

      navigate(`/editor/${saved.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating your script.",
      );
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-[#ECECEC] bg-[#FAFAFA]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <BrandMark />
          <button
            type="button"
            onClick={() => navigate("/library")}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-[#6B7280] transition-colors hover:bg-white hover:text-[#111111]"
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Library</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-24 pt-12 sm:pt-16">
        {/* Hero copy */}
        <div className="af-fade-up mb-10 text-center">
          <span
            className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-[#4F46E5] shadow-sm ring-1 ring-[#ECECEC]"
            style={{ color: "var(--primary)" }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Anchor Studio
          </span>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[#111111] sm:text-[40px]">
            {heading}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-[#6B7280]">
            {subheading}
          </p>
        </div>

        {/* Composer card */}
        <div className="af-fade-up rounded-2xl border border-[#ECECEC] bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(0,0,0,0.10)]">
          <textarea
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder={placeholder}
            disabled={loading}
            rows={9}
            className="w-full resize-none rounded-xl bg-transparent px-4 py-4 text-[15px] leading-relaxed text-[#111111] placeholder:text-[#9CA3AF] focus:outline-none disabled:opacity-60"
          />

          {/* File chip */}
          {file && (
            <div className="mx-3 mb-2 flex items-center gap-2 rounded-lg bg-[#F4F4FB] px-3 py-2 text-sm text-[#374151]">
              <FileText className="h-4 w-4 shrink-0 text-[#4F46E5]" style={{ color: "var(--primary)" }} />
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => onPickFile(null)}
                disabled={loading}
                className="ml-auto rounded-full p-0.5 text-[#9CA3AF] transition-colors hover:bg-white hover:text-[#374151]"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 px-3 pb-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-[#6B7280] transition-colors hover:bg-[#F4F4F5] hover:text-[#111111] disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              <span>Upload file</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED}
              className="hidden"
              onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
            />
            <span className="text-xs text-[#9CA3AF]">PDF, DOCX, TXT, transcript</span>
          </div>
        </div>

        {/* Settings */}
        <div className="af-fade-up mt-6 grid grid-cols-1 gap-6 rounded-2xl border border-[#ECECEC] bg-white p-6 shadow-sm sm:grid-cols-2">
          <SettingGroup label="Language" options={LANGUAGE_OPTIONS} value={language} onChange={setLanguage} disabled={loading} />
          <SettingGroup label="Tone" options={TONE_OPTIONS} value={tone} onChange={setTone} disabled={loading} />
          <SettingGroup label="Duration" options={DURATION_OPTIONS} value={duration} onChange={setDuration} disabled={loading} />
          <SettingGroup label="Output style" options={OUTPUT_STYLE_OPTIONS} value={outputStyle} onChange={setOutputStyle} disabled={loading} />
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
            {error}
          </div>
        )}

        {/* Generate */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="af-fade-up mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(79,70,229,0.6)] transition-all duration-200 hover:translate-y-[-1px] hover:shadow-[0_12px_28px_-8px_rgba(79,70,229,0.7)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          style={{ background: "var(--primary)" }}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Writing your script…
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              {buttonLabel}
            </>
          )}
        </button>

        {footerText && (
          <p className="mt-12 text-center text-xs text-[#9CA3AF]">{footerText}</p>
        )}
      </main>
    </div>
  );
}
