---
project: pcb-design-kit
title: "The Quilter path"
order: 8
gate: "Gate 4Q"
date: 2026-10-27
summary: "Boards with 101 to 999 parts go to Quilter's AI placement and routing. Claude locks everything position-critical first, submits through Chrome after approval, and writes a review of the candidates."
status: published
---

Quilter is an AI placement-and-routing service. The kit sends it boards with **101 to
999 parts,** and flags in-range boards that don't suit it, such as RF traces,
length-matched buses or blind vias.

## Tier and privacy

The skill asks every time. The free tier is for open-source designs and trains
Quilter's models; paid tiers are priced per pin. Every design is treated as private
until you say otherwise.

## The handoff

- ERC clean, outline and stackup set, net classes matching PCBWay's limits and IPC trace widths.
- **Place and lock everything position-critical:** connectors, the RF module at the
  edge, pre-routed switcher hot loops, crystals, and any isolation barrier with
  everything on its primary side.
- Leave the other parts outside the board outline for Quilter to place.
- Tag the commit and write a submission note.

## Submit

Claude states the exact files and settings, waits for your OK, and uploads through
Chrome. The dashboard's "Right now" card updates the moment the run starts, with a
first-run estimate of about four hours. There's no tight polling: at most a check every
30 minutes.

## Review

Candidates are downloaded next to the working board, never over it. Each gets DRC, the
layout checklist, and completion, via and return-path numbers. Claude writes a review
with renders of the top two, and you pick at **Gate 4Q.** Expect two to five runs.

## In practice

On Project Ion, run 1 put 14 parts on the wrong side of the isolation barrier, because
Quilter only treats a moat as a copper keep-out. The lesson went back into the skill:
anything safety-related is placed, routed and locked by hand first. The full story is
in [the Ion chapter on Quilter](../../ion-speaker/06-gate-4q-quilter/).
