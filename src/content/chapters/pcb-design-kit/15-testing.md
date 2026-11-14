---
project: pcb-design-kit
title: "Testing, and what the real machine taught us"
order: 15
date: 2026-11-13
summary: "Every pull request and every merge runs the whole kit test suite in a throwaway Windows Sandbox on the desktop, under Windows PowerShell 5.1. Most real fixes came right after first contact with the real desktop."
status: published
---

## Where the tests run

The tests used to run on GitHub's own Windows machines. Each run took about 25 minutes,
and on a private repo Windows minutes count double, so the bill climbed fast. Now they run
on the desktop itself, inside **Windows Sandbox**: a fresh, hidden, throwaway copy of
Windows for each run, started by the PC's self-hosted GitHub runner. They use no GitHub
minutes. GitHub's machine still runs the same checks, but only when started by hand.

What starts a run:

- every pull request, and `main` after each merge. A plain branch push doesn't, because
  it would only repeat its PR's run;
- a newer push to the same PR, or a newer merge, cancels the older run;
- merging or closing a PR cancels its run, so a run that no longer matters doesn't hold
  the one desktop runner.

## What a run does

Everything runs under **Windows PowerShell 5.1,** which is what the installer, launcher
and hooks actually run on:

| Step | What it checks |
|---|---|
| Book pipeline | Python tests with a fake API client, so no real calls and no spend |
| Lint | PSScriptAnalyzer, errors only |
| Pester | Every test file: guard and shell hooks, installer, launcher, nightly jobs, book panel, work queue and gates, SKiDL parity, board size, video, GitHub helpers |
| Installer, check-only | The installer's report mode on a clean Windows |
| Installer, update | A real update into the sandbox: rules, skills, hooks, launcher and the video environment |
| Video end to end | The episode chain on a short made-up recording, with the real FFmpeg, OCR and Python environment |
| Reference links | The free PDF links still download. A shortfall is a warning, not a failure |

The sandbox starts with nothing installed. A cache on the PC holds Python, Git, FFmpeg,
Tesseract, Pester and the rest, each checked for a newer version before a run and kept as
is if the check fails. Each Pester file runs in its own PowerShell process, three at a
time, with a 10-minute limit. The run always shuts the sandbox down, and the summary is
posted as a comment on a GitHub issue, so it can be read from a phone.

## Before a pull request

Every kit change is its own branch and pull request, and the full suite takes over ten
minutes. So before opening one, Claude runs the Pester files that cover what changed,
parse-checks every changed PowerShell script, and puts the results in the PR description.
The sandbox run then checks everything.

The installed kit updates itself after a merge: a watch checks every five minutes, lets
the running Claude Code sessions reach a stopping point, installs, and resumes them. It
doesn't wait for the tests. The same merge also starts a test run on the desktop, and
waiting for it held the first automatic update for half an hour.

## What first contact taught

The fixes cluster right after the kit met the real machine:

- **PowerShell 5.1 versus 7.** The guard hook read nothing from stdin under 5.1, which
  delivers piped input differently. `"$name:"` parses as a scope prefix. `.Count` on a
  single object is null.
- **5.1 started from somewhere else.** Started from PowerShell 7 or from Bash, 5.1
  inherits the wrong module path, and `Get-FileHash` and a few other built-in commands
  simply don't exist. The installer now hashes with .NET, and a test fails if any kit
  script calls a command that can go missing.
- **stderr treated as fatal.** `gh` reports "not logged in" on stderr, and a strict
  error setting killed the first real install. The same bug turned up in two more places.
- **Microsoft Store app paths.** The Claude desktop app was the Store version, so it's
  detected and started differently.
- **Dead downloads and version jumps.** Freerouting's old download was gone, and the new
  version needed Java 25.
- **Test side effects.** A test re-pointed the real desktop shortcut at a temp folder.
- **Tests that only passed at home.** A test set a variable in its own scope that the
  code under test never saw. It passed on the desktop, where the real Google Drive folder
  exists, and failed everywhere else.
- **The sandbox fights back.** Smart App Control is on inside Windows Sandbox even when
  it's off on the PC, and some minutes it blocked unsigned tools like Git and FFmpeg. The
  sandbox is thrown away after each run, so the run switches it off inside. All the Pester
  files in one process sometimes died silently, which is why each file now gets its own.
- **One-way flags.** A re-scanned book stayed on "needs you" forever.
- **How people really behave.** Pull requests merged within a minute, and queued test
  runs for already-merged PRs kept the runner busy for hours.

Each fix landed with a test or a CI check where one was possible. Pester is pinned at
5.7.1, because version 6's test cleanup fails on git's read-only files.
