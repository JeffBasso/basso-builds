---
project: pcb-design-kit
title: "Testing, and what the real machine taught us"
order: 15
date: 2026-10-29
summary: "Every change runs the installer, launcher and guard tests on Windows PowerShell 5.1. Most real fixes came right after first contact with the real desktop."
status: published
---

## CI

Every push and pull request runs on Windows, under **Windows PowerShell 5.1,** which is
what the installer, launcher and hook actually run on:

1. Lint with PSScriptAnalyzer.
2. Pester tests: guard, installer, launcher, nightly jobs, book indexing, GitHub helpers.
3. The installer in check-only mode, on real Windows.
4. The installer's update mode into a sandbox, then checks that the rules, launcher and
   nightly scripts exist, that the guard hook is registered exactly once, and that **the
   registered hook actually blocks** an off-list website.
5. A check that the reference PDF links still download.
6. The whole report posted as a comment on a GitHub issue, so it can be read from a phone.

## What first contact taught

The fixes cluster right after the kit met the real machine:

- **PowerShell 5.1 versus 7.** The guard hook read nothing from stdin under 5.1, which
  delivers piped input differently. `"$name:"` parses as a scope prefix. `.Count` on a
  single object is null.
- **stderr treated as fatal.** `gh` reports "not logged in" on stderr, and a strict
  error setting killed the first real install. The same bug turned up in two more places.
- **Microsoft Store app paths.** The Claude desktop app was the Store version, so it's
  detected and started differently.
- **Dead downloads and version jumps.** Freerouting's old download was gone, and the new
  version needed Java 25.
- **Test side effects.** A test re-pointed the real desktop shortcut at a temp folder.
- **One-way flags.** A re-scanned book stayed on "needs you" forever.
- **How people really behave.** Pull requests merged within a minute.

Each fix landed with a test or a CI check where one was possible. Pester is pinned at
5.7.1, because version 6's test cleanup fails on git's read-only files.
