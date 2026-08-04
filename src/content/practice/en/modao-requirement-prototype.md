---
title: "WorkBuddy × Modao: End-to-End Requirement-to-Prototype Pipeline"
lang: en
summary: "Wired the full chain—requirement submission → breakdown → scaffolding → Modao prototype generation—via Modao's official Streamable HTTP MCP plus a WorkBuddy orchestration skill; token configured and verified end-to-end."
project_category: "工具链开发"
project_category_en: "Toolchain / MCP Integration"
work_type: "MCP集成"
date: "2026-07-31"
tags: ["opa", "工具链开发", "MCP集成", "墨刀", "WorkBuddy"]
has_diagrams: undefined
order: 2
status: "published"
draft: false
---


## Background
- **Goal**: make "submit a requirement in WorkBuddy → break it down → scaffold → auto-generate a Modao prototype" a reusable automation.
- **Context**: the user wanted WorkBuddy connected to Modao (MockingBot).
- **Output**: a `modao` entry in `mcp.json` + an orchestration skill (`modao-product-workflow`) + end-to-end verification.
- **Scope**: spans three places—WorkBuddy config, the skill, and the external Modao MCP.

## Key Decisions
- **Use Modao's official MCP, not a self-built API**: Modao ships a Streamable HTTP MCP (https://modao.cc/agent-py/ai/mcp)—no reverse-engineering, no SDK.
- **Streamable HTTP + header auth (`modao-token`), not local npx**: minimal config, with OAuth as a fallback.
- **Orchestrate with a skill, not a script**: reusable across projects, triggerable in conversation, with built-in MCP connectivity checks.

## Implementation
1. Researched and confirmed Modao's official MCP and its tool set.
2. Merged a `modao` entry into `mcp.json` (`type: http`, `url`, `headers.modao-token`).
3. Created a user-level skill `modao-product-workflow` defining the four-stage orchestration.
4. Wrote the user-provided token into config; probed the endpoint with `urllib` (`initialize` + `tools/list` succeeded, server `modao-agent-py v3.4.2`).
5. End-to-end smoke test: `generate_html` produced a "mobile login page", immediately returned `completed` with `preview_url`/`task_url`, truly previewable.

## Outcome
- Delivered: `mcp.json` (with `modao`, token filled) + `SKILL.md` (real tool names + async polling pattern).
- The four-stage chain closes inside the skill; the token is verified working; a real Modao prototype was generated.
- Todo: the user must trust/enable `modao` in WorkBuddy's connectors (or restart to reload `mcp.json`) so the `mcp__modao__*` tools are available this session; then the skill can run real requirements.

## Lessons
<div class="callout callout-tip">
<p class="callout-title">Best practice</p>
> Prefer the official MCP when plugging in third-party AI; Modao/asta etc. all use `type:http + url + headers` Streamable HTTP, natively supported by WorkBuddy.
> Always treat Modao generation as **async**: `generate_*` returns a `task_id` → poll `get_task_result` (~300s) → take `preview_url`/`task_url`.
<div class="callout callout-warning">
<p class="callout-title">Pitfalls</p>
> Never hardcode a plaintext token into a shared repo; prefer OAuth or `${ENV}` expansion. Blog/docs tool names go stale—trust `tools/list` from a live probe.
