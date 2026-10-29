---
project: pcb-design-kit
title: "The phone dashboard"
order: 11
date: 2026-10-29
summary: "A live page that shows the job in flight, what needs you, and a card per board with its gates, health, risks and renders. It updates within seconds of Claude writing to it."
status: published
---

The dashboard is a live Claude artifact backed by its own small database. When Claude
writes to it, the page on your phone updates within seconds.

## What's on it

- **Right now:** one card per job in flight (a Quilter run, a DRC, a quote, book
  indexing) and a feed, newest first. **The card turns amber if a check-in is late,** so
  a job that's gone quiet looks stale instead of looking fine.
- **Needs you:** Quilter candidates to pick, a quote waiting at checkout, open pull
  requests, books that need a re-scan.
- **Board cards:** phase, layout path, part count and layers; a G1-G8 timeline; health
  (ERC and DRC errors, unrouted connections); risks; key numbers such as the power budget
  against its limit and the hottest junction; the latest renders; and dated decisions.

## How it updates

Small writes during the day, at gate passes, job starts and 30-minute check-ins, plus a
full refresh at every wrap-up. Every value comes from the status file, the design notes
or a check run just then, never invented.

## The pull-request lesson

The first four kit pull requests were open for 20 minutes, almost 9 hours, **1 minute**
and 38 minutes. An hourly check would have caught one of the four. So a pull request is
written to the page **in the same turn it's opened,** and the list is reconciled before
every write. Measured on one PR: merged, session woken 3 seconds later, row gone 14
seconds after the merge.

One more rule: the list is only cleared when a read succeeds and shows nothing open. A
stale row is better than wrongly telling you nothing needs you.
