---
project: pcb-design-kit
title: "The reference library: books into checklists"
order: 13
date: 2026-10-27
summary: "About 30 free vendor PDFs are downloaded at install. Your own books are indexed into page-cited rule sheets, and those sheets become review checklist items at Gates 3 and 5."
status: published
---

## Free references

The installer downloads about 30 vendor PDFs: ADI's MT-series tutorials, TI's layout
and EMI notes, Espressif's hardware design guides, and the datasheets for the first
board. Each is checked to really be a PDF. Sources that block scripts or need a login go
in a "download by hand" table.

## Books

A wishlist of the 21 titles the rules cite, grouped by purpose:

- **Judgment:** Wilson, Pease, Huang.
- **Process and bring-up:** Fowler, Agans.
- **Layout and EMC:** Ott, Ritchey, Montrose, Bogatin, Johnson & Graham.
- **Fab:** Coombs.
- **Power:** Basso, Pressman.
- **Audio:** Self.
- **General:** Horowitz & Hill.

The rules say to use only what's actually in the library: "don't cite a text that isn't there."

## How a book becomes checks

Indexing reads a book chapter by chapter and writes a notes file:

- a chapter map with what's relevant;
- rules by topic (grounding, decoupling, stackup, routing, EMC, ESD, thermal, audio,
  DFM), each with a chapter and page;
- formulas;
- **design-review checklist items.**

At Gates 3 and 5, the review skill runs every notes file's checklist and cites the
page. If a book and a datasheet disagree, the datasheet wins and the clash is logged.

Notes are paraphrased with page numbers, never copied. The PDFs and their text stay on
Drive, never in git.

## An alternate engine

There are also scripts for indexing books with a separate model, local or hosted. They
refuse any rule without a page number, or with a page outside the chunk being read.
