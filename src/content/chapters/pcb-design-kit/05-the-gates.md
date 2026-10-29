---
project: pcb-design-kit
title: "The gates: G1 to G8, plus 4Q"
order: 5
gate: "Gates 1-8"
date: 2026-10-27
summary: "Requirements, architecture, schematic, placement, Quilter, verification, fab outputs, the order and bring-up. Claude stops at every one, summarizes, and waits for approval."
status: published
---

The rule is simple: **stop at each gate, summarize, and wait for approval. Never skip
one.** When a gate passes, Claude updates the board's status header and commits, posts a
line to the phone dashboard, and marks a chapter in the recording if OBS is running.

| Gate | What it produces |
|---|---|
| **G1 Requirements** | Function, I/O, connectors, power source and a per-rail budget with margin, environment, size, mounting, quantity and cost. If a spec exists, Claude drafts from it and only asks about the gaps. |
| **G2 Architecture and parts** | Block diagram, power tree with current per rail, parts with reasons and alternates, a saved datasheet and a reference design for every IC. A real part count decides the layout path: **101-999 parts goes to Quilter,** anything else to KiCad and Freerouting. |
| **G3 Schematic** | Built from the reference designs, ERC at zero, a readability pass, and the schematic review checklist. |
| **G4 Placement** | Outline, holes and connectors, then the position-critical parts. Renders and a schematic PDF go to the board's `current` folder. |
| **G4Q Quilter** | Quilter path only. You pick among Quilter's candidates, using Claude's written comparison. |
| **G5 Verification** | DRC at zero, the readability pass re-run, the layout checklist, calculations logged. |
| **G6 Fab outputs** | The full fab package for the revision, approved by you. |
| **G7 PCBWay order** | Filled in through Chrome, stopping at checkout with price and lead time. "I pay." |
| **G8 Bring-up** | The bench report. Added on day 4. |

## Gate 8 in detail

- **Order of work:** inspect the unpowered board against the renders; measure each
  rail's resistance to ground; first power from a bench supply with the current limit
  taken from the G2 budget, checking each rail's tolerance, ripple and temperature after
  two minutes; then reset, clocks, programming, each interface with its real cable, and
  the protection parts.
- **Method:** one variable at a time, and nothing changes until a symptom has a root cause.
- **Log:** every measurement goes into the bring-up log as step, expected (with its
  source), measured, and pass or fail. Anything wrong goes into the errata.
- **Report:** what works, what's bodged, go or no-go, and the change list for the next revision.

## Status tracking

The first five lines of each board's `STATUS.md` are fixed: title, updated, phase, last
gate passed with its date, and next step. The launcher's board list and the phone
dashboard both read those lines.

The [Project Ion chapters](../../ion-speaker/) follow these gates one by one, on a real board.
