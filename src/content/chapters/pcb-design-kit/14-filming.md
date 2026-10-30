---
project: pcb-design-kit
title: "Filming it: OBS and a camera Claude can aim"
order: 14
date: 2026-10-29
summary: "Claude starts and stops OBS, splits the recording at every gate, pauses before anything private, and can swing an OBSBOT Tiny 2 to the bench when it's time to show the board."
status: draft
---

The footage from design sessions is raw material for build videos, edited later in
Descript. Recordings stay on your PC, out of git, and go nowhere unless you ask.

## Setting up OBS

You say "set up OBS" once. Claude:

- asks which monitor shows KiCad and which shows the terminal, and whether to include
  a webcam and computer sound;
- creates a separate **PCB Design** scene collection with Desk, Terminal and Both
  scenes, an optional webcam corner, and a "Back in a moment" card;
- sets the recording format to **Hybrid MP4,** which survives crashes and supports
  chapter markers;
- makes a 5-second test recording and confirms the file exists.

## During a session

- Recording starts after Claude reads the board's status, announced in one line.
- Scenes change only when the view changes for more than a minute.
- **At every gate pass, a chapter marker goes in and the file splits,** so each gate is
  its own clip.
- A marker log (time, scene, event, file) is written as things happen. It's the edit list.
- **Recording pauses** before any sign-in, account, payment or checkout page, before
  showing a password, token or config file, and when you say "off the record".
- It stops at the wrap-up and reports the files and total length.

## The camera

With an OBSBOT Tiny 2 plugged in, "set up the camera" builds three presets with you:
**Desk** (talking), **Bench** (the board, close) and **Wide** (the room).

- Talking to camera: Desk, with AI tracking on.
- Showing hardware: tracking off, Bench, then a snapshot and zoom to frame the board.
- Back to screens: Desk again, plus an OBS scene switch.
- At the end: tracking off, and the camera goes to sleep with the lens face-down.

Snapshots are used only for aiming, never saved or uploaded. The camera's own recording
is denied, because it would fight OBS for the device; everything records through OBS.
Streaming is denied outright.

## Update, Oct 29: one scene per app, an edit list, and a teleprompter

The first full day of filming changed a few things.

**One scene per app instead of per monitor.** The **PCB Design** collection now has a
window capture for each app: the launcher, KiCad, the Claude Code terminal and the
browser. Each capture follows its window wherever it is on screen. There's also a
full-frame **Me** scene for the camera and the **Paused** card. The camera support
described above is merged.

**From footage to an edit list.** The marker log is now the input to an edit-list
script. It reads the log, the OBS files (named by start time) and the board's commits,
and works out where each gate, milestone and commit falls inside each file. Paused time
is taken out, because OBS stops a file's clock while it's paused. Say "rough cut" and
Claude lists the files, asks before uploading anything to Descript, and has Descript's
AI editor cut to the list. It never publishes; you finish the edit.

**A recordings window in the launcher.** It lists every recording across boards with its
length, size and markers, plays one, shows how much disk space is left, and starts or
closes OBS. It won't close OBS while it's recording.

**Shot list and teleprompter.** Each board keeps a list of the shots its chapters need:
spoken pieces (an intro, a recap per gate) with a full script and talking points, and
silent shots to film on the bench. The launcher shows the scripts on a teleprompter,
and each take is marked in the log so the edit list can file it under its chapter.

**Voice dictation.** Hold Space in Claude Code and talk, and your words are typed into
the prompt. While OBS is recording, that's captured as narration too, so pause first
before saying anything private.

**What went wrong: the recording didn't start.** The rule was "start recording when the
session opens", but it lived inside the recording skill, and Claude only loads a skill
when the task seems to need it. The session opened with "is Quilter done yet?", so
Claude loaded the Quilter skill, and nothing started recording until Jeff noticed ten
minutes later. The fix, in review now, is a small session-start hook. When a session
opens inside the workspace with recording turned on, it puts "start the recording first"
in front of Claude before the first message. It stays quiet in the nightly unattended
runs, which never film.
