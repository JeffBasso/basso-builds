---
project: pcb-design-kit
title: "The work queue: issues, the phone and voice calls"
order: 17
date: 2026-11-13
summary: "Kit issues, pull requests and board gates run as background Claude Code sessions in their own git worktrees. Work is assigned with a GitHub label or an @claude mention from the phone, questions and specs come back as issue comments, and on a voice call one marked comment runs one GitHub action, merges included."
status: published
---

Until early November every piece of work needed someone at the desk to open a window and
type. Now most of it is a GitHub issue. A label or a mention starts a background Claude
Code session on the desktop; its questions, specs and plans come back as comments on the
issue; and the answers can come from the phone, or from a voice call while driving.

## What it does

| Item | What starts it | What comes back |
|---|---|---|
| A kit issue | **Run** in the launcher, the `claude` label, or `@claude` in a comment | Design questions, then a spec and plan for review if the work is big, then a PR that closes the issue |
| A pull request | **Run**, or `@claude` in a PR comment or review | Answers where you wrote, fixes pushed, PR handed back |
| A board gate (`<part>: GATE n`) | **Run**, or the label | A gate PR with the ERC/DRC results, renders and status handoff |
| A parent issue with sub-issues | The label on the parent | Its children worked one at a time, bottom-up, then a final check |

Two labels say whose turn it is: **claude** means Claude's, **waiting on Jeff** means Jeff's.
The launcher's Issues and Pull requests tabs list every open item across the kit and the
board and project repos, with an Owner column read from those labels.

## How a session runs

Each item gets its own **git worktree** (a second checkout of the repo on its own branch)
and a background `claude --bg` session with a prompt naming the item. One session per item;
at most seven run at once. Every session on the PC, background or interactive, gets a tab
in the launcher with one status word: working, waiting on you, done, idle, failed or stopped.
**Open** attaches a window to a background session, which is also how a session gets filmed.

An issue session works in a fixed order:

1. **Questions first.** It reads the issue and the whole thread, then posts one comment with
   every open question that would change the design, as numbered options with its
   recommendation first. It swaps the label to waiting on Jeff and stops, with no code yet.
   If nothing is open it says what it's assuming and builds. "No questions, just build" skips
   the step.
2. **Spec and plan, for big work.** Architectural or multi-file work goes through a written
   spec and a plan. Each is posted in full as a comment, headed "Spec for review" or "Plan for
   review", and the session stops again. Comments, not files, because Claude on a voice call
   can read comments but not files on GitHub.
3. **Build and open a PR** that says `Closes #n` for the issue and any other issue it fully
   finishes. Small calls made mid-build go in a "Decisions I made" list in the PR.
4. **Hand back.** The PR goes to waiting on Jeff, assigned to him. **Merging is the approval.**
   Sessions never merge.

A reply on the issue resumes the same conversation on the same branch. A reply is never
dropped: if the session is busy, at a permission prompt or out of slots, the reply is held
and a five-minute watch passes it on. A session started after the latest update reads a
reply even mid-turn, at its next tool call.

**Board gates** follow the workspace rules instead of the spec process. Merging a gate PR
records the pass in the part's status file, removes the worktree, opens the next gate's issue
and starts it when a slot is free.

**Sub-issue trees.** Label a parent and its children run one at a time, in GitHub's order;
each merge starts the next. A stuck child pauses the tree with one comment saying why. When
the last child closes, a fresh session checks what's left and closes the parent itself.

## From the phone

Add the `claude` label in the GitHub app, or write `@claude` in a comment on any issue or PR,
and the desktop starts or resumes the work. The launcher doesn't need to be open. GitHub
answers at once with "Queued for the desktop", edited to "Started on the desktop" when the PC
picks it up, or to say why it was held. Every comment Claude posts carries a hidden marker, so
nothing Claude writes ever starts work. Only Jeff's own labels, replies and mentions count.

Sessions post with Jeff's own sign-in, and GitHub never notifies you of your own comments. So
whenever an item goes to waiting on Jeff, a GitHub Actions bot posts a one-line mention with
the question's heading, which is what makes the phone buzz. A permission prompt still needs
the desktop; the issue gets a comment saying so.

## On a voice call

On a voice call in the claude.ai Project, Claude can read issues and post comments, but GitHub
writes that change an issue bring up a form you can't submit while talking. So there's a
pinned **Voice inbox** issue: one comment with a marker on its first line runs one action.

| Command | Does |
|---|---|
| `label add` / `label remove` | Adds or removes a label, which is how voice starts work |
| `close`, `reopen`, `title`, `append`, `replace` | The usual issue edits |
| `parent`, `order` | Builds a sub-issue tree and sets the order its children run in |
| `new`, `new claude` | Files an issue, optionally starting it |
| `merge #n <commit>` | Merges a PR |

Claude says each command aloud and posts it only after a yes. That spoken yes replaces the
form, and it's the check against text Claude reads on the call tricking it into posting a
command. **Merging** gets a read-back of the PR, what it changes, the commit and the check
status; the commit is part of the command, so a push after the yes can't merge. Red checks
need an explicit "anyway". Commands run in the order they were posted, even though the runner
doesn't pick them up in that order.

The rulebook gives the call a routine. "Work issue N" reads the issue, asks its open questions
one or two at a time, reads the answers back and posts them. "What's waiting on me?" walks the
waiting issues one question at a time, then each ready PR with one yes per merge. Sprint
planning takes one yes for a whole ordered plan and posts it as a parent with sub-issues.

Voice can't read files on GitHub, so a scheduled task keeps a plain copy of every repo's
`main` in Google Drive, with `.txt` added to code files so Drive opens them as text.

## Keeping it from eating the plan

Unattended sessions could use up the plan and leave nothing for a call. So the queue starts
nothing new once the 5-hour or the weekly usage reaches 90%. Running work finishes, held work
starts by itself when usage clears, and the launcher's buttons still work as an override.

Finished sessions close themselves: once a session has ended its turn with its PR open and
nothing unpushed, the watch stops it, removes the worktree and ends any leftover processes,
such as the MCP servers that outlive Claude Code. A session that ends with no PR and no
question gets a comment after 30 minutes and goes to waiting on Jeff.

## What went wrong along the way

- **Claude Code's own worktree option refused this PC** over a path-casing mismatch, so the
  launcher makes worktrees with git and turns off the isolation guard for queue sessions only.
- **Sessions wrote code before asking.** One early PR was built on six of its own "decisions";
  Jeff changed five of them in review and the work was redone. Questions-first came out of
  that.
- **Specs on a branch were invisible on a call.** That's why they're posted as comments.
- **Parked sessions filled the seven slots,** and finished ones lingered. Parking a session
  that's waiting on Jeff, and the watch closing finished ones, freed them.
- **A merged PR that said "Refs" instead of "Closes"** left its issue open and stalled a tree.
  PRs now close every issue they finish, and the tree closes a child itself in that case.

## What's next

The queue is about ten days old, and most of its rules came from things it got wrong in that
time. It runs on the same rule as everything else in the kit: when it gets something wrong,
the fix is an issue, and the issue goes through the queue.
