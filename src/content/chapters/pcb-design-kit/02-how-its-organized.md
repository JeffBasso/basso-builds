---
project: pcb-design-kit
title: "How it's organized: three layers of repos"
order: 2
date: 2026-10-25
summary: "The kit, the workspace and each board are separate git repos whose folders nest on disk, so Claude loads the right rules wherever it starts. Datasheets and books live on Google Drive instead, on purpose."
status: published
---

## Three layers, nested folders, separate repos

1. **The kit** holds the tooling: installer, rules, skills, guard hook, launcher,
   nightly scripts and tests. It's installed into the workspace's `tools` folder and
   **never edited there.** "Update kit" pulls it.
2. **The workspace** is home base: the rules file (copied from the kit), a lessons file
   that belongs to you, reference notes, status files, logs and settings.
3. **One private repo per board** under `boards`, and one per non-board design (a
   speaker box, a bracket) under `projects`.

**Why nest the folders but not the repos?** Claude Code reads every `CLAUDE.md` from
the folder it starts in up to the root. Start a session in a board's folder and it
loads the workspace rules first, then the board's own short rules file on top. The
workspace's `.gitignore` excludes the inner folders, so each repo stays independent.

## What's in a board folder

- **Documents:** requirements, design notes (decisions, calculations, deviations), a
  sources list (every datasheet with its URL, revision and date), status, errata and a
  bring-up log.
- **Source material:** datasheets and reference designs.
- **The KiCad project,** plus folders for each fab revision, each Quilter run, and
  `current` (the latest renders and schematic PDF).
- Each ordered revision gets a git tag: `rev-A`, `rev-B`, and so on.

## Push on every commit

The installer and the launcher's New board button both install a git hook that pushes
in the background after every commit. The stated goal: **"the desktop is disposable".**
After a dead PC, you run the installer and clone the boards, and that's all.

## What lives on Google Drive instead

- **The PDF library:** free vendor app notes and datasheets, and your scanned books.
  Datasheets can be downloaded again. Scanned books are private and must never be pushed anywhere.
- **End-of-day read-only snapshots** of each board touched, for reading on a phone or
  loading into a claude.ai Project. The git repos stay the source of truth.

A small settings file written by the installer records where the workspace, the PDF
library and Drive are, so the launcher, skills and guard hook all agree.
