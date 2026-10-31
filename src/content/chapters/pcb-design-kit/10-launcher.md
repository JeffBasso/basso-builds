---
project: pcb-design-kit
title: "The launcher window"
order: 10
date: 2026-10-27
summary: "A desktop window listing every board with its current gate, buttons to open it in Claude Code or KiCad, a picture viewer for renders, and a New board button that creates the repo and starts Gate 1."
status: published
---

A desktop shortcut called **PCB Design** opens a small window.

## The board list

Every board and project, with its kind, a **Phase column** read from the status header
("Phase, gate passed with date, next step"), the last update, and what pictures exist.
Double-click opens Claude Code in that folder, so both the workspace and board rules load.

## Buttons

- **Open board, Open in KiCad, Open folder.**
- **Design pictures** shows thumbnails of every render and schematic PDF, for one board
  or all of them. **Refresh exports** regenerates them straight from the KiCad files,
  without starting Claude.
- **New board** creates the folder, the git repo with its push hook, and a private
  GitHub repo. It can take a **design spec**, as a file or a Claude Doc link, saved as
  the board's spec. Then it starts Claude with "start at GATE 1: draft the requirements
  from the spec and interview me only about what it leaves open".
- **New project** does the same for non-board designs, such as a speaker box.
- **Workspace** opens Claude at the root, for rules, books and lessons.
- **Books folder, Nightly indexing, Library:** where book PDFs go, the nightly settings,
  and which wanted titles you have.
- **Update kit** runs the installer in update mode.

A checkbox turns Chrome on for the session (needed for Quilter and PCBWay).

## Starting a session

If recording is on, the launcher **starts OBS first,** minimized, and waits for its
WebSocket port. The OBS connector only connects if OBS is already running when Claude
Code starts.

## Update, Oct 30: a Kit button

Changing the kit used to happen from inside a board session, which mixed tool work into that board's recording
and wrap-up. The launcher now has a **Kit (tool design)** button that opens Claude Code in the kit's own working
copy, with its own rules: every change is a branch and a pull request, the installed copies are never edited,
tests run before the PR, and its end-of-day is just "push and list the open PRs". The launcher also starts Chrome
before Claude Code, so the browser tools are there from the first message.
