# AnchorFlow — Design Guidelines

## Design principles
- Minimalist, clean, premium-but-simple. Lots of whitespace. Avoid clutter and avoid too many buttons.
- Broadcast-grade calm: the UI should feel like professional TV production gear — confident, quiet, precise.
- The teleprompter is the hero. Everything else stays understated so the teleprompter shines.
- Mobile responsive; optimized for desktop and tablet.
- Smooth, eased animations everywhere. Nothing jumpy or harsh.

## Color
**App (light) surfaces — Generator & Editor**
- Background: near-white / soft neutral (#FFFFFF / #FAFAFA).
- Surface cards: white with very soft elevation.
- Primary text: near-black (#111111).
- Secondary text: muted gray (#6B7280).
- Accent: a single calm, premium accent (deep indigo/blue, e.g. #4F46E5) used sparingly for the primary action ("Generate Script", "Open Teleprompter").
- Borders/dividers: subtle hairlines (#E5E7EB).

**Teleprompter (dark) surface — hero**
- Background: clean true black (#000000).
- Text: soft white (#F2F2F2 / rgba(255,255,255,0.85)), never pure harsh white for inactive lines.
- Inactive lines: dimmed (rgba(255,255,255,0.25–0.4)) and fading further from center.
- Active line: brighter soft white with a soft glow highlight (subtle blur/box-shadow or low-opacity highlight band) that moves smoothly line-to-line and stays centered.
- Progress bar: thin, low-opacity accent.

## Typography
- UI font: clean modern sans-serif (Inter / system-ui).
- Generator/Editor: comfortable sizes, generous line-height, clear hierarchy (large page title, muted helper text).
- Teleprompter: very large, highly readable text; generous line-height for on-camera reading; adjustable font size and line spacing.

## Layout & spacing
- Centered, max-width content with wide margins and lots of breathing room.
- Generator: large paste box as the focal element; settings grouped neatly below/beside; single prominent primary button.
- Editor: clear sections for Title, Summary, Script, Estimated Reading Time; refinement actions grouped subtly (toolbar), primary "Open Teleprompter" emphasized.
- Teleprompter: full-bleed; reading column centered with comfortable max-width; controls docked at bottom, auto-hiding.

## Elevation & components
- Soft, low shadows; rounded corners (medium radius ~12–16px) on cards, inputs, buttons.
- Inputs: large, friendly, clear focus states using the accent.
- Buttons: primary (filled accent) for main actions; secondary (ghost/outline) for refinements; minimal icon buttons for teleprompter controls.
- Progress bar: thin, smooth, subtle.

## Motion
- Use easing (ease-out / cubic-bezier) for all transitions.
- Teleprompter scroll: continuous, smooth, eased — like a real TV teleprompter. Active-line glow transitions smoothly between lines. Fades above/below update fluidly.
- Controls fade in/out gently on inactivity/mouse-move.
- Speed/pause/start changes ease in rather than snapping.