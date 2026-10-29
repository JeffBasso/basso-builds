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

*The camera support is in review and not merged yet.*
