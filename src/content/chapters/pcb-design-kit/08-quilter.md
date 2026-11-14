---
project: pcb-design-kit
title: "The Quilter path"
order: 8
gate: "Gate 4Q"
date: 2026-11-13
summary: "Boards with 101 to 999 parts go to Quilter's AI placement and routing. Claude syncs and locks everything position-critical first, submits the size-trial runs through Chrome after one approval, and writes a review of the candidates."
status: published
---

Quilter is an AI placement-and-routing service. The kit sends it boards with **101 to
999 parts,** and flags in-range boards that don't suit it, such as RF traces,
length-matched buses or blind vias.

## Tier and privacy

The skill asks every time. The free tier is for open-source designs and trains
Quilter's models; paid tiers are priced per pin. Every design is treated as private
until Jeff says otherwise.

## The handoff

- ERC clean, and the board brought up to date with the schematic by the kit's headless
  Update PCB script, with schematic parity at 0. The KiCad MCP server's own sync isn't
  used any more: it stacked new parts at the origin and missed nets.
- Outline and stackup set, net classes matching PCBWay's limits and IPC trace widths.
- **Place and lock everything position-critical:** connectors, the RF module at the
  edge, pre-routed switcher hot loops, crystals, and any isolation barrier with
  everything on its primary side.
- Leave the other parts outside the board outline for Quilter to place.
- Tag the commit and write a submission note.

## Size trials: several runs at once

Boards are now right-sized rather than drawn to the enclosure (the skills chapter
describes how). At the start of layout, every candidate outline at every layer count
still open becomes its own Quilter run: three outlines at two layer counts is six runs.

- Each trial is a copy of the board with its outline redrawn and its stackup set. Locked
  parts keep the same offsets from their fixed edges on every outline, and keep-outs move
  with them.
- Claude prepares them all, then asks **once for the whole set**, saying how many runs and
  which files, and submits them together.
- One size review compares every candidate of every run: routed, DRC, the worst-case
  temperature of each hot part, the tallest part on each side against its height limit,
  and the PCBWay price. It recommends the smallest passing outline at each layer count,
  and the pick is made at GATE 5.

## Submit

Chrome is checked first, so a disconnected extension shows up before the upload, not in
the middle of it. Claude states the exact files and settings, waits for the OK, and uploads
through Chrome. The dashboard's "Right now" card updates the moment a run starts, with a
first-run estimate of about four hours. There's no tight polling: at most a check every
30 minutes.

## Review

Candidates are downloaded next to the working board, never over it. Each gets DRC, the
layout checklist, and completion, via and return-path numbers. Candidates come back
without the board's own 3D models, so the board check must find every model again before
any renders are made. Claude writes a review with renders of the top two, and Jeff picks
at **Gate 4Q.** Like every gate, 4Q is its own issue and pull request, and merging the PR
is the pick. Expect two to five runs.

## In practice

On Project Ion, run 1 put 14 parts on the wrong side of the isolation barrier, because
Quilter only treats a moat as a copper keep-out. The lesson went back into the skill:
anything safety-related is placed, routed and locked by hand first. The full story is
in [the Ion chapter on Quilter](../../ion-speaker/06-gate-4q-quilter/).
