# AnchorFlow — Product Overview

## What it is
AnchorFlow is a simple, single-user AI scriptwriting and teleprompter web app. There is no auth, no roles, and no complex workflow. A user pastes or uploads any material, generates a casual, easy-to-read news anchor script, edits it, then displays it in a smooth cinematic teleprompter.

## Core flow
1. User opens the app.
2. User pastes text or uploads material (PDF, DOCX, TXT, transcript).
3. User chooses script settings.
4. User clicks "Generate Script".
5. AI creates a news-style anchor script.
6. User edits the script.
7. User clicks "Open Teleprompter".
8. The script appears in a beautiful full-screen teleprompter viewer.

## Users, brand, tone
- **Users:** Solo news anchors, content creators, presenters, video producers. Single user — no login.
- **Brand:** AnchorFlow. Tagline: "Turn any material into a clean anchor script."
- **Tone:** Calm, premium, professional, broadcast-grade. The product feels like real TV production gear — confident and unobtrusive.
- **Anti-references:** Avoid cluttered dashboards, too many buttons, hype language, robotic/over-formal copy.

## Pages
### 1. Home / Script Generator
- App name "AnchorFlow" + tagline "Turn any material into a clean anchor script."
- Large paste-text input box (the hero of this page).
- Upload button accepting PDF, DOCX, TXT, transcript files.
- Script settings:
  - **Language:** English / Bahasa Indonesia
  - **Tone:** Casual / Business News / Formal News
  - **Duration:** 30s / 1m / 2m / 3m
  - **Output style:** Anchor Script / Short Brief / Opening Monologue
- "Generate Script" button.
- Minimalist, clean, modern, lots of whitespace, no clutter.

### 2. Script Editor
After generating, show a simple editor with:
- Suggested Title
- Short Summary
- Main Anchor Script (natural spoken style, short sentences, not robotic)
- Estimated Reading Time
- Features: Edit directly, Regenerate, Make shorter, Make longer, Make more casual, Make more professional, Copy script, Open Teleprompter.

### 3. Teleprompter (HERO FEATURE)
Full-screen cinematic teleprompter with a premium TV-production feel.
- Large readable text, dark mode default (clean black bg, soft white text).
- Smooth eased vertical scrolling — natural, cinematic, never jumpy.
- Active line highlighted with a soft glow that smoothly moves line-to-line and stays centered.
- Text above/below the active line fades for focus.
- Smooth transitions on start/pause/speed change.
- Subtle bottom progress bar + estimated time remaining.
- Auto-hiding controls that reappear on mouse move.
- Controls: Play/Pause, Reset, Speed up/down, Font size up/down, Line spacing, Full screen, Exit.
- Keyboard shortcuts: Space = play/pause, ArrowUp = faster, ArrowDown = slower, ArrowRight = skip forward, ArrowLeft = back, Escape = exit fullscreen.

## AI behavior
System prompt the app uses for generation:
> "You are a friendly news producer and anchor scriptwriter. Turn the user's material into a clean, casual, easy-to-read anchor script. Write like a real person speaking on camera. Keep sentences short. Make the story clear. Do not invent facts. If a fact is unclear, mark it as 'Needs confirmation'. Avoid hype. Make the script sound natural, smooth, and confident."

Output format:
```
Title:
[Suggested title]

Summary:
[One short paragraph summary]

Anchor Script:
[Teleprompter-ready script]

Estimated Reading Time:
[Estimated duration]
```

The AI must respect the selected Language, Tone, Duration, and Output style. Refinement actions (shorter / longer / more casual / more professional / regenerate) re-run generation against the current script.

## Data model
Single `scripts` table:
- id
- title
- source_material
- generated_summary
- generated_script
- language
- tone
- duration
- estimated_reading_time
- created_at
- updated_at

## Strategic principles
- Keep it dead simple: input → generate → edit → teleprompt.
- The teleprompter is the hero — it must feel polished, cinematic, production-ready.
- Never invent facts; mark unclear facts "Needs confirmation".
- Mobile responsive, best on desktop/tablet.

## Success criteria
- User can paste or upload material.
- User can generate a casual anchor script.
- User can edit the script.
- User can open the script in teleprompter mode.
- Teleprompter scroll is smooth and the active line is highlighted while moving.
- Text is easy to read; the app feels simple, polished, and production-ready.