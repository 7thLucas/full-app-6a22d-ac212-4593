Build a simple web app called “AnchorFlow”.

AnchorFlow is an AI scriptwriting and teleprompter tool. The user can paste or upload any material, generate a casual and easy-to-read news anchor script, edit it, then display it in a smooth teleprompter view.

Keep the app very simple. No user roles. No complicated workflow. Focus only on:

1. Input material
2. Generate script
3. Edit script
4. Display script in teleprompter mode

Core flow:

1. User opens the app.
2. User pastes text or uploads material.
3. User chooses script settings.
4. User clicks “Generate Script”.
5. AI creates a news-style anchor script.
6. User can edit the script.
7. User clicks “Open Teleprompter”.
8. The script appears in a beautiful full-screen teleprompter viewer.

Main pages:

1. Home / Script Generator Page

The page should have:

* App name: AnchorFlow
* Short description: “Turn any material into a clean anchor script.”
* Input box for pasted material
* Upload button for PDF, DOCX, TXT, or transcript file
* Script setting controls:

  * Language: English or Bahasa Indonesia
  * Tone: Casual, Business News, Formal News
  * Duration: 30 seconds, 1 minute, 2 minutes, 3 minutes
  * Output style: Anchor Script, Short Brief, Opening Monologue
* Generate Script button

The design should be minimalistic, clean, and modern.
Use a lot of whitespace.
Make the input area large and easy to use.
Avoid clutter.

2. Script Editor Page

After generating, show the output in a simple editor.

The generated script should include:

* Suggested title
* Short summary
* Main anchor script
* Estimated reading time

The script should be written in a natural spoken style.
Use short sentences.
Avoid robotic wording.
Avoid sounding too formal unless the user selects formal tone.
Make it easy for a presenter to read naturally on camera.

Editor features:

* Edit script directly
* Regenerate script
* Make shorter
* Make longer
* Make more casual
* Make more professional
* Copy script
* Open Teleprompter

3. Teleprompter Page

This is the most important part of the app.

Create a full-screen teleprompter viewer with a premium TV production feel.

Teleprompter requirements:

* Large readable text
* Full-screen mode
* Smooth vertical scrolling
* Start, pause, reset controls
* Adjustable scroll speed
* Adjustable font size
* Adjustable line spacing
* Dark mode by default
* Clean black background
* Soft white text
* Highlight the current active line while the text moves
* The active line should stay near the center of the screen
* Use a subtle glowing highlight or soft background highlight behind the current line
* Text above and below the active line should slightly fade for better focus
* Animation must feel very smooth, like a real TV production teleprompter
* Transitions should be smooth when starting, pausing, and changing speed
* No harsh movement or jumpy scrolling

Teleprompter visual behavior:

* Current line is highlighted as the script scrolls
* Highlight smoothly moves from line to line
* The text scroll should feel natural and cinematic
* Use easing animation for scrolling
* Keep the reading area centered
* Add a subtle progress bar at the bottom
* Add estimated time remaining
* Hide controls automatically after a few seconds of inactivity
* Show controls again when mouse moves

Teleprompter controls:

* Play / Pause
* Reset
* Speed up
* Slow down
* Increase font size
* Decrease font size
* Full screen
* Exit teleprompter

Keyboard shortcuts:

* Spacebar: play or pause
* Arrow up: faster
* Arrow down: slower
* Arrow right: skip forward slightly
* Arrow left: go backward slightly
* Escape: exit full screen

AI behavior:

Use this AI instruction inside the app:

“You are a friendly news producer and anchor scriptwriter. Turn the user’s material into a clean, casual, easy-to-read anchor script. Write like a real person speaking on camera. Keep sentences short. Make the story clear. Do not invent facts. If a fact is unclear, mark it as ‘Needs confirmation’. Avoid hype. Make the script sound natural, smooth, and confident.”

Script output format:

Title:
[Suggested title]

Summary:
[One short paragraph summary]

Anchor Script:
[Teleprompter-ready script]

Estimated Reading Time:
[Estimated duration]

Design notes:

* Minimalistic
* Clean
* Premium but simple
* Easy to read
* Mobile responsive
* Best experience on desktop or tablet
* Use smooth animations
* Avoid too many buttons
* Make the teleprompter the hero feature

Data model:

Create a simple table called scripts:

* id
* title
* source_material
* generated_summary
* generated_script
* language
* tone
* duration
* estimated_reading_time
* created_at
* updated_at

Success criteria:

* User can paste or upload material.
* User can generate a casual anchor script.
* User can edit the script.
* User can open the script in teleprompter mode.
* Teleprompter scroll is smooth.
* Active line is highlighted while moving.
* Text is easy to read on screen.
* App feels simple, polished, and production-ready.


immediate build this, skip the intro