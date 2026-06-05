# AnchorFlow — Product Overview

## What it is
AnchorFlow is an AI scriptwriting and teleprompter tool. A user pastes or uploads any
material, generates a casual, easy-to-read news-anchor script, edits it, and then reads
it in a smooth, cinematic full-screen teleprompter.

**Tagline:** "Turn any material into a clean anchor script."

The product is deliberately simple: no user roles, no complex workflow. Everything
serves four steps — **input material → generate script → edit script → display in
teleprompter mode**.

## Who it's for
People who record themselves on camera and need a fast path from raw material to a
confident read:
- Solo creators
- News-style presenters
- YouTubers & podcasters
- Small newsrooms

## Positioning
The teleprompter is the **hero feature** — a premium, TV-production-grade reading
experience. AnchorFlow collapses scripting and reading into one calm, polished workflow
so creators spend their time on camera, not wrestling with words.

## Scope (what's in)
1. Paste text or upload material (PDF, DOCX, TXT, or transcript).
2. Choose script settings.
3. Generate an AI news-style anchor script.
4. Edit the script (directly and via one-click transforms).
5. Open the script in a full-screen teleprompter viewer.

Out of scope: user accounts/roles, team collaboration, multi-step approval workflows,
anything that adds clutter.

## Core flow
1. User opens the app.
2. User pastes text or uploads material.
3. User chooses script settings.
4. User clicks "Generate Script".
5. AI creates a news-style anchor script.
6. User edits the script.
7. User clicks "Open Teleprompter".
8. The script appears in a beautiful full-screen teleprompter viewer.

## Pages

### 1. Home / Script Generator
- App name (AnchorFlow) and short description.
- Large input box for pasted material.
- Upload button for PDF, DOCX, TXT, or transcript.
- Script setting controls:
  - **Language:** English or Bahasa Indonesia
  - **Tone:** Casual, Business News, Formal News
  - **Duration:** 30 seconds, 1 minute, 2 minutes, 3 minutes
  - **Output style:** Anchor Script, Short Brief, Opening Monologue
- Generate Script button.
- Design: minimalistic, clean, modern, generous whitespace, large input area, no clutter.

### 2. Script Editor
Shows the generated output in a simple editor. Generated script includes a suggested
title, a short summary, the main anchor script, and an estimated reading time. Written
in a natural spoken style — short sentences, never robotic, not overly formal unless the
formal tone is chosen — easy for a presenter to read naturally on camera.

Editor features: edit directly, regenerate, make shorter, make longer, make more casual,
make more professional, copy script, open teleprompter.

### 3. Teleprompter (hero feature)
A full-screen teleprompter viewer with a premium TV-production feel.
- Large readable text; full-screen; smooth, eased vertical scrolling — never jumpy.
- Dark mode by default: clean black background, soft white text.
- Active line stays near center, with a subtle glowing/soft background highlight that
  moves smoothly line to line; text above and below slightly fades for focus.
- Adjustable scroll speed, font size, and line spacing.
- Subtle progress bar at the bottom and estimated time remaining.
- Controls auto-hide after a few seconds of inactivity; reappear on mouse move.
- Controls: Play/Pause, Reset, Speed up, Slow down, Increase/Decrease font size,
  Full screen, Exit teleprompter.
- Keyboard shortcuts: Space = play/pause, Up = faster, Down = slower,
  Right = skip forward slightly, Left = go back slightly, Escape = exit full screen.

## AI behavior
System instruction used inside the app:

> "You are a friendly news producer and anchor scriptwriter. Turn the user's material
> into a clean, casual, easy-to-read anchor script. Write like a real person speaking on
> camera. Keep sentences short. Make the story clear. Do not invent facts. If a fact is
> unclear, mark it as 'Needs confirmation'. Avoid hype. Make the script sound natural,
> smooth, and confident."

**Output format:**
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

## Brand & tone
- Voice: natural, calm, confident, conversational — like a real person on camera.
- Visual: minimalistic, clean, premium but simple, lots of whitespace, smooth
  animations, few buttons.
- Mobile responsive; best experience on desktop or tablet.

## Data model
Table `scripts`:
`id`, `title`, `source_material`, `generated_summary`, `generated_script`, `language`,
`tone`, `duration`, `estimated_reading_time`, `created_at`, `updated_at`.

## Strategic principles
- Keep it radically simple — protect the four-step flow from feature creep.
- The teleprompter experience is the differentiator; quality of motion and readability
  matters most.
- Never invent facts; surface uncertainty as "Needs confirmation".
- Polished, production-ready feel over breadth of features.

## Success criteria
- User can paste or upload material.
- User can generate a casual anchor script.
- User can edit the script.
- User can open the script in teleprompter mode.
- Teleprompter scroll is smooth and the active line is highlighted while moving.
- Text is easy to read on screen.
- App feels simple, polished, and production-ready.
