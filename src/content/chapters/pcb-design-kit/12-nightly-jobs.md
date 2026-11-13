---
project: pcb-design-kit
title: "Nightly jobs and the runners"
order: 12
date: 2026-11-13
summary: "Self-hosted GitHub runners on the desktop: a nightly wrap-up that never waits on an open window, a Wrap up everything button that audits every part, gate episodes rendered under their own time limit, and separate runners for the book pipeline and the work queue."
status: published
---

Saying "done for the day" in a board window is the normal wrap-up. The nightly jobs are
the safety net for days that didn't get one, and the place where slow work, such as
rendering video, happens while nobody is using the PC.

## Why a GitHub runner

The first version used a Windows scheduled task. The same day it moved to a
**self-hosted GitHub Actions runner** on the desktop, so jobs can be triggered, re-run
and read from GitHub. It runs as Jeff, not as a service, so it has his Claude login, Drive
and git credentials. It must never be attached to a public repo.

One runner turned out not to be enough. The Windows test suite holds a runner for 40 to 60
minutes on every PR and every merge, and a job queued behind it waited hours. So there are
now three kinds, side by side:

| Runner | Runs | Why separate |
|---|---|---|
| Desktop | The nightly wrap-up and the Windows tests | The original |
| Books | The book pipeline only | A book run queued behind the tests waited hours |
| Queue | The work queue and the voice inbox, one per repo | Each job takes seconds and must never wait |

A personal GitHub account can only attach a runner to one repo, so every board and project
repo gets its own queue runner, installed by Update kit after asking once.

Every runner starts at sign-in through a headless console. The old hidden-window start still
flashed a console and stole focus, which mattered once queue jobs started firing every few
minutes.

## The nightly wrap-up

- **Three tries a night,** a couple of hours apart, from late evening to early morning.
  GitHub often starts scheduled runs late, which doesn't matter.
- **Never waits.** If a Claude Code window is open, the try logs "skipped" and ends, so the
  runner is free for the tests. The next try, or the launcher, picks the day up. It used to
  wait up to two hours, which held the only runner hostage.
- **Looks for real work** since the last wrap-up: commits, or uncommitted files changed after
  it. The PC's own housekeeping isn't work: the book pipeline's commits and Update kit's commit
  of the rules it installs. Counting those started a wrap-up almost every night for nothing.
- **Wraps up the day the work belongs to.** Before 6 a.m. counts as the day before.
- Runs the wrap-up skill in **print mode, on Sonnet,** allowed only the tools it needs. It
  never asks questions, never opens a browser and never touches OBS. Half-done work is
  committed, and decisions go under "Waiting on you".
- **Stops cleanly at the plan limit.** When Claude Code says the 5-hour limit is hit, the
  run starts no more Claude calls, writes no wrap-up marker (so the day still counts as not
  done) and says the limit was the reason. The next try after the reset finishes it.
- **Then builds new video episodes,** whether or not a wrap-up was due, if no window is open.

Unattended runs can't write to Google Drive or to the phone dashboard. So the script copies
the Drive snapshots itself once Claude is done, and puts the dashboard update in a Drive file
the page reads (the dashboard chapter).

## Missed days and Wrap up everything

If every try was skipped because a window stayed open, the launcher shows a yellow strip:
"Sat Oct 31 wasn't wrapped up (wallnode-amp, workspace)." **Wrap up now** wraps it up;
**Not needed** marks the day done.

**Wrap up everything** is the same thing for every project and part at once, with windows
open or not:

1. **Audit,** with plain git and file reads and no Claude: uncommitted files, unpushed
   commits, a status file that is missing a header line or older than the part's last change,
   a Drive snapshot that doesn't match, board exports older than the KiCad files, a board open
   in KiCad.
2. **Claude once per repo that needs it,** told exactly what the audit found, then one finish
   run for the workspace, the dashboard and the build log. A clean part costs nothing; with
   everything clean Claude doesn't run at all.
3. **Audit again.** That decides the result, not Claude's exit code. It writes a table of every
   part, and the wrap-up markers for the workspace, the kit and the site, so the next Open PCB
   Kit and Open Site start fresh conversations too.

It ends with one line, `All 7 clean.` or `5 of 7 clean, 2 need you`. One wrap-up runs at a time.

## Video episodes

Every gate passed becomes one episode, rendered on this PC from the footage since the
previous gate: cuts, captions, loudness, chapters, a thumbnail and an OCR privacy scan.
Nothing is uploaded at night.

The video step has **its own time limit,** 75 minutes by default, inside the job's two hours.
Past it the render is stopped and the next night carries on. An episode with more than four
hours of footage isn't rendered at all until someone looks at its edit lists.

## Books: no longer nightly

The first version read about 60 pages of a book every night with Claude Code. That is gone.
Books now go through a separate pipeline on the Claude API, on the books runner, and it runs
only when Jeff presses **Start run** in the launcher's Library window: no nightly or hourly
runs. One run carries every queued book through all its steps (the reference library chapter).

## What went wrong along the way

- **Waiting for a session blocked everything.** A nightly that waited two hours for a window to
  close held the only runner, so tests and book runs stacked up behind it. Now it never waits.
- **The Claude desktop app looked like a session.** It runs as `claude.exe` too, starts at
  sign-in, and made every try skip until the check matched Claude Code only.
- **A 19-hour recording held the job every night.** Someone left recording on; the video step
  ran first, with no limit of its own, and nothing after it ran. Video now goes last, under its
  own limit and a four-hour footage cap.
- **A wrap-up that hit the plan limit said "need you".** An early-hours Wrap up everything
  reported 0 of 5 clean and wrote the marker anyway, so the day looked done when it wasn't.

## The build log

The wrap-up's last step drafts chapters for this site from the day's work and opens a pull
request. The nightly run may open and view PRs but never merge them, so nothing is published
until that PR is reviewed and merged.
