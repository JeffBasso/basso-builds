---
project: pcb-design-kit
title: "The phone dashboard"
order: 11
date: 2026-11-13
summary: "A live page that shows the job in flight, what needs you, a feed of what the PC did on its own, and a card per board with its gates, health, risks and renders. Interactive sessions write to it directly; unattended runs reach it through a file on Google Drive."
status: published
---

The dashboard is a live Claude artifact backed by its own small database. When Claude
writes to it, the page on your phone updates within seconds. It's the place to look when
you're away from the desk: what's running, what's waiting on you, and what the PC did by
itself overnight.

## What's on it

- **Right now:** one card per job in flight (a Quilter run, a DRC, a PCBWay quote, a
  video episode waiting for review) and a feed, newest first. **The card turns amber if a
  check-in is late,** so a job that's gone quiet looks stale instead of looking fine.
- **Needs you:** Quilter candidates to pick, a quote waiting at checkout, an episode to
  approve, open pull requests in the kit and the board repos, books that need a re-scan.
  A job only lands here when Claude marks it as needing you; the page doesn't guess from
  status words.
- **Board cards:** one per part, a board or a mechanical part, with its project. Phase,
  layout path, part count and layers; a G1-G8 timeline; health (ERC and DRC errors,
  unrouted connections); risks; key numbers such as the power budget against its limit and
  the hottest junction; the latest renders; and dated decisions.

## How it updates

| Who writes | When | How |
|---|---|---|
| An interactive Claude Code session | Gate passes, job starts and ends, 30-minute check-ins, opening a PR, the wrap-up | Directly into the page's database |
| The nightly wrap-up and Wrap up everything | At the end of the run | A file on Google Drive that the page reads |
| The work queue's watch | Kit updates, the usage hold, leftover sessions it ended | A feed line in the same Drive file |

Every value comes from the status file, the design notes or a check run just then, never
invented.

**Unattended runs can't write to the page.** Claude Code in print mode, which is what the
nightly jobs use, has no tool for the artifact's database. So those runs write their update
to a small file in the workspace, and the nightly script copies it to Google Drive. The page
reads that file through the Google Drive connector when it opens, when you come back to it
and every ten minutes, and shows it when it's newer than the page's own last write, with a
line under the title saying so. The file is base64, because the connector returns a
Markdown-escaped copy of anything else. The first time, the page asks for permission to use
Google Drive.

**The feed now carries what the PC did on its own.** When the kit updates itself, you get
one line such as "Kit updated at 00:41. Drain took 12 min; 2 sessions resumed", or a line
saying it failed and needs you at the desk. When the queue holds new sessions because the
plan is near its limit, there's a line when the hold starts, when the limit holding it
changes, and when it ends, with the usage and the reset time. When the watch ends leftover
processes, it says how many and whose.

## The pull-request lesson

The first four kit pull requests were open for 20 minutes, almost 9 hours, **1 minute**
and 38 minutes. An hourly check would have caught one of the four. So a pull request is
written to the page **in the same turn it's opened,** and the list is reconciled before
every write. Measured on one PR: merged, session woken 3 seconds later, row gone 14
seconds after the merge. An hourly check stays as a backstop for merges when no session is
alive.

Two more rules came out of it. The list is only cleared when a read succeeds and shows
nothing open: a stale row is better than wrongly telling you nothing needs you. And each
row carries the time it was last confirmed; the page dims a row that hasn't been confirmed
for 90 minutes and says when it was last checked, so an honest timestamp matters more than a
recent one.

## What went wrong along the way

- **Overnight runs left the page stale.** The first nightly wrap-ups did their work and
  skipped the dashboard, because print mode has no database tool. The night's work didn't
  reach the phone until the next interactive session wrote to the page. The Drive file
  closed that gap.
- **Cloud sessions can't read PR status the same way.** The desktop's one-line GitHub query
  goes through an API that cloud sessions are blocked from, so the skill keeps a second,
  REST-based recipe for them.

## What's next

Grouping the board cards under their project headings. The cards already carry the project;
the page just doesn't group them yet.
