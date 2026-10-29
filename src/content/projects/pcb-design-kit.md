---
title: The AI PCB Design Kit
tagline: Turn a Windows PC into an AI-assisted circuit board design station. Claude Code drives KiCad from requirements to a filled-in fab order, and stops at checkout.
status: building
order: 2
started: 2026-10-24
target: Demo video first, then the full series
tags: [Claude Code, KiCad 10, MCP, Quilter, PCBWay, GitHub Actions, PowerShell]
stats:
  - { label: Design tool, value: "KiCad 10 via an MCP server" }
  - { label: AI engineer, value: "Claude Code" }
  - { label: Layout, value: "Freerouting, or Quilter for 101-999 parts" }
  - { label: Fab and assembly, value: "PCBWay" }
  - { label: Checkpoints, value: "8 approval gates" }
  - { label: Backup, value: "Every board is its own GitHub repo" }
---

What happens if you hand the whole board design process to an AI engineer, but make it work like a
careful senior hardware engineer?

This kit is the answer I built. A one-file PowerShell installer sets up KiCad 10, the KiCad MCP
server, Claude Code with a set of engineering rules and skills, a guard hook, and a launcher window.
From there, Claude Code takes a board from **requirements to schematic, layout, checks, fab files
and a filled-in PCBWay order**. It stops at eight gates for approval, and it never pays.

## The rules that make it trustworthy

- **Every value has a source.** Datasheets, manufacturer reference designs and standards win over
  memory. If a pinout or rating can't be sourced, the AI stops and asks.
- **Eight gates.** Requirements, architecture, schematic, placement, verification, fab outputs,
  order and bring-up. Nothing moves forward without approval.
- **Guardrails, not just instructions.** A hook limits what the browser can visit and which files
  can be uploaded. Every upload asks first, and payment is always left to a human.
- **Nothing lives only on the desktop.** Each board is its own git repo that pushes on every commit,
  and a nightly job wraps up the day automatically.

## What the demo shows

A board going from a one-page spec through every gate, the phone dashboard updating live as jobs
run, a Quilter layout run, and the PCBWay order stopping at checkout.
