import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Pause,
  Play,
  RotateCcw,
  Gauge,
  Type,
  Maximize,
  Minimize,
  X,
  Loader2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { getScript } from "~/scripts/scripts.client";
import type { ScriptRecord } from "~/scripts/scripts.types";
import { useTeleprompter } from "~/scripts/teleprompter/use-teleprompter";

const FONT_MIN = 28;
const FONT_MAX = 88;
const FONT_STEP = 6;

function splitLines(script: string): string[] {
  // Break into readable chunks: keep paragraphs, but split very long lines on
  // sentence boundaries so each teleprompter line stays comfortable.
  const blocks = script
    .replace(/\r\n/g, "\n")
    .split(/\n+/)
    .map((b) => b.trim())
    .filter(Boolean);

  const out: string[] = [];
  for (const block of blocks) {
    if (block.length <= 90) {
      out.push(block);
      continue;
    }
    const sentences = block.match(/[^.!?]+[.!?]*\s*/g) ?? [block];
    let buf = "";
    for (const s of sentences) {
      if ((buf + s).trim().length > 90 && buf) {
        out.push(buf.trim());
        buf = s;
      } else {
        buf += s;
      }
    }
    if (buf.trim()) out.push(buf.trim());
  }
  return out.length ? out : ["No script content."];
}

