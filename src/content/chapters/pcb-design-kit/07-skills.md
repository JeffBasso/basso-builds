---
project: pcb-design-kit
title: "The skills: procedures that load when needed"
order: 7
date: 2026-11-13
summary: "Seventeen skills: review checklists, a schematic readability standard, code-first capture, datasheet cards, board right-sizing, PoE and class-D rules, the Quilter and PCBWay procedures, Chrome readiness, the dashboard, the wrap-up and build log, book indexing, speaker boxes, and filming and editing the videos."
status: published
---

Skills are procedures Claude loads only when the work calls for them, which keeps the
rules file short. A table at the top of the rules says which skill goes with which work,
and each skill's own description tells Claude Code when to load it. The kit installs them
all; Update kit replaces them from the kit's `main` branch.

## The list

There are seventeen now, up from eleven at the end of October.

| Skill | What it does |
|---|---|
| **pcb-review** | Design-review checklists before G3 and G5. Each item is checked against the real files and datasheets and written up as PASS, DEVIATION (reason and risk) or FAIL (the fix). Also runs the checklist items from the indexed books, the datasheet-card checks and, on code-first boards, the netlist parity check. |
| **pcb-schematic-style** | The readability pass before G3, G5 and any public release: wires inside a block, labels only between blocks. Moves symbols and text only, and proves the netlist unchanged. |
| **pcb-skidl** | New. Code-first boards: parts and nets written in Python (SKiDL) first, then drawn in KiCad, with a parity check that the two netlists agree. Also how a board takes a block from the reusable blocks library. |
| **pcb-datasheet-cards** | New. One short, page-cited card per part, reference design or app note, shared by every board. Written at G2, checked in reviews, fixed the moment one is found wrong, and caught up for older boards. |
| **pcb-board-size** | New. Right-sizes the board in X, Y and Z, from G2 to G5 (below). |
| **pcb-poe-audio** | Rules for PoE, anything over 30 V, class-D audio, Ethernet and 4-layer boards. Says what to check and where the number comes from, and forbids using its own examples as values. |
| **pcb-quilter** | The Quilter path: tier and privacy, what to lock before handing off, submitting, the size-trial runs and reviewing the candidates. |
| **pcb-fab-order** | The G6 fab package and the G7 PCBWay order, with fixed stop points. |
| **pcb-chrome** | New. Makes sure Chrome and the Claude in Chrome extension answer before any browser step, and asks Jeff to reconnect the extension when they don't. |
| **pcb-dashboard** | Keeps the phone page current: the Right now card, the feed and the board cards. |
| **pcb-done-for-day** | The end-of-day wrap-up: commit, update status, copy snapshots to Drive, refresh the dashboard, draft the build log, report. Runs on request, unattended at night, or for every board at once. |
| **pcb-build-log** | Turns the day's work into draft chapters for this site and opens a pull request for review. |
| **pcb-index-books** | Turns books into page-cited rule sheets, and handles the book pipeline's flagged items. |
| **speaker-enclosure** | Loudspeaker boxes as mechanical parts of a project: sealed, vented and transmission-line options computed in Python, crossover targets for the amp board, and the internal temperature rise. |
| **pcb-recording** | Filming with OBS and aiming the camera. |
| **pcb-shot-list** | New. Each chapter's spoken scripts and talking points, read on the launcher's teleprompter, and the silent shots to film. |
| **pcb-video-edit** | New. One build-video episode per gate: the edit list, the render on the PC, and the video gate - Jeff approves before it goes up private, and again before it goes public. |
## The newest one: right-sizing

`pcb-board-size` came from a simple question: why is the board the size of the space it
fits in? It now runs at four points.

| When | What it does |
|---|---|
| **G2** | A rough floor from the BOM's courtyards, at every layer count still open, sets a provisional outline in the project's interface file. |
| **G4** | An exact estimate from the placed board: a routing floor from courtyards and keep-outs, a thermal floor from each hot part's worst-case loss and copper area, and three candidate outlines. Every part's height, heat sinks included, is checked against the limit for its side. |
| **Start of layout** | Size trials: every candidate outline at every open layer count is routed (by Quilter, or by Freerouting after the critical nets are hand-routed), checked for DRC, temperature and height, and priced on PCBWay's quote form. |
| **G5** | The pick: the smallest outline that passes at each layer count, both shown with prices, and the result recorded so later estimates get better. |

## A lesson from day 5

The first schematic-style standard let a schematic made almost entirely of net labels
pass, and its fix list even told the pass to relabel wires. The skill was rewritten the
same day around wires inside blocks, and all six sheets of the Project Ion board were
redrawn with the netlist proven identical after every block.
