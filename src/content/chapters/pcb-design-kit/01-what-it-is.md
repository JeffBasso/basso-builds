---
project: pcb-design-kit
title: "What the kit is, and the problem it solves"
order: 1
date: 2026-11-13
summary: "One installer, an engineering rulebook and a set of skills that turn a Windows PC into an AI-assisted board design station. Claude takes a board from requirements to a filled-in PCBWay order, one gate at a time, and every gate is a pull request a person merges. It stops at checkout."
status: published
---

The AI PCB Design Kit is a single PowerShell installer plus a set of rules, skills,
hooks and small scripts. Together they make an ordinary Windows PC into a
circuit-board design station where **Claude Code works as the PCB design engineer.**
It takes a board from requirements to a filled-in PCBWay order and stops at
checkout. A person pays.

## The toolchain it wires together

| Tool | What it does in the kit |
|---|---|
| **KiCad 10** | Schematic, placement, routing, ERC/DRC and exports, driven through an open-source MCP server (KiCAD-MCP-Server, MIT). A second, read-only KiCad server is registered as a reviewer. |
| **Kit scripts around KiCad** | Headless "update PCB from schematic", junction repair after MCP schematic edits, board checks (3D models, fab attributes) and a board-size estimator. They exist because the MCP server got those jobs wrong on a real board. |
| **SKiDL** | Optional code-first capture: a board's parts and nets written in Python, drawn in KiCad, and checked against each other. |
| **pcb-blocks** | A [public library](https://github.com/JeffBasso/pcb-blocks) of parity-checked circuit blocks, each as a SKiDL module and a KiCad design block. |
| **Freerouting** | Autoroutes small boards. |
| **Quilter** | AI placement and routing on boards with **101 to 999 parts.** |
| **Claude in Chrome** | Fills in the Quilter and PCBWay web forms and downloads datasheets. |
| **PCBWay** | Fabricates and assembles. |
| **CadQuery and Onshape** | 3D models for parts KiCad's library doesn't have, and CAD for enclosures and brackets. |
| **OBS Studio, an OBSBOT camera, FFmpeg and Whisper** | Film the sessions and cut one build-video episode per gate on this PC. |
| **Self-hosted GitHub Actions runners** | Run the nightly wrap-up, the book pipeline, the kit's tests and the work queue on the desktop. |
| **A phone dashboard and the GitHub app** | Show what's happening, and hand Claude work, while you're away from the desk. |

## The problem

A language model can produce a plausible circuit from memory, and that's the danger.
A pinout, absolute-maximum rating or footprint remembered "roughly" becomes a dead
board. The kit is built around stopping that:

- **Every decision traces to a source:** a datasheet, reference design, app note or
  standard. The rules say "never from memory alone". Each part gets a short,
  page-cited datasheet card that every later board starts from.
- **The work is cut into eight approval gates,** plus a Quilter checkpoint, a
  project-level first gate for builds with several parts, and a video gate before
  anything goes on YouTube. Claude stops at each one, summarizes, and waits.
- **Approval is a merge.** Each gate is a GitHub issue worked on its own branch. At
  the end Claude opens a pull request with the ERC or DRC results, renders and open
  questions. Merging the PR is the approval; Claude never merges and never commits
  to `main`.
- **What can be enforced is enforced.** A guard hook and permission rules block the
  dangerous actions. What can't be enforced stays a written rule.
- **Nothing lives only on the desktop.** Every repo pushes on commit, so the PC can be
  rebuilt by running the installer again and cloning.

## The stance

It's a careful senior hardware engineer, scripted. The installer asks before each
change. The rulebook is the one place the engineering rules live, and longer
procedures load only when needed, as skills. Long jobs report progress to a phone.
The person keeps the decisions that matter: merging gates, approving uploads,
picking a Quilter candidate, approving videos, and paying.

The same discipline now covers the kit's own work. Changes to the kit, and gates on a
board, run as background Claude Code sessions in a work queue fed by GitHub issues;
labelling an issue from the phone, or asking on a voice call, starts one on the
desktop. That workflow has its own chapter.

The first real board built with it is [Project Ion](../../ion-speaker/01-the-idea/), an in-wall PoE
speaker amp. A lot of the kit's PoE and audio rules, and most of its KiCad helper
scripts, exist because of that board.
