---
project: pcb-design-kit
title: "Installing it: one file, every tool"
order: 3
date: 2026-10-26
summary: "Download one PowerShell script and run it. It installs Git, Node, Python, Java, KiCad, Claude Code, OBS and CadQuery, asking before each change, and ends on a green, yellow and red summary table."
status: published
---

You download one file, `Install-PCB-Design.ps1`, and run it. It clones the kit itself,
asks before every change (or not, with `-Yes`), and is safe to re-run: finished steps
are detected and skipped.

It writes a full transcript to your Downloads folder, because that's a folder the Claude
chat can read. **Claude can watch the install as it runs** and tell you what went wrong.

## The steps

- **Preflight:** Windows version, PowerShell, winget, at least 10 GB free, and a check
  that GitHub is reachable.
- **Prerequisites through winget,** each with a minimum version: Git, Node.js LTS,
  Python 3.12, a Java runtime (Freerouting 2.5.0 needs Java 25), and the GitHub CLI.
- **KiCad 10,** then a check that KiCad's bundled Python can import `pcbnew`.
- **Claude Code.**
- **Keep this PC reachable.** Claude can't reach a sleeping PC, so this step starts the
  Claude desktop app at sign-in, offers to turn off sleep on AC power, and can set
  automatic sign-in with a screen lock 20 seconds later. You type the password into
  Microsoft's Autologon tool yourself; it never passes through the script.
- **Workspace:** folders, rules, the launcher and its desktop shortcut, skills, guard
  hook and permission rules. Then GitHub sign-in, a git identity from your account's
  no-reply address so no real email ends up in commits, private remotes, push hooks and
  the nightly runner.
- **The KiCad MCP server,** built and self-tested.
- **Freerouting,** with retries, rejecting any download under 1 MB.
- **Pester 5.7.1** so the kit's own tests run on your machine.
- **OBS Studio and obs-mcp,** with the WebSocket server turned on and a generated password.
- **The OBSBOT camera tools,** only if a camera is plugged in.
- **CadQuery,** with a clear message if Windows 11 Smart App Control blocks its DLLs.
- **Register KiCad with Claude Code,** and check that it shows as Connected.
- **About 30 free reference PDFs** from ADI, TI, Espressif and others, each checked to
  really be a PDF, plus a "download these by hand" table for sites that block scripts.

## The summary

It ends with a colored table (OK, INSTALLED, WARN, SKIPPED, MISSING, FAIL) and numbered
next steps. One of them is something no script can do: you grant Claude access to the
workspace folder yourself.

## Safety

- **Backups before overwriting:** the rules file, Claude's settings and the OBS config.
- **Never overwrites what's yours:** the lessons file is created once, and the book
  wishlist only ever gains new titles.
- **Settings are merged, not replaced.** Other hooks and permissions you already have survive.
- **Modes:** `-CheckOnly` reports and changes nothing. `-Update` is the launcher's
  Update kit button: it pulls the kit, then **re-launches the freshly pulled installer**
  so an update always runs the newest code.
