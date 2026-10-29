---
project: pcb-design-kit
title: "The skills: procedures that load when needed"
order: 7
date: 2026-10-28
summary: "Review checklists, a schematic readability standard, PoE and class-D rules, the Quilter and PCBWay procedures, the dashboard, the end-of-day wrap-up, book indexing, speaker boxes and filming."
status: published
---

Skills are procedures Claude loads only when the work calls for them, which keeps the
rules file short. A table at the top of the rules says which skill goes with which work.

- **pcb-review.** Design-review checklists before G3 and before G5. Every item is checked
  against the actual files and datasheets, and written up as PASS, DEVIATION (with reason
  and risk) or FAIL (with the fix). It also runs the checklist items from every indexed
  book's notes, so the reading turns into checks.
- **pcb-schematic-style.** Passing ERC isn't enough, because the schematic is what other
  builders read. The core rule: **wires inside a block, labels only between blocks,**
  with labels under about 30 % per sheet. The netlist is compared after every block, and
  any difference is undone.
- **pcb-poe-audio.** Rules for PoE, anything over 30 V, class-D audio, Ethernet and
  4-layer boards. It says what to check and where the number comes from, and forbids
  using its own examples as values.
- **pcb-quilter.** The Quilter path: tier and privacy, what to lock before handing off,
  submitting, and reviewing the candidates.
- **pcb-fab-order.** The G6 fab package and the G7 PCBWay order, with fixed stop points.
- **pcb-dashboard.** Keeps the phone page current.
- **pcb-done-for-day.** The end-of-day wrap-up: update status, commit and push every
  repo touched, copy snapshots to Drive, refresh the dashboard. It runs on request, or
  unattended at night.
- **pcb-index-books.** Turns books into page-cited rule sheets, a chapter at a time.
- **speaker-enclosure.** Loudspeaker boxes as their own projects: sealed, vented and
  transmission-line options computed in Python, crossover targets handed to the amp
  board, and the internal temperature rise checked.
- **pcb-recording.** Filming with OBS and the camera.
- **pcb-build-log.** New: turns the day's work into draft chapters for this site and
  opens a pull request for review.

## A lesson from day 5

The first schematic-style standard let a schematic made almost entirely of net labels
pass, and its fix list even told the pass to relabel wires. The skill was rewritten the
same day around wires inside blocks, and all six sheets of the Project Ion board were
redrawn with the netlist proven identical after every block.
