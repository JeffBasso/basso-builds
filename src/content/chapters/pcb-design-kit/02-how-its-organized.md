---
project: pcb-design-kit
title: "How it's organized: nested folders, separate repos"
order: 2
date: 2026-11-13
summary: "The kit, the workspace and each project are separate git repos whose folders nest on disk, so Claude loads the right rules wherever it starts. A project holds its boards and mechanical parts in one repo. Datasheets and books live on Google Drive instead, on purpose, and Drive also carries a read-only copy of the repos for voice calls."
status: published
---

## Nested folders, separate repos

| Layer | What it holds |
|---|---|
| **The kit** | The tooling: installer, rulebook, skills, hooks, launcher, nightly and queue scripts, tests. It's installed into the workspace's `tools` folder and **never edited there.** Kit changes are made in a separate working clone, one branch and pull request each, and "Update kit" brings the installed copy up to `main`. |
| **The workspace** | Home base: the rulebook (copied from the kit), a lessons file that belongs to you, reference notes and datasheet cards, status files, logs and settings. |
| **Projects** | One private repo per build (`pcb-project-<name>`). A project holds its boards under `boards/` and its mechanical parts (enclosure, sled, bracket) under `mechanical/`, plus a shared requirements file and an `INTERFACES.md`. |
| **Loose boards** | Boards from before projects existed, each in its own repo under the workspace's `boards` folder. They keep working, and the launcher's Move into project brings one into a project with its whole history. |
| **Archive** | Old repos of parts that were moved into a project. Nothing is deleted; it's never treated as work. |
| **Blocks** | A clone of the public [pcb-blocks](https://github.com/JeffBasso/pcb-blocks) library, read-only here, pulled by Update kit. |
| **The site** | The public build-log site, cloned next to the workspace. It's the one repo with no push-on-commit hook: nothing reaches it without a merged pull request. |

**Why nest the folders but not the repos?** Claude Code reads every `CLAUDE.md` from
the folder it starts in up to the root. Start a session in a board's folder and it
loads the workspace rulebook first, then the project's rules file if it has one,
then the board's own short rules file on top; the most specific one wins for that
board. The workspace's `.gitignore` excludes the inner folders, so each repo stays
independent.

## Projects and INTERFACES.md

Projects came after the first board, when the speaker work needed a box, a sled and
an amp board that all had to agree. `INTERFACES.md` holds every number more than one
part depends on: outline, mounting holes, height limits, connectors, keep-outs, the
heat path. Each row names the part that owns it and the parts that use it. A change
goes there first, then into every user in the same commit. A new project starts at
a project-level GATE 1 (shared requirements and interfaces), then each part runs
its own gates, and the reviews at GATE 3 and GATE 5 check the part against every
row it uses. Part names are unique across the whole workspace, so hooks and scripts
can find a part by name.

## What's in a board folder

- **Documents:** requirements, design notes (decisions, calculations, deviations), a
  sources list (every datasheet with its URL, revision and date), status, errata and a
  bring-up log. An optional `docs/spec.md` holds a design spec given when the board
  was created.
- **Source material:** datasheets and reference designs.
- **The KiCad project,** plus folders for each fab revision, each Quilter run, and
  `current` (the latest renders and schematic PDF). A code-first board adds a `src`
  folder with its SKiDL Python.
- Each ordered revision gets a git tag: `rev-A`, `rev-B`, and so on. Inside a
  project the tag carries the part name (`amp/rev-A`), because parts revise on their
  own schedules.

A mechanical part has the same documents without the KiCad and fab folders.

## Branches and worktrees

Board and project folders stay on `main`. Each gate is worked on its own branch in a
git worktree inside the repo's hidden `.claude` folder, so a background session can
work on a gate while you open the board normally. Kit and board issues from the work
queue get worktrees the same way. The queue and gates have their own chapters.

## Push on every commit

The installer, Update kit and the launcher's New project button all install a git
hook that pushes in the background after every commit. The stated goal: **"the
desktop is disposable".** After a dead PC, you run the installer and clone the
projects, and that's all.

## What lives on Google Drive instead

- **The PDF library:** free vendor app notes and datasheets, and your scanned books.
  Datasheets can be downloaded again. Scanned books are private and must never be
  pushed anywhere. Page-cited rule sheets made from the books, and the datasheet
  cards, live in the workspace repo; the PDFs don't.
- **End-of-day read-only snapshots** of each board touched, for reading on a phone or
  loading into a claude.ai Project. The git repos stay the source of truth.
- **A live copy of the repos for voice calls.** On a voice call Claude can read
  Google Drive but not file contents on GitHub. A scheduled task checks every 5
  minutes whether any repo's `main` has moved and, if so, copies the changed text
  files into a `dev` folder in Drive, laid out like the folders on disk. Code files
  get `.txt` added so Drive can open them as text; binaries, PDFs and board files are
  left out. It's a plain copy with no git in Drive, and it doesn't replace the
  end-of-day snapshots.

A small settings file written by the installer records where the workspace, the kit
clone, the site, the PDF library and Drive are, so the launcher, skills and hooks
all agree.