function formatTime(seconds: number): string {
  const s = Math.round(seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export default function TeleprompterPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState<ScriptRecord | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [fontSize, setFontSize] = useState(48);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lines = useMemo(
    () => (record ? splitLines(record.generated_script) : []),
    [record],
  );

  const { state, controls, speedLevel } = useTeleprompter({
    contentRef,
    viewportRef,
    recomputeKey: `${fontSize}-${lines.length}`,
  });

  // Load script
  useEffect(() => {
    let active = true;
    if (!id) return;
    getScript(id)
      .then((r) => {
        if (!active) return;
        if (!r) setNotFound(true);
        else setRecord(r);
      })
      .catch(() => active && setNotFound(true));
    return () => {
      active = false;
    };
  }, [id]);

  // Mark body so global CSS paints a true-black, no-scroll surface.
  useEffect(() => {
    document.body.setAttribute("data-teleprompter", "true");
    return () => document.body.removeAttribute("data-teleprompter");
  }, []);

  // Auto-hide controls.
  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
  }, []);

  useEffect(() => {
    showControls();
    const onMove = () => showControls();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchstart", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchstart", onMove);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [showControls]);

  // Fullscreen state sync.
  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      /* fullscreen may be blocked; ignore */
    }
  }, []);

  const exit = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    navigate(record ? `/editor/${record.id}` : "/");
  }, [navigate, record]);

  const biggerFont = useCallback(
    () => setFontSize((f) => Math.min(FONT_MAX, f + FONT_STEP)),
    [],
  );
  const smallerFont = useCallback(
    () => setFontSize((f) => Math.max(FONT_MIN, f - FONT_STEP)),
    [],
  );

  // Keyboard shortcuts.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      switch (e.code) {
        case "Space":
          e.preventDefault();
          controls.toggle();
          showControls();
          break;
        case "ArrowUp":
          e.preventDefault();
          controls.faster();
          showControls();
          break;
        case "ArrowDown":
          e.preventDefault();
          controls.slower();
          showControls();
          break;
        case "ArrowRight":
          e.preventDefault();
          controls.skipForward();
          showControls();
          break;
        case "ArrowLeft":
          e.preventDefault();
          controls.skipBack();
          showControls();
          break;
        case "Escape":
          if (document.fullscreenElement) {
            // browser handles exiting fullscreen; keep viewer open
          } else {
            exit();
          }
          break;
        default:
          break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [controls, exit, showControls]);

  // Determine active line: the one whose center is nearest the viewport center.
  const [activeLine, setActiveLine] = useState(0);
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const centerY = viewport.clientHeight / 2;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < lineRefs.current.length; i++) {
      const el = lineRefs.current[i];
      if (!el) continue;
      // element rect within content; content is translated by -offset.
      const elCenter = el.offsetTop + el.offsetHeight / 2 - state.offset;
      const dist = Math.abs(elCenter - centerY);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    setActiveLine(best);
  }, [state.offset, fontSize, lines.length]);

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6 text-center">
        <p className="text-white/60">This script could not be found.</p>
        <button
          onClick={() => navigate("/")}
          className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/15"
        >
          Back to studio
        </button>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-7 w-7 animate-spin text-white/40" />
      </div>
    );
  }

  const padBlock = "50vh";

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-black"
      onClick={() => controls.toggle()}
    >
      {/* Reading viewport */}
      <div ref={viewportRef} className="absolute inset-0 overflow-hidden">
        <div
          ref={contentRef}
          className="will-change-transform"
          style={{
            transform: `translate3d(0, ${-state.offset}px, 0)`,
            paddingTop: padBlock,
            paddingBottom: padBlock,
          }}
        >
          <div className="mx-auto w-full max-w-5xl px-8">
            {lines.map((line, i) => {
              const distance = Math.abs(i - activeLine);
              const isActive = i === activeLine;
              // Fade lines further from the active one.
              const opacity = isActive
                ? 1
                : Math.max(0.16, 0.5 - distance * 0.12);
              return (
                <p
                  key={i}
                  ref={(el) => {
                    lineRefs.current[i] = el;
                  }}
                  className="relative mx-auto my-[0.55em] max-w-4xl text-center font-semibold tracking-tight transition-[opacity,color,text-shadow] duration-500 ease-out"
                  style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: 1.32,
                    opacity,
                    color: isActive
                      ? "rgba(255,255,255,0.96)"
                      : "rgba(255,255,255,0.55)",
                    textShadow: isActive
                      ? "0 0 28px rgba(255,255,255,0.28), 0 0 2px rgba(255,255,255,0.4)"
                      : "none",
                  }}
                >
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      {/* Center active-line glow band */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2"
        style={{
          height: `${fontSize * 2.1}px`,
          background:
            "radial-gradient(ellipse at center, rgba(99,102,241,0.16) 0%, rgba(99,102,241,0.06) 45%, rgba(0,0,0,0) 75%)",
        }}
        aria-hidden
      />

      {/* Top + bottom vignettes for cinematic focus */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-44"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%)",
        }}
        aria-hidden
      />

      {/* Progress bar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
        <div
          className="h-full transition-[width] duration-150 ease-linear"
          style={{
            width: `${state.progress * 100}%`,
            background: "var(--primary)",
          }}
        />
      </div>

      {/* Controls */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 transition-all duration-500 ease-out"
        style={{
          opacity: controlsVisible ? 1 : 0,
          transform: controlsVisible ? "translateY(0)" : "translateY(16px)",
          pointerEvents: controlsVisible ? "auto" : "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Time + speed readout */}
        <div className="mx-auto mb-2 flex max-w-2xl items-center justify-between px-6 text-xs text-white/55">
          <span className="tabular-nums">
            {formatTime(state.remainingSeconds)} left
          </span>
          <span className="flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5" /> Speed {speedLevel}%
          </span>
        </div>

        <div className="flex justify-center pb-7">
          <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-black/60 px-2 py-2 backdrop-blur-xl">
            <CtrlButton label="Reset" onClick={controls.reset}>
              <RotateCcw className="h-5 w-5" />
            </CtrlButton>
            <CtrlButton label="Slower" onClick={controls.slower}>
              <ChevronDown className="h-5 w-5" />
            </CtrlButton>

            <button
              type="button"
              aria-label={state.playing ? "Pause" : "Play"}
              onClick={controls.toggle}
              className="mx-1 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              style={{ background: "var(--primary)" }}
            >
              {state.playing ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 translate-x-[1px]" />
              )}
            </button>

            <CtrlButton label="Faster" onClick={controls.faster}>
              <ChevronUp className="h-5 w-5" />
            </CtrlButton>

            <div className="mx-1 h-7 w-px bg-white/10" />

            <CtrlButton label="Smaller text" onClick={smallerFont}>
              <span className="flex items-center">
                <Type className="h-4 w-4" />
                <span className="ml-0.5 text-xs">−</span>
              </span>
            </CtrlButton>
            <CtrlButton label="Larger text" onClick={biggerFont}>
              <span className="flex items-center">
                <Type className="h-5 w-5" />
                <span className="ml-0.5 text-xs">+</span>
              </span>
            </CtrlButton>

            <div className="mx-1 h-7 w-px bg-white/10" />

            <CtrlButton label="Fullscreen" onClick={toggleFullscreen}>
              {isFullscreen ? (
                <Minimize className="h-5 w-5" />
              ) : (
                <Maximize className="h-5 w-5" />
              )}
            </CtrlButton>
            <CtrlButton label="Exit" onClick={exit}>
              <X className="h-5 w-5" />
            </CtrlButton>
          </div>
        </div>
      </div>

      {/* Title chip (top-left) */}
      <div
        className="absolute left-6 top-6 z-20 transition-opacity duration-500"
        style={{ opacity: controlsVisible ? 1 : 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="max-w-[60vw] truncate text-sm font-medium text-white/55">
          {record.title}
        </p>
      </div>
    </div>
  );
}

function CtrlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-xl text-white/75 transition-all hover:bg-white/10 hover:text-white active:scale-95"
    >
      {children}
    </button>
  );
}
