---
project: pcb-design-kit
title: "The rules: never from memory"
order: 4
date: 2026-11-13
summary: "One rulebook makes Claude work like a careful senior hardware engineer: a strict order of sources, datasheet values copied rather than recalled and cited by page, conservative derating, gates approved by merging a pull request, and a list of things it never does."
status: published
---

The rulebook opens with: **"You are the PCB design engineer for this workspace."**
Every decision traces to a datasheet, a manufacturer reference design or a standard,
never to memory alone. And: "I review and pay; you never do."

The file belongs to the kit and is replaced on every kit update. Your own lessons go
in a separate file that the rulebook imports, so updates never touch them. Longer
procedures live in skills, and the rulebook starts with a table saying which skill to
load before which kind of work: reviews, schematic style, code-first capture, PoE and
audio, Quilter, board sizing, fab and order, datasheet cards, the build log, filming
and the videos. A board or project can add a short rules file of its own (under 30
lines) for its rails, do-not-substitute parts and keep-outs; a deviation from the
rulebook there has to be written as an override with a reason.

## The order of sources

When sources disagree, the higher one wins, and the conflict gets written down:

1. Your explicit instructions.
2. The component datasheet, latest revision, from the manufacturer.
3. The manufacturer's design guide, reference design or eval board.
4. Manufacturer app notes.
5. Industry standards: IPC, USB-IF, IEEE 802.3, IEC.
6. Engineering texts.
7. General knowledge, only when nothing above covers it, **and Claude has to say so.**

"Never guess a pinout, pin function, max rating, or footprint: if it can't be sourced,
stop and tell me."

## Datasheets and reference designs

- Save every IC, regulator, crystal, connector and protection-part datasheet to the
  board, and log it with its revision. A downloaded PDF is checked (newest file after
  the click, not empty, really a PDF) and moved, never copied, into the board.
- Start from the typical application circuit and **copy the values, not just the topology.**
- Every non-obvious value gets its calculation, with the datasheet equation and page.
  Every deviation gets a reason and a risk.
- Calculations are run as short Python scripts, with inputs and results pasted into the
  design notes.
- **Datasheet cards.** Every part gets a short, page-cited summary in the workspace,
  shared by every board. Claude starts from the card, then checks each value it uses
  against the cited page. The datasheet wins, and the design notes cite the datasheet,
  not the card. A card found wrong is fixed at once, by whichever session finds it.

## Derating

| Part | Rule |
|---|---|
| Ceramic caps | At least 2x working voltage, with a DC-bias check (C0G for timing and filters) |
| Resistors | No more than 50 % of rated power |
| Electrolytic and polymer caps | 1.25-1.5x voltage, with a ripple-current check |
| Inductors | Saturation current at peak plus 20-30 % |
| Diodes and MOSFETs | 1.5x voltage, junction temperature checked on the real copper |
| Connectors | Rated per contact, with margin |

## Parts

Active lifecycle, in stock, orderable through PCBWay assembly, and one alternate part
number. 0603 passives and packages you can inspect. No BGA and nothing below 0.5 mm
pitch without asking. Footprints come from KiCad's official libraries and are checked
against the package drawing of the exact part-number suffix. Test points, mounting
holes, fiducials and logos are excluded from the BOM and position files on the
schematic symbol, so every PCB update carries that through; a kit script checks it
before the fab files are made.

## Gates are pull requests

The rulebook still lists the eight gates, from requirements to bring-up, but how a gate
is approved changed. Each gate is an issue on the part's repo, worked on its own
branch. At the end, Claude marks the gate "in review" (never "passed"), pushes, and
opens a pull request with the check results, renders and open questions. **Merging the
pull request is the approval.** Claude never merges, never commits to `main`, and opens
one gate PR per part at a time. A problem found in an earlier gate is a new issue, not a
fix slipped into the current branch. A tool problem is an issue on the kit, and if the
gate can't go on, it's labelled blocked and Claude stops. The gates have their own
chapter.

## Never

- Pay, enter payment details, or click a final place-order button.
- Upload anything except board files to Quilter or PCBWay, a mechanical part's CAD to
  Onshape once its model is approved, and the rulebook and lessons to the claude.ai
  Project, each only after approval. If the guard hook blocks something, say so; don't
  work around it.
- Skip a gate, or invent a part number, pinout or value.
- Design anything mains-connected without a safety discussion first.
- Stream the screen, or upload a recording unless asked. Recording pauses before
  sign-in, payment and checkout pages. A video goes to YouTube private only after an
  "approve", and public only after a separate "publish it", never from an unattended run.
- Edit the kit's tools or the scanned books, or copy book text beyond a short quote.

## Working on Windows

A section we didn't expect to need: Claude Code on Windows has both a PowerShell tool
and a Bash tool, and mixing them up was a recurring source of failed commands. The rules:
Windows commands in PowerShell, Bash only for POSIX scripts, never one shell's syntax
in the other, no doubled backslashes in inline Bash (Claude Code on Windows silently
halves them, and a hook now denies them), and text with quotes goes to a file first
(`git commit -F`, `--body-file`). Unattended runs have only Bash, so they call the
kit's PowerShell scripts through it.

## Voice calls and other windows

Two newer sections cover work away from the keyboard. On a voice call in the claude.ai
Project, Claude can't submit GitHub's forms, so it posts one marked command per comment
on a pinned inbox issue, and only after you say yes aloud; a merge always gets a
read-back of what it changes and its check status first. A "sprint" routine plans and
reviews batches of issues the same way. That workflow has its own chapter. Separately,
when one Claude Code window finds something another open window needs, it may send that
window a short note, but **a note is never approval**: every gate, order, upload, push
or merge still needs a yes in the window doing it.

## Why "never from memory"

Remembered part data is the most common way an AI-drawn circuit goes wrong without
anyone noticing, and a value with no citation can't be reviewed. Requiring a page
number turns every number into something a person, or a later review pass, can check.
