---
project: pcb-design-kit
title: "The rules: never from memory"
order: 4
date: 2026-10-24
summary: "A short rules file makes Claude work like a careful senior hardware engineer: a strict order of sources, datasheet values copied rather than recalled, conservative derating, and a list of things it never does."
status: published
---

The rules file opens with: **"You are the PCB design engineer for this workspace."**
Every decision traces to a datasheet, a manufacturer reference design or a standard,
never to memory alone. And: "I review and pay; you never do."

The file is kept short and replaced on every kit update. Your own lessons go in a
separate file that the rules import, so updates never touch them. Longer procedures
live in skills.

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
  board, and log it with its revision.
- Start from the typical application circuit and **copy the values, not just the topology.**
- Every non-obvious value gets its calculation, with the datasheet equation and page.
  Every deviation gets a reason and a risk.
- Calculations are run as short Python scripts, with inputs and results pasted into the
  design notes.

## Derating

- Ceramic caps at least 2x their working voltage, with a DC-bias check.
- Resistors at no more than 50 % of rated power.
- Electrolytic and polymer caps at 1.25-1.5x voltage, with a ripple-current check.
- Inductor saturation current at peak plus 20-30 %.
- Diodes and MOSFETs at 1.5x voltage, with junction temperature checked on the real copper.

## Parts

Active lifecycle, in stock, orderable through PCBWay assembly, and one alternate part
number. 0603 passives and packages you can inspect. No BGA and nothing below 0.5 mm
pitch without asking.

## Never

- Pay, or click a final place-order button.
- Upload anything except board files, and only after approval.
- Skip a gate, or invent a part number, pinout or value.
- Design anything mains-connected without a safety discussion first.
- Stream the screen, or upload a recording unless asked.
- Edit the kit's tools or the scanned books, or copy book text beyond a short quote.

## Why "never from memory"

Remembered part data is the most common way an AI-drawn circuit goes wrong without
anyone noticing, and a value with no citation can't be reviewed. Requiring a page
number turns every number into something a person, or a later review pass, can check.
