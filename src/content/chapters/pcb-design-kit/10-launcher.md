---
project: pcb-design-kit
title: "The launcher window"
order: 10
date: 2026-11-13
summary: "One desktop window for the whole station: projects and their parts, buttons to open each in Claude Code or KiCad, the kit and library sessions, the work queue's issue and session tabs, a status bar with the plan limit, and updates that install themselves."
status: published
---

A desktop shortcut called **PCB Design** opens one window. It started as a list of boards
with a few buttons. It is now where every Claude Code session on the PC starts, gets
watched and gets closed, and where the kit keeps itself up to date.

## What's in the window

| Area | What it holds |
|---|---|
| Top bar | **Open PCB Kit in Claude Code**, **Open Library & lessons in Claude Code**, **Library** (wanted books and the book pipeline), **Video** (recordings, shot list), **Site** (open the live site, or open the site's code in Claude Code), and on the right **Update kit** and **?** for help |
| Middle | Two stacked lists: **Projects** on top, and the selected project's **Parts** (boards and mechanical parts) below, with kind, last update, pictures and phase |
| Side column | Buttons for the selected part: Open in Claude Code, Open in KiCad, Open in GitHub, Open folder, Design pictures, Move into project. Under a rule at the bottom, **Wrap up everything** |
| Bottom tabs | **Issues** and **Pull requests** across the kit and every board and project repo, plus one tab per running Claude Code session (the work queue, its own chapter) |
| Status bar | The Claude plan's weekly limit, how much is used and when it resets |

Every button has a tooltip, and the lists refresh themselves.

## Projects and parts

A **project** is one product, such as the in-wall speaker, with its shared requirements
and interfaces in its own repo. Its **parts** are the boards and mechanical parts inside
it. Loose boards from before projects existed sit under **(no project)**.

- **New project...** creates the folder, the shared requirements and interface files,
  a private repo, and starts Claude on the project's own GATE 1.
- **New board...** and **New mechanical...** work only with a project selected. They make
  the part inside the project's repo, refuse a name already used anywhere in the
  workspace, take an optional design spec (a file or a Claude Doc link), and start Claude
  in the part folder at its GATE 1.
- **Move into project...** brings a loose board into a project with its whole git history.
  It checks first that nothing is uncommitted, unpushed, open in another program or
  touched in the last two minutes, renames the revision tags, copies the recordings, moves
  the old folder to an archive (nothing is deleted) and only then archives the old GitHub
  repo, read-only. If a later step fails it stops and lists what is left.

The window opens on the project you picked last.

## Starting a session

Double-click a part, or press Open in Claude Code, and the launcher:

1. **Starts OBS first** if recording is on, minimized, and waits for its WebSocket port.
   The OBS connector only connects if OBS is already running when Claude Code starts.
2. **Starts Chrome first** if Chrome is on, and waits up to 15 seconds, so the browser
   tools are there from the first message.
3. **Continues or starts fresh.** It continues that folder's last conversation, unless a
   wrap-up ran since, or the conversation is from before today (the day turns at 6 a.m.).
   A new day is a new session even if nobody said "done for the day". Hold **Shift** for a
   fresh session anyway. The session banner says which it picked and why.

The wrap-up markers name the conversation that wrapped up, so that conversation counts as
closed even though its last reply lands after the marker. The kit and the site have their
own markers.

## The kit and site sessions

Changing the kit used to happen inside board sessions, which mixed tool work into that
board's recording and wrap-up. **Open PCB Kit in Claude Code** now opens Claude Code in the
kit's own working copy, with its own rules: every change is a branch and a pull request,
the installed copies are never edited, tests run before the PR, and its end of day is just
"push and list the open PRs". **Site > Open Site in Claude Code** does the same for this
website's layout and pages. **Open Library & lessons** is the third side window, for books
and lessons. Any of them can pass a short note to the board window you're working in.

## Updates install themselves

The window asks GitHub whether the kit has changed when it opens and each time you switch
back to it. The **Update kit** button then reads `Up to date`, `Install update (n)` or
`Couldn't check - retry`.

You rarely need to press it. A scheduled task checks every five minutes, with or without
the launcher open, and when an update is waiting it **drains** the work queue first: nothing
new starts, running sessions finish their step and are stopped, the installer runs hidden,
and then every stopped session is resumed. The drain has a 30-minute timeout for a working
session, and gives up cleanly at 60 minutes with nothing installed. OBS running holds off an
automatic update; a click goes ahead regardless. The same version isn't tried twice within
an hour, so a failed update can't loop. While it runs the button says **Waiting to update**
and the status line names what it's waiting for.

The installer's output shows in a panel under the Parts list. When it ends cleanly the
window restarts itself; if a step failed, the output stays up.

## The status bar

Along the bottom: **Claude plan: weekly 42% - resets Sat 12:00 (in 4 d 3 h)**. That's the
plan allowance, not API credits. Claude Code's own status line saves the numbers after each
reply, and the bar adds "(as of ...)" when they are over ten minutes old. In Claude Code
itself, the status line shows both limits the same way, shortest window first:
`5-hour: 42%, resets in 2h 10m | Week: 90%, resets in 3d 4h`.

## What went wrong along the way

- **Update said OK when it wasn't.** A `git pull` failed when the launcher's own update
  check fetched at the same moment, and the installer carried on with the old code. Update
  now fast-forwards to GitHub's `main`, checks it, retries three times, and otherwise stops
  with **Update FAILED** and installs nothing.
- **A timer was the wrong trigger.** The update check went from every ten minutes, to every
  minute, to "when you switch back to the window". A merged PR shows up when you look,
  without a timer firing behind your back.
- **Wrap up everything didn't close the kit's conversation.** After a full wrap-up, Open PCB
  Kit continued a two-day, 29 MB conversation. Wrap up everything now writes the kit and site
  markers too.
- **Updating under live sessions.** An open session keeps the rules it read at its start,
  while an update replaces the hooks at once. That mismatch is why updates now drain the
  queue first instead of just running the installer.

## What's next

More items for the status bar, one entry each, reading local files only so the bar never
holds the window up.
