---
title: "Restructuring a Feishu Knowledge Base & Establishing WIKI-SCHEMA"
lang: en
summary: "How I systematically migrated scattered Feishu docs into a local Obsidian vault with a durable maintenance spec, turning passive accumulation into a retrievable knowledge base."
project_category: "飞书知识库重构"
project_category_en: "Feishu KB Restructure"
work_type: "架构选型"
date: "2026-07-30"
tags: ["opa", "飞书知识库重构", "知识管理", "架构选型", "最佳实践"]
has_diagrams: true
order: 1
status: "published"
draft: false
---


## Background
Feishu cloud docs had piled up unstructured and were hard to retrieve or reuse. Starting 2026-07-27 I migrated them into a local Obsidian vault and set a long-term maintenance spec. The only goal: knowledge that keeps accumulating and is always findable—not abandoned after the move.

## Key Decisions
- **Layering source vs knowledge base (`raw/` vs `wiki/`).** Feishu exports go to `raw/` (read-only, never edited); LLM-distilled pages go to `wiki/`. Rationale: the source is the source of truth and must not drift; the knowledge base can be rewritten without corrupting the original. Mixing them was rejected—you'd later lose track of what is quote vs summary.
- **A separate `report/` for process artifacts.** Check/review/diff reports and helper JSON live here, not in the knowledge base body. Rationale: they exist only locally and never appear in the Feishu tree, so the local-only vs Feishu-missing diff identifies them; moving them out doesn't break the graph.
- **frontmatter + Dataview instead of a hand-written index.** Every page carries structured metadata; index pages use Dataview queries to auto-generate. Rationale: manual indexes inevitably rot as entries grow; automated aggregation is free.
- **Mermaid for all diagrams.** Native Obsidian rendering, no plugins. Rationale: versionable, diffable, exportable.

## Outcome
- A 329-note, clearly structured, searchable personal knowledge base.
- `WIKI-SCHEMA.md` became the shared spec every later topic library (engineering experience, tools & automation, …) follows.
- Import → distill → diff-detect → lint now forms a reusable loop; new material lands fast.

## Lessons
<div class="callout callout-tip">
<p class="callout-title">Reusable lessons</p>
<p><strong>Source immutability is the baseline</strong>: source docs are read-only; all processing happens in <code>wiki/</code>, so knowledge never gets messier with age.</p>
<p><strong>LLM owns the wiki, humans read</strong>: delegate distillation/links/maintenance to the LLM as routine, and humans only consume—then the snowball keeps rolling.</p>
<p><strong>Keep process artifacts out of the body</strong>: isolating <code>report/</code> keeps the graph clean and search uncluttered.</p>
<p><strong>frontmatter discipline sets the ceiling</strong>: fill <code>type/status/tags/related</code> and Dataview + lint actually run.</p>
</div>
<div class="callout callout-warning">
<p class="callout-title">Pitfalls</p>
<p>Don't mix source and distilled pages in one folder; don't hand-maintain indexes; don't skip frontmatter—each breaks retrievability.</p>
</div>
