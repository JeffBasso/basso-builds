---
project: pcb-design-kit
title: "Guardrails: what's enforced and what's a rule"
order: 6
date: 2026-10-24
summary: "A guard hook allows only two websites, only lets board files be uploaded, and blocks edits to the kit and the books. Permission rules make every upload ask, and deny streaming outright."
status: published
---

Rules in the rules file are instructions. A separate set is **enforced** by Claude
Code itself, so it doesn't depend on Claude remembering. What a hook can't see stays a
written rule.

## The guard hook

A PreToolUse hook runs before every browser action and every file edit. It acts only
inside the PCB workspace; everywhere else it stays out of the way.

- **Websites:** only **pcbway.com and quilter.ai** and their subdomains. It rejects
  look-alikes such as `pcbway.com.evil.io`, and `javascript:`, `data:` and `file:` URLs.
- **Batches:** it walks the whole request, so a navigation hidden in a batch of browser
  actions is caught too.
- **Uploads:** only files under `boards` can be uploaded. The PDF library, the books,
  the reference notes and the kit are all blocked.
- **Edits:** blocked in the kit's folder and in the scanned books. Relative paths and Git
  Bash-style paths are normalized first, so they can't slip past.
- **On a block,** Claude sees the reason, and the rules tell it not to work around it,
  but to tell you.

## Permission rules

- **Every file upload in Chrome asks for approval,** on top of the hook's folder check.
- **Allowed without asking:** OBS recording, scene switches and chapter markers, and
  aiming the camera.
- **Denied outright:** streaming, virtual camera, replay buffer, stream-service
  settings and the camera's own recording. In Claude Code, deny beats allow, so a broad
  allow added later can't undo it.

## Unattended runs

Nightly runs use an explicit list of allowed tools: reading, writing, and a short list
of shell commands (git, kicad-cli, copying, listing). Everything else is refused, so a
nightly run can't browse, order anything or touch the kit. OBS and the camera are
blocked on the command line too.

## What stays a written rule

Never click pay or place-order. Stop at a login, 2FA or CAPTCHA. One approval covers one
submission. Don't accept PCBWay's part substitutions. Pause recording before anything
secret. Never invent values. Discuss mains safety first.

## Tested

19 guard cases run in CI on Windows, and CI also runs the hook command as it's actually
registered, against an off-list website, and requires it to block.
