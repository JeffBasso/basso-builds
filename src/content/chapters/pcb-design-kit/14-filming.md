---
project: pcb-design-kit
title: "Filming it: OBS, a camera Claude can aim, and an episode per gate"
order: 14
date: 2026-11-13
summary: "Claude films design sessions with OBS and an OBSBOT Tiny 2 that follows you, marks every gate, and pauses before anything private. Each gate passed becomes one episode, rendered overnight on the PC, that reaches YouTube only after you've watched it and approved it twice."
status: draft
---

Design sessions are filmed for the build videos. Recordings stay on your PC, out of
git. Each gate passed becomes one episode, cut and rendered on the same PC. Nothing goes
online until you've watched it and said so, twice.

## Setting up OBS

The installer puts in OBS Studio and its WebSocket server and connects Claude to it.
It asks once whether Claude should record your sessions; you can change that any time.
Then you say "set up OBS" once. Claude:

- asks which apps to film, and whether to include computer sound;
- creates a separate **PCB Design** scene collection with one window capture per app:
  the launcher, KiCad, the Claude Code terminal and the browser. Each capture follows
  its window wherever it is on screen. There's also a full-frame **Me** scene for the
  camera and a **Paused** card that reads "Back in a moment";
- sets the recording format to **Hybrid MP4,** which survives crashes and keeps chapter
  markers;
- makes a 5-second test recording and confirms the file exists.

Two details took a few tries. The launcher is captured by its program and title, not
by title alone: its window class changes every time it starts, so a title match filmed
a blank frame after a restart. And OBS's own update check is turned off: an update
prompt from the hidden OBS the launcher starts would have nobody to answer it. You
update OBS by hand, with it closed.

## During a session

| When | What Claude does |
|---|---|
| Session start | Starts recording before the first task, even if the first message is a quick question, and says so in one line |
| The work moves to another app | Switches scene, but only when the view changes for more than a minute |
| A gate passes | Adds a chapter marker named for the gate, then splits the file so each gate is its own clip |
| A long job starts or returns | Adds a marker ("Quilter submitted", "DRC clean") so the wait can be cut later |
| A sign-in, account, payment or checkout page, or a secret on screen | Pauses, and logs the pause |
| You say "off the record" | Pauses until you say otherwise |
| Done for the day | Stops, reports the files and total length, and closes OBS so the camera is free |

Gates now run as pull requests, so in a gate session the marker goes in when the gate's
PR is opened. Your merge is the actual pass.

Every marker is also written to a log beside the recordings (time, scene, event, file).
That log is the edit list's raw material, so Claude logs more than gates: first results,
a reveal, a measurement, the camera on the board. Every pause and resume is logged too,
because OBS stops a file's clock while it's paused and every later position depends on it.

If another Claude Code session is still open, the recording keeps going for that one:
OBS has one recording shared by every session.

## The camera

With an OBSBOT Tiny 2 plugged in, "set up the camera" builds three presets with you:
**Desk** (talking), **Bench** (the board, close) and **Wide** (the room).

- The camera follows you all session, tracking your upper body at a smooth speed.
- Showing hardware: tracking off, Bench, then a snapshot and zoom to frame the board.
- Back to screens: tracking on again, plus an OBS scene switch.
- At the end: tracking off, and the camera goes to sleep with the lens face-down.

Snapshots are used only for aiming, never saved or uploaded. The camera's own recording
is denied, because it would fight OBS for the device; everything records through OBS.
Streaming is denied outright.

## Shot list and teleprompter

Each board keeps a list of the shots its chapters need: spoken pieces (an intro, a recap
per gate) with a full script and talking points, and silent shots to film on the bench.
Claude writes it, and updates it at the wrap-up when a gate passed. The launcher shows
the scripts on a teleprompter strip right under the camera. Each take switches OBS to the
Me scene and back and is marked in the log, so the edit can file it under its chapter.
While a take is going, Claude doesn't switch scenes or move the camera.

**Voice dictation.** Hold Space in Claude Code and talk, and your words are typed into
the prompt. While OBS is recording, that's captured as narration too, so pause first
before saying anything private.

## From footage to an episode

Every gate passed becomes one episode, built from all the footage since the previous
gate pass, across days. The nightly run builds new ones after the wrap-up, so they're
waiting in the morning:

1. **Edit list.** A script reads the marker log, the recordings (named by start time)
   and the board's commits, and works out where each gate, milestone and commit falls
   inside each file, with paused time taken out.
2. **Pre-cut.** Waits on long jobs and paused time come out. The gate's teleprompter
   takes go first.
3. **Transcript** with Whisper, run on the PC.
4. **Cuts.** Pauses in takes are tightened and silent screen time is fast-forwarded.
   One Claude pass picks the better take, drops false starts and anything private said
   aloud, and writes the title, description, tags and chapters.
5. **Render** with FFmpeg: intro and outro cards, noise reduction, loudness normalized,
   captions, YouTube chapters, and a thumbnail from the board's 3D render.
6. **Privacy scan.** Everything that reaches the episode, fast-forwarded parts included,
   is read with OCR every 2 seconds, looking for prices, totals, order numbers, emails,
   phone numbers and tokens. Nothing is blurred automatically; each flag goes to you with
   its time.

The video step has its own time limit inside the nightly job (75 minutes by default).
Past it, the render stops and the next night carries on.

## The VIDEO GATE

Each episode moves through four states, and every move is your call, said in a session:

| State | How it gets there |
|---|---|
| Ready | Rendered overnight. Claude tells you the length, chapters, title and every privacy flag with its time, and opens the folder so you can watch it |
| Approved | You say "approve". A stretch you want out ("cut 1:23 to 1:40") is re-rendered first. Approval records the exact files that were scanned, and the upload refuses anything changed since |
| Uploaded | Goes to YouTube as **private** |
| Public | A second, separate "publish it", after you've watched the private upload |

Nothing YouTube runs unattended. Once an episode is public, its build-log chapter gets
the video embedded. A Descript polish is still there when you ask for one, but the
episode no longer needs it.

The launcher's **Recordings** window lists every recording across boards with its length,
size and markers, plays one, shows how much recording time the disk has left, and starts
or closes OBS. It won't close OBS while it's recording.

## What went wrong, and the fixes

**The recording didn't start.** The rule was "start recording when the session opens",
but it lived inside the recording skill, and Claude only loads a skill when the task
seems to need it. One session opened with "is Quilter done yet?", so Claude loaded the
Quilter skill, and nothing recorded for ten minutes. Now a small session-start hook puts
"start the recording first" in front of Claude before the first message, whenever a
session opens in the workspace with recording on. It stays quiet in unattended runs,
which never film.

**A 19-hour recording.** A recording left running overnight ended up inside an
enclosure's Gate 1 episode, and re-encoding it held the nightly job past its two-hour
limit every night for days. Two guards came out of it. A part whose marker log picks up
a recording started for something else gets that file only from 30 seconds before its
own first marker; that episode went from 19 hours of footage to under two. And an episode
with more than 4 hours of footage isn't rendered at all: it's marked "too long" with the
days to check, until you fix the log or say the footage is right.
