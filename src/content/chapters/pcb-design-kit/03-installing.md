---
project: pcb-design-kit
title: "Installing it: one file, every tool"
order: 3
date: 2026-11-13
summary: "Download one PowerShell script and run it. It installs the toolchain (Git, Node, Python, Java, KiCad, Claude Code, PowerShell 7, OBS, CadQuery, SKiDL, the video and book tools), wires up GitHub (repos, runners, queue labels), asks before each change, and ends on a colored summary table. Updates then install themselves."
status: published
---

You download one file, `Install-PCB-Design.ps1`, and run it. It clones the kit itself,
asks before every change (or not, with `-Yes`), and is safe to re-run: finished steps
are detected and skipped, and pinned tools are reinstalled only when the kit's pinned
version changes.

It writes a full transcript to your Downloads folder, because that's a folder the Claude
chat can read. **Claude can watch the install as it runs** and tell you what went wrong.

## The steps

| Step | What happens |
|---|---|
| **Preflight** | Windows version, PowerShell, winget, a warning under 10 GB free, and a check that GitHub is reachable. |
| **Prerequisites** | Through winget, each with a minimum version: Git, Node.js LTS, Python 3.12, a Java 25 runtime (Freerouting 2.5.0 needs it) and the GitHub CLI. |
| **KiCad 10** | Then a check that KiCad's bundled Python can import `pcbnew`. |
| **Claude Code** | Installed, or updated if it's too old for voice dictation. |
| **PowerShell 7** | Claude Code's PowerShell tool needs it. |
| **Keep this PC reachable** | Claude can't reach a sleeping PC, so this starts the Claude desktop app at sign-in, offers to turn off sleep on AC power, and can set automatic sign-in with a screen lock right after. You type the password into Microsoft's Autologon tool yourself; it never passes through the script. |
| **The kit** | Cloned into the workspace's `tools` folder. |
| **Workspace** | Folders, the rulebook, the launcher and its desktop shortcut, skills, hooks, the status line and permission rules, and a Chrome policy so PDFs download instead of opening in a tab. |
| **GitHub** | Sign-in, a git identity from your account's no-reply address so no real email ends up in commits, private remotes and push hooks for the workspace and every project and board, and a clone of the public site repo. |
| **Runners and the queue** | Three self-hosted GitHub Actions runners, each asked separately: one for the nightly wrap-up and the kit's tests, one only for the book pipeline, and one for the work queue. Then the queue's two labels, the pinned voice-inbox issue, a scheduled task that watches the queue every 5 minutes, and a scheduled task for the Drive mirror. Board and project repos are offered a queue runner each, because on a personal GitHub account a runner serves one repo. |
| **KiCad MCP server** | Built and self-tested. |
| **Freerouting** | With retries, rejecting any download under 1 MB. |
| **Pester 5.7.1** | So the kit's own tests run on your machine. |
| **OBS Studio and obs-mcp** | WebSocket server on with a generated password, OBS's own update check turned off, and a question whether sessions should be recorded at all. |
| **OBSBOT camera tools** | Only if a camera is plugged in. |
| **CadQuery** | With a clear message if Windows 11 Smart App Control blocks its DLLs. |
| **Video tools** | FFmpeg, Tesseract, a Python environment and a Whisper speech model, for the gate episodes and their privacy scan. |
| **Book pipeline** | A Python environment for OCR and indexing books on the Claude API. |
| **Onshape MCP server** | CAD for mechanical parts. |
| **SKiDL** | A pinned Python environment for code-first boards, pointed at KiCad 10's symbol and footprint libraries, and checked by loading a real resistor symbol. |
| **pcb-blocks** | Clones the public blocks library and registers its design blocks, symbols and footprints in KiCad's global library tables. |
| **Register with Claude Code** | The KiCad server, checked that it shows as Connected, and a second, read-only KiCad server as a reviewer. |
| **Reference PDFs** | About 35 free PDFs from ADI, TI, Espressif and others, each checked to really be a PDF, plus a "download these by hand" table for sites that block scripts. |

## The summary

It ends with a colored table (OK, INSTALLED, WARN, SKIPPED, MISSING, FAIL) and numbered
next steps. One of them is something no script can do: you grant Claude access to the
workspace folder yourself.

## Updates

**Update kit** runs the same installer with `-Update`. It first brings the installed
kit up to GitHub's `main`, checks that it got there, and tries up to three times. If it
can't, it says **Update FAILED** with the reason and installs nothing. We added that
after an update quietly carried on with the old code and reported success. Then it
**re-launches the freshly pulled installer**, so an update always runs the newest code,
and re-applies everything above. Each run writes its own log and exit code, so one
run's leftovers can't make the next look successful.

Updates also go in by themselves. The queue watch task notices when the kit's `main`
has moved and drains the queue first, because an open session keeps the rules it
started with while an update replaces the hooks at once. No new background sessions
start; the running ones finish their current step and stop; queue jobs, book runs and
the nightly wrap-up are waited for. Your own Claude Code windows count only while
they're mid-turn; one you left open after it finished doesn't hold anything. After 30
minutes the kit updates around whatever is still working. Then it installs and resumes
the stopped sessions in the same conversations. OBS running holds off an automatic update, so a recording is never cut. The
launcher checks GitHub when it opens and when you switch back to it, and offers the
same thing as one click.

## Safety

- **Backups before overwriting:** the rulebook, Claude's settings and the OBS config.
- **Never overwrites what's yours:** the lessons file is created once, and the book
  wishlist only ever gains new titles.
- **Settings are merged, not replaced.** Other hooks, permissions and a status line you
  already have survive. Settings you've changed yourself, such as voice dictation, stay
  your choice across updates.
- **Workflow files go only where they should.** The queue workflow is committed to a
  board repo's `main` from a temporary worktree, so a clone that's on a gate branch with
  work in progress isn't touched.
- **Modes:** `-CheckOnly` reports and changes nothing; `-Yes` answers every question.
