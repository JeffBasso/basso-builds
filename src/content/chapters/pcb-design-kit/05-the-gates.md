---
project: pcb-design-kit
title: "The gates: G1 to G8, plus 4Q"
order: 5
gate: "Gates 1-8"
date: 2026-11-13
summary: "Requirements, architecture, schematic, placement, layout, verification, fab outputs, the order and bring-up. Each gate is an issue, worked on its own branch and closed by a pull request; merging the PR is the approval."
status: published
---

The rule is still simple: **stop at each gate, summarize, and wait for approval. Never skip
one.** What changed in November is how a gate is carried out. Each gate is now a GitHub
issue, worked in its own session on its own branch, and it ends in a pull request. Jeff
approves a gate by merging that PR.

## A gate is an issue, a branch and a PR

| Step | What happens |
|---|---|
| **Issue** | Each gate of a part is an issue on the part's repo, titled `<part>: GATE <n>` (4Q is allowed). |
| **Session** | The launcher's work queue starts a Claude Code session for it in a worktree on branch `<part>-gate<n>`. The repo folder itself stays on `main`, the approved state. |
| **Work** | The session reads the status, the spec, the requirements and the open issues, then does the gate as the rules describe it below. |
| **Hand-off** | It sets the status header to `GATE <n> in review` (never "passed"), pushes, and opens a PR with the ERC or DRC results, the renders, the open questions and the status hand-off. |
| **Approval** | Merging the PR is the approval. The launcher then writes `GATE <n> passed <date>` into the status file, opens the next gate's issue and starts its session. |
| **Changes** | If Jeff leaves review comments instead of merging, **Run** on the PR resumes the same conversation on the same branch to address them. |

A few rules keep this tidy. One gate PR per part at a time. Gate sessions never merge and
never commit to `main`. A problem found in an earlier gate becomes a new issue that reopens
that gate, not a quiet fix on the current branch. A problem with the kit itself becomes an
issue on the kit's repo, and if the gate can't go on, the gate issue is labelled
`blocked on kit` and the session stops. Merges can also come from a phone or a voice call,
with the PR read back first; the launcher and work-queue chapters cover that side.

A new multi-part project starts one level up, at **project GATE 1**: a shared requirements
file and an `INTERFACES.md` that holds the numbers more than one part depends on (outline,
holes, heights, connectors, heat path). Every part then runs the gates below, and at GATE 3
and GATE 5 it is checked against every interface row it uses.

## What each gate produces

| Gate | What it produces |
|---|---|
| **G1 Requirements** | Function, I/O, connectors, power source and a per-rail budget with margin, environment, size, mounting, quantity and cost. If a spec exists, Claude drafts from it and only asks about the gaps. |
| **G2 Architecture and parts** | Block diagram, power tree with current per rail, parts with reasons and alternates, a saved datasheet and reference design for every IC, and a **datasheet card** for every part. A real part count picks the layout path: **101-999 parts goes to Quilter,** anything else to KiCad and Freerouting. A rough **board-size estimate** from the BOM, at every layer count still open, sets the provisional outline. |
| **G3 Schematic** | Built from the reference designs. ERC at zero with `kicad-cli` (the ERC of record). Missing junctions repaired after any edit through the KiCad MCP server. A readability pass and the schematic review checklist, with each part checked against its datasheet card. On a code-first board, the SKiDL netlist parity check must report 0 differences. |
| **G4 Placement** | The schematic brought onto the board headless, with schematic parity at 0. An exact size estimate in X, Y and Z from the placed parts, and the candidate outlines. The largest candidate is drawn with holes and connectors, then the position-critical parts are placed. Renders and a schematic PDF go to the board's `current` folder, and only count once every footprint has a 3D model. |
| **G4Q Quilter** | Quilter path only. Jeff picks among Quilter's candidates, using Claude's written comparison. |
| **G5 Verification** | After the size trials and routing: DRC at zero, the readability pass re-run, the layout checklist, calculations logged, SKiDL parity again on code-first boards, and the size pick - the smallest outline that passes X, Y and Z at each layer count, with the layer count chosen. |
| **G6 Fab outputs** | The full fab package for the revision, with test points, holes and fiducials kept out of the BOM and pick-and-place. |
| **G7 PCBWay order** | Filled in through Chrome, stopping at checkout with price and lead time. "I pay." |
| **G8 Bring-up** | The bench report. Its issue is opened when GATE 7 passes, but not started until the boards arrive. |

## New steps since October

Most of these came straight out of problems on the first real board.

- **Datasheet cards (G2, G3, G5).** One short, page-cited summary per part, shared by every
  board. The review lists any datasheet without a card, checks the design against each card,
  then spot-checks the cited pages. The datasheet still wins over the card.
- **Junction repair (G3).** The KiCad MCP server's schematic tools drop junction dots on
  every write, and a wire that ends in the middle of another wire then stops connecting. A
  script puts them back and runs the ERC after any such edit.
- **Code-first capture (G3, G5).** A board marked `Capture: skidl` has its parts and nets
  written in Python first, then drawn in KiCad; a parity check compares the two netlists and
  the gate doesn't pass unless it reports 0. Reusable blocks from the public library plug
  into this path; they get a chapter of their own.
- **Headless Update PCB (G4).** A script does what KiCad's Update PCB from Schematic does,
  then checks schematic parity. The MCP server's own sync stacked new parts at the origin and
  missed nets, so it is no longer used.
- **Board checks (G4, G5, G6).** One script reads the board file and checks that every
  footprint has a 3D model on disk (otherwise the renders and height checks are silently
  wrong) and that test points, holes and fiducials are excluded from the BOM and position
  files. A hook runs it whenever a `GATE <n> in review` commit is made.
- **Right-sizing (G2, G4, layout, G5).** The board is sized by what it needs, not by what the
  enclosure allows: a floor from courtyards, keep-outs and worst-case heat, a few candidate
  outlines at every open layer count, each one routed and priced, and every part's height
  checked against its side's limit. The skills chapter covers the tool.

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

Each board's `STATUS.md` starts with a fixed header: title, updated, phase, gate and next
step. The gate line reads `GATE <n> in review` while a PR is open and `GATE <n> passed
<date>` once it merges. The launcher's board list and the phone dashboard both read it.
Every passed gate also becomes one build-video episode, with its own review before anything
goes online; the filming chapter covers that.

The [Project Ion chapters](../../ion-speaker/01-the-idea/) follow these gates one by one, on a real board.
