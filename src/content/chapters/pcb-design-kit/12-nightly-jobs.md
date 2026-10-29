---
project: pcb-design-kit
title: "Nightly jobs: the wrap-up and book indexing"
order: 12
date: 2026-10-25
summary: "A self-hosted GitHub runner on the desktop wraps up the day if you forgot, and reads a few chapters of a book each night. Both wait for a live session to finish and stay inside your plan's limits."
status: published
---

## Why a GitHub runner

The first version used a Windows scheduled task. The same day it moved to a
**self-hosted GitHub Actions runner** on the desktop, so jobs can be triggered, re-run
and read from GitHub. It runs as you, not as a service, so it has your Claude login,
Drive and git credentials. It must never be attached to a public repo.

## The nightly wrap-up

- Runs around midnight Central. Before 6 a.m. it wraps up the previous day, because
  GitHub's schedule is in UTC.
- **Skips** if you already said "done for the day", or if nothing was touched.
- **Waits** while Claude Code is running, up to two hours, so it never commits in the
  middle of a live session.
- Then runs the wrap-up skill unattended. It never asks questions. Half-done work is
  committed as "Nightly auto wrap-up", and decisions are listed under "Waiting on you".
  It never opens a browser or touches OBS.

## Nightly book indexing

- **Off by default,** turned on from the launcher.
- New PDFs dropped into the Drive books folder, from any device, are queued. Duplicates
  are caught by hash, files still syncing are left alone, and likely image-only scans are
  flagged.
- Each night it reads a chunk of pages (60 by default), finishing the current chapter if
  that's close, extends the notes, commits, and stops. The next night resumes there.
- **Pinned to Sonnet.** Without a model set, it inherited the desktop default, which made
  costs unpredictable. Indexing is bulk extraction, not reasoning.

## Usage limits

Nightly runs draw on the plan's normal session and weekly limits. A chunk at 2 a.m.
uses a session window that would otherwise sit idle, and the pages-per-chunk setting
caps how much of the weekly allowance it takes.

## New: the build log

The wrap-up now has one more step: it drafts chapters for this site from the day's work
and opens a pull request. Nothing is published until that PR is reviewed and merged.
