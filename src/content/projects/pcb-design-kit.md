---
title: The AI PCB Design Kit
tagline: Turn a Windows PC into an AI-assisted circuit board design station. Claude Code drives KiCad from requirements to a filled-in fab order, and stops at checkout.
status: building
short: PCB Design Kit
kit: true
order: 2
cover: /images/pcb-design-kit/cover.jpg
coverCaption: "Illustration: from schematic to routed copper."
started: 2026-10-24
target: Demo video first, then the full series
tags: [Claude Code, KiCad 10, MCP, SKiDL, Quilter, PCBWay, GitHub Actions, PowerShell]
stats:
  - { label: Design tool, value: "KiCad 10 via an MCP server" }
  - { label: AI engineer, value: "Claude Code" }
  - { label: Layout, value: "Freerouting, or Quilter for 101-999 parts" }
  - { label: Fab and assembly, value: "PCBWay" }
  - { label: Capture, value: "KiCad schematic, or Python first (SKiDL)" }
  - { label: Checkpoints, value: "8 approval gates, each a pull request" }
  - { label: Videos, value: "One episode per gate, rendered on the PC" }
  - { label: Backup, value: "Every project is its own GitHub repo" }
---

What happens if you hand the whole board design process to an AI engineer, but make it work like a
careful senior hardware engineer?

This kit is the answer I built. A one-file PowerShell installer sets up KiCad 10, the KiCad MCP
server, Claude Code with a set of engineering rules and skills, a guard hook, and a launcher window.
From there, Claude Code takes a board from **requirements to schematic, layout, checks, fab files
and a filled-in PCBWay order**. It stops at eight gates for approval, and it never pays. Each gate
is worked as a GitHub issue and closed by a pull request, and merging that PR is the approval.
Each gate passed also becomes an episode of the build video, cut and rendered on the same PC.

## The rules that make it trustworthy

- **Every value has a source.** Datasheets, manufacturer reference designs and standards win over
  memory. Every part gets a page-cited datasheet card, and books are indexed into page-cited rule
  sheets that become review checklists. If a pinout or rating can't be sourced, the AI stops and asks.
- **Eight gates.** Requirements, architecture, schematic, placement, verification, fab outputs,
  order and bring-up. Each one ends in a pull request, and nothing moves forward until it's merged.
- **Checks you can run, not just read.** A board can be written in Python first (SKiDL) and then
  drawn, and the gate doesn't pass until the drawing and the code agree net for net. Reusable circuit
  blocks go in the public [pcb-blocks](https://github.com/JeffBasso/pcb-blocks) library, and a block
  only counts as proven once it has bench measurements.
  Board size is estimated early and tried at every open layer count before the outline is picked.
- **Guardrails, not just instructions.** A hook limits what the browser can visit and which files
  can be uploaded. Every upload asks first, and payment is always left to a human.
- **Nothing lives only on the desktop.** Each project is its own git repo, holding its boards and
  mechanical parts, that pushes on every commit, and a nightly job wraps up any day that didn't get
  a wrap-up.

## What the demo shows

A board going from a one-page spec through every gate, each one a pull request, the phone
dashboard updating live as jobs run, a Quilter layout run, and the PCBWay order stopping at checkout.
