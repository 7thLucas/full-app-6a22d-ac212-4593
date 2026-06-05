import { useCallback, useEffect, useRef, useState } from "react";

export interface TeleprompterState {
  playing: boolean;
  /** scroll offset in px (how far the content has scrolled up) */
  offset: number;
  /** total scrollable distance in px */
  maxOffset: number;
  /** pixels per second */
  speed: number;
  progress: number; // 0..1
  remainingSeconds: number;
}

interface Options {
  /** Ref to the scrolling content element. */
  contentRef: React.RefObject<HTMLElement | null>;
  /** Ref to the viewport element. */
  viewportRef: React.RefObject<HTMLElement | null>;
  /** Recompute trigger (e.g. font size / spacing / text changes). */
  recomputeKey: unknown;
}

const MIN_SPEED = 20;
const MAX_SPEED = 320;
const SPEED_STEP = 16;
const DEFAULT_SPEED = 80;
const SKIP_PX = 140;

/**
 * Smooth, eased teleprompter scroll engine driven by requestAnimationFrame.
 * Scrolling is continuous (constant velocity) which reads as cinematic; the
 * "easing" feel comes from CSS transforms + the active-line glow transitions in
 * the component, plus eased speed ramps when play/pause toggles.
 */
export function useTeleprompter({ contentRef, viewportRef, recomputeKey }: Options) {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);

  const offsetRef = useRef(0);
  const speedRef = useRef(DEFAULT_SPEED);
  const playingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  // Eased velocity ramp: current applied velocity glides toward target.
  const velRef = useRef(0);

  speedRef.current = speed;

  const measure = useCallback(() => {
    const content = contentRef.current;
    const viewport = viewportRef.current;
    if (!content || !viewport) return;
    // The content is padded top & bottom by half the viewport so the first and
    // last lines can reach screen center. Scrollable distance is content minus
    // viewport height.
    const max = Math.max(0, content.scrollHeight - viewport.clientHeight);
    setMaxOffset(max);
  }, [contentRef, viewportRef]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (contentRef.current) ro.observe(contentRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, recomputeKey]);

  const applyOffset = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(next, maxOffsetRef.current));
    offsetRef.current = clamped;
    setOffset(clamped);
  }, []);

  // Keep a ref of maxOffset for the rAF loop.
  const maxOffsetRef = useRef(0);
  useEffect(() => {
    maxOffsetRef.current = maxOffset;
  }, [maxOffset]);

  const tick = useCallback(
    (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const target = playingRef.current ? speedRef.current : 0;
      // Ease velocity toward target for smooth start/stop (no harsh jumps).
      const ramp = 6; // higher = snappier
      velRef.current += (target - velRef.current) * Math.min(1, ramp * dt);

      if (Math.abs(velRef.current) > 0.2) {
        const next = offsetRef.current + velRef.current * dt;
        if (next >= maxOffsetRef.current) {
          offsetRef.current = maxOffsetRef.current;
          setOffset(maxOffsetRef.current);
          velRef.current = 0;
          playingRef.current = false;
          setPlaying(false);
          lastTsRef.current = null;
          rafRef.current = null;
          return;
        }
        offsetRef.current = next;
        setOffset(next);
      }

      // Keep looping while playing OR while velocity is still bleeding off.
      if (playingRef.current || Math.abs(velRef.current) > 0.2) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        lastTsRef.current = null;
        rafRef.current = null;
      }
    },
    [],
  );

  const ensureLoop = useCallback(() => {
    if (rafRef.current == null) {
      lastTsRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  const play = useCallback(() => {
    if (offsetRef.current >= maxOffsetRef.current) {
      // restart from top if at the end
      applyOffset(0);
    }
    playingRef.current = true;
    setPlaying(true);
    ensureLoop();
  }, [applyOffset, ensureLoop]);

  const pause = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
    ensureLoop(); // let velocity ease down to 0
  }, [ensureLoop]);

  const toggle = useCallback(() => {
    if (playingRef.current) pause();
    else play();
  }, [play, pause]);

  const reset = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
    velRef.current = 0;
    applyOffset(0);
  }, [applyOffset]);

  const faster = useCallback(() => {
    setSpeed((s) => Math.min(MAX_SPEED, s + SPEED_STEP));
  }, []);

  const slower = useCallback(() => {
    setSpeed((s) => Math.max(MIN_SPEED, s - SPEED_STEP));
  }, []);

  const skipForward = useCallback(() => {
    applyOffset(offsetRef.current + SKIP_PX);
    ensureLoop();
  }, [applyOffset, ensureLoop]);

  const skipBack = useCallback(() => {
    applyOffset(offsetRef.current - SKIP_PX);
    ensureLoop();
  }, [applyOffset, ensureLoop]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const progress = maxOffset > 0 ? offset / maxOffset : 0;
  const remainingSeconds =
    speed > 0 ? Math.max(0, (maxOffset - offset) / speed) : 0;

  const state: TeleprompterState = {
    playing,
    offset,
    maxOffset,
    speed,
    progress,
    remainingSeconds,
  };

  return {
    state,
    controls: {
      play,
      pause,
      toggle,
      reset,
      faster,
      slower,
      skipForward,
      skipBack,
      measure,
    },
    speedLevel: Math.round(((speed - MIN_SPEED) / (MAX_SPEED - MIN_SPEED)) * 100),
  };
}
