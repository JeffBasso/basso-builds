---
project: pcb-design-kit
title: "The reference library: books into checklists"
order: 13
date: 2026-11-13
summary: "Free vendor PDFs come with the install. Your own books go into a queue, and one Start run carries each through OCR, figures, indexing and notes on the Claude API. Every part also gets a page-cited datasheet card. Gates 3 and 5 check the design against all of it."
status: published
---

The rules say every value needs a source. The library is where those sources live, in
three kinds: free vendor references, your own books turned into rule sheets, and a
datasheet card for every part.

## Free references

The installer downloads about 30 vendor PDFs: ADI's MT-series tutorials, TI's layout
and EMI notes, Espressif's hardware design guides, and the datasheets for the first
board. Each download is checked to really be a PDF. Sources that block scripts or need
a login go in a "download by hand" table. In the launcher they're on the **Library**
window's **Collection** tab, next to the books you still want.

## Books

The rules cite 21 titles, grouped by purpose:

| Purpose | Authors |
|---|---|
| Judgment | Wilson, Pease, Huang |
| Process and bring-up | Fowler, Agans |
| Layout and EMC | Ott, Ritchey, Montrose, Bogatin, Johnson & Graham |
| Fab | Coombs |
| Power | Basso, Pressman |
| Audio | Self |
| General | Horowitz & Hill |

The rules also say to use only what's actually in the library: "don't cite a text that
isn't there." The PDFs and their text stay on Google Drive, never in git.

## The book pipeline

Books are indexed on the Claude API, not in a Claude Code session. The work goes out as
Message Batches from a GitHub Actions workflow on a self-hosted runner on the PC. The
runner signs in with workload identity federation: GitHub hands the job a short-lived
token and the Anthropic SDK exchanges it, so no API key is stored anywhere. Books get
their own runner, so a book run never waits behind the Windows tests.

Everything is driven from **Library > Processing**: one row per PDF in the books folder.
**Analyze books** reads every page on the PC first (no API) to see which pages have text.

**The queue.** A small queue file lists the books to process, in order. You add or
remove books with a right-click, or edit the file. A book leaves the queue when all its
steps are complete.

**Start run is the only trigger.** There's no hourly task and no timer. Start run starts
the workflow, and that one run carries every queued book through every step, books side
by side:

| Step | What it does | Where |
|---|---|---|
| OCR | Transcribes image-only pages. A book with text on 95% of its pages skips it | API |
| Figures | Describes figures and tables. Two-page spreads go as one request | API |
| Index | Sends each chunk of the book, with its figure text folded in, and gets back rules with page citations | API |
| Notes | Builds the book's notes file from all the index replies | On the PC |

The run sends a book's next step, checks the batch every 2 minutes, brings the result
home and sends the step after that. It reads the queue again on every pass, so a book
added mid-run is picked up. It ends when every queued book is complete or stuck on an
error. One book run goes at a time, it can run for up to a day, and cancelling it loses
nothing: the next Start run brings open batches home. While it runs, the button says
**Running...** and is greyed out. Only the PC has to stay on; the launcher window can
be closed.

Each step cell reads `to do`, `processing`, `error` or `complete`. Hovering a cell
shows the detail: the whole error, or when it finished, what it produced, its cost and
its model. Every step runs on Sonnet unless you switch a book to Opus.

**Nothing asks you anything.** A reply that fails the checks (a rule without a page,
a page outside the chunk being read) goes back to the API once, with what was wrong.
One still flagged after that is kept and marked as a best guess. Book problems are fixed
through the API, never by hand-editing notes in a Claude Code session: that would spend
the Claude plan, and the API credits are budgeted for books. To redo part of a book,
right-click it and start over from a step. That step and every later one are deleted
(after a confirm box naming what goes) and run again.

**Spending limits.** There's a monthly budget per credit cycle, and a weekly limit (15%
of the budget unless you change it) over a rolling seven days, so one run can't spend the
month in a day. A step that hits either limit shows an error saying which, and when
there's room again. Batches already sent still finish.

## What a notes file holds

- a chapter map with what's relevant;
- rules by topic, each with a chapter and page;
- formulas and rules of thumb;
- **design-review checklist items;**
- conflicts with datasheets, other books or the rules.

The index prompt asks for general engineering rules, not only board rules. Enclosures,
acoustics and loudspeakers, firmware, test and measurement, troubleshooting and safety
each have a heading. The first version kept only board rules, and a loudspeaker book
came back almost empty. A book indexed with an older prompt is re-indexed the next time
it's queued.

Notes are paraphrased with page numbers, never copied. A rule with no page citation is
left out.

## Datasheet cards

Books give general rules; parts need their own. Every part with a datasheet gets a
**datasheet card**: one short summary, shared by every board, with every value tied to
a page of an exact datasheet revision. So does every reference design, app note or
hardware design guide a board uses. Passives and connectors get short cards, and one
card can cover a family.

| When | What happens |
|---|---|
| Gate 2 | A card is written or refreshed for every chosen part |
| Gates 3 and 5 | The review lists any datasheet without a card (the gate doesn't pass until each has one), checks the design against each card, then spot-checks the cited pages |
| Any time | Board work that finds a card wrong fixes it in the same session |
| New datasheet revision | The card is marked stale until it's checked against the revision history |

**The datasheet still wins.** A card is where to look first. A value is checked against
the cited page before it goes into the design notes, and the notes cite the datasheet,
not the card. Boards started before cards existed get theirs before their next gate.

Cards are in Claude's own words and stay private. They're never published on this site.

## How it's used at the gates

The library has a reading order: its index first, then the book notes and the datasheet
cards, and only then the PDFs, opened at the cited pages. At Gates 3 and 5 the review
skill runs every notes file's checklist and cites the page for each item. If a book and
a datasheet disagree, the datasheet wins and the clash is logged.

## By hand, and an alternate engine

A book can still be indexed by hand in a **Library & lessons** session. That skips any
book the pipeline is working on, so the two never write the same notes. There are also
scripts that index with a separate model, local or hosted, using the same chunking and
checks as the pipeline.
