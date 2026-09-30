---
title: "Optimizing a Closure-Orchestrator Skill with darwin-skill"
lang: en
summary: "How I took a working orchestration Skill to publication grade using an 8-dimension scorecard plus a ratchet. The core idea: build an objective baseline before changing anything, keep only score-improving edits, revert the rest."
project_category: "Toolchain Development"
work_type: "Skill Development"
date: "2026-08-06"
tags: ["Skill Development", "darwin-skill", "Orchestration", "Retrospective"]
has_diagrams: true
order: 3
status: "published"
draft: false
---

The "Closure Orchestrator Skill" is the master controller for my knowledge base's wrap-up flow — once a project is done, it consolidates scattered output into four kinds of assets. It started with three stages. It ran. But I knew it wasn't solid enough. This is the record of how I pushed it from "works" to "publication grade."

The point isn't *which parts I changed*. It's that I **built an objective baseline first, then used a ratchet to lock in the gains**.

## 1. Background: the three stages were missing the most critical one

The original orchestration paradigm had three stages: experience extraction → terminology extraction → explainer generation. It ran fine, but after every wrap-up I had to manually do one more thing — **write the product documents**.

That's where the problem lived. Terminology is *internal* sediment; documents are *external* deliverables. When the order is "extract terminology, then backfill documents," the glossary ends up referencing concepts that aren't finalized yet. By the time the docs are finally written, the glossary is already floating.

The tipping point came during one wrap-up: 40+ glossary entries referenced module names that didn't match the final PRD's naming. Reworking it cost more than starting over.

<div class="callout callout-warning">
<p class="callout-title">The nature of the problem</p>
<p>It wasn't "I forgot to write docs." The <strong>orchestration sequence was wrong</strong>. With no slot for the document stage, a human has to cover the gap — and anything a human has to remember will eventually be missed.</p>
</div>

## 2. Key decision: build a scorecard first, not just start editing

The first decision, and the watershed for everything after: **use darwin-skill's 8-dimension scorecard as an objective baseline instead of editing on feel.**

The reasoning is plain — the biggest risk of subjective revision is complacency. You finish and think "that reads much better," but you don't know *where* it was weak, *how much* it improved, or whether some dimension quietly regressed.

A scorecard makes this measurable: score the baseline, see where the shortfalls cluster, revise deliberately, then re-score. **Keep only score-improving edits; revert anything that drops the score.** That rule is the ratchet, and it guarantees monotonic, non-regressing progress.

<div style="margin: 28px 0; overflow-x: auto;">
<svg viewBox="0 0 680 236" width="100%" role="img" aria-labelledby="ratchet-title-en ratchet-desc-en" xmlns="http://www.w3.org/2000/svg" style="font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Segoe UI', Roboto, sans-serif;">
  <title id="ratchet-title-en">darwin-skill ratchet iteration flow</title>
  <desc id="ratchet-desc-en">Starting from a baseline score of 64.7, one revision round raises it to 92.7, which passes the ratchet check and is kept.</desc>
  <defs>
    <marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <g>
    <rect x="24" y="52" width="140" height="88" rx="10" fill="#f5f5f7" stroke="#d2d2d7" stroke-width="0.5"/>
    <text x="94" y="82" font-size="12.5" fill="#86868b" text-anchor="middle" dominant-baseline="central">Baseline</text>
    <text x="94" y="110" font-size="26" font-weight="500" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">64.7</text>
  </g>

  <line x1="164" y1="96" x2="196" y2="96" stroke="#86868b" stroke-width="1.5" marker-end="url(#ar)"/>

  <g>
    <rect x="196" y="52" width="140" height="88" rx="10" fill="#eef4fd" stroke="#0071e3" stroke-width="0.5"/>
    <text x="266" y="82" font-size="12.5" fill="#0071e3" text-anchor="middle" dominant-baseline="central">Round 1</text>
    <text x="266" y="110" font-size="26" font-weight="500" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">92.7</text>
  </g>

  <line x1="336" y1="96" x2="368" y2="96" stroke="#86868b" stroke-width="1.5" marker-end="url(#ar)"/>

  <g>
    <rect x="368" y="60" width="128" height="72" rx="10" fill="#fff8e6" stroke="#c98f00" stroke-width="0.5"/>
    <text x="432" y="86" font-size="12.5" fill="#96690a" text-anchor="middle" dominant-baseline="central">Ratchet check</text>
    <text x="432" y="108" font-size="12.5" fill="#96690a" text-anchor="middle" dominant-baseline="central">Higher than before?</text>
  </g>

  <line x1="496" y1="80" x2="524" y2="62" stroke="#2f8f5b" stroke-width="1.5" marker-end="url(#ar)"/>
  <text x="536" y="58" font-size="12.5" fill="#2f8f5b" text-anchor="start" dominant-baseline="central">yes → keep</text>

  <line x1="496" y1="112" x2="524" y2="130" stroke="#c0392b" stroke-width="1.5" marker-end="url(#ar)"/>
  <text x="536" y="134" font-size="12.5" fill="#c0392b" text-anchor="start" dominant-baseline="central">no → revert</text>

  <rect x="24" y="176" width="632" height="44" rx="10" fill="#f5f5f7" stroke="#d2d2d7" stroke-width="0.5"/>
  <text x="340" y="190" font-size="12.5" fill="#6e6e73" text-anchor="middle" dominant-baseline="central">Keep condition: score improves</text>
  <text x="340" y="208" font-size="12.5" fill="#6e6e73" text-anchor="middle" dominant-baseline="central">and size stays under 150% of the original</text>
</svg>
</div>

The 64.7 baseline had a tightly clustered set of weaknesses: missing orchestration stage, environment constraints not codified, human gates not explicit. That made the revision direction obvious rather than a matter of "something feels off."

## 3. Decision 2: three stages become four

With the baseline pointing the way, the second decision was the paradigm upgrade — **insert a "product documents" stage at position B, forming A→B→C→D**.

Documents must precede terminology. This isn't folk wisdom; it's a sequencing dependency with clear causality: documents *define* concepts, terminology *explains* them. If the upstream isn't finalized, the downstream necessarily floats.

<div style="margin: 28px 0; overflow-x: auto;">
<svg viewBox="0 0 680 300" width="100%" role="img" aria-labelledby="pipeline-title-en pipeline-desc-en" xmlns="http://www.w3.org/2000/svg" style="font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Segoe UI', Roboto, sans-serif;">
  <title id="pipeline-title-en">Closure orchestration paradigm evolving from three stages to four</title>
  <desc id="pipeline-desc-en">Before: experience extraction, terminology extraction, explainer generation. After: a product documents stage inserted right after experience extraction.</desc>
  <defs>
    <marker id="ar2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <text x="24" y="26" font-size="13" font-weight="500" fill="#86868b" text-anchor="start" dominant-baseline="central">Before · three stages</text>

  <g>
    <rect x="24" y="46" width="150" height="60" rx="10" fill="#f5f5f7" stroke="#d2d2d7" stroke-width="0.5"/>
    <text x="99" y="68" font-size="13" font-weight="500" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">Stage A</text>
    <text x="99" y="88" font-size="12.5" fill="#6e6e73" text-anchor="middle" dominant-baseline="central">Experience</text>
  </g>
  <line x1="174" y1="76" x2="206" y2="76" stroke="#86868b" stroke-width="1.5" marker-end="url(#ar2)"/>
  <g>
    <rect x="206" y="46" width="150" height="60" rx="10" fill="#f5f5f7" stroke="#d2d2d7" stroke-width="0.5"/>
    <text x="281" y="68" font-size="13" font-weight="500" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">Stage C</text>
    <text x="281" y="88" font-size="12.5" fill="#6e6e73" text-anchor="middle" dominant-baseline="central">Terms + gate</text>
  </g>
  <line x1="356" y1="76" x2="388" y2="76" stroke="#86868b" stroke-width="1.5" marker-end="url(#ar2)"/>
  <g>
    <rect x="388" y="46" width="150" height="60" rx="10" fill="#f5f5f7" stroke="#d2d2d7" stroke-width="0.5"/>
    <text x="463" y="68" font-size="13" font-weight="500" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">Stage D</text>
    <text x="463" y="88" font-size="12.5" fill="#6e6e73" text-anchor="middle" dominant-baseline="central">Explainers</text>
  </g>

  <line x1="24" y1="126" x2="656" y2="126" stroke="#d2d2d7" stroke-width="0.5" stroke-dasharray="4 4"/>
  <text x="340" y="126" font-size="12" fill="#86868b" text-anchor="middle" dominant-baseline="central">No document stage → terms reference unfinalized concepts</text>

  <text x="24" y="156" font-size="13" font-weight="500" fill="#0071e3" text-anchor="start" dominant-baseline="central">After · four stages</text>

  <g>
    <rect x="24" y="176" width="144" height="60" rx="10" fill="#eef4fd" stroke="#0071e3" stroke-width="0.5"/>
    <text x="96" y="198" font-size="13" font-weight="500" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">Stage A</text>
    <text x="96" y="218" font-size="12.5" fill="#0071e3" text-anchor="middle" dominant-baseline="central">Experience</text>
  </g>
  <line x1="168" y1="206" x2="192" y2="206" stroke="#0071e3" stroke-width="1.5" marker-end="url(#ar2)"/>
  <g>
    <rect x="192" y="176" width="144" height="60" rx="10" fill="#fff8e6" stroke="#c98f00" stroke-width="0.5"/>
    <text x="264" y="198" font-size="13" font-weight="500" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">Stage B · new</text>
    <text x="264" y="218" font-size="12.5" fill="#96690a" text-anchor="middle" dominant-baseline="central">Product docs</text>
  </g>
  <line x1="336" y1="206" x2="360" y2="206" stroke="#0071e3" stroke-width="1.5" marker-end="url(#ar2)"/>
  <g>
    <rect x="360" y="176" width="144" height="60" rx="10" fill="#eef4fd" stroke="#0071e3" stroke-width="0.5"/>
    <text x="432" y="198" font-size="13" font-weight="500" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">Stage C</text>
    <text x="432" y="218" font-size="12.5" fill="#0071e3" text-anchor="middle" dominant-baseline="central">Terms + gate</text>
  </g>
  <line x1="504" y1="206" x2="528" y2="206" stroke="#0071e3" stroke-width="1.5" marker-end="url(#ar2)"/>
  <g>
    <rect x="528" y="176" width="128" height="60" rx="10" fill="#eef4fd" stroke="#0071e3" stroke-width="0.5"/>
    <text x="592" y="198" font-size="13" font-weight="500" fill="#1d1d1f" text-anchor="middle" dominant-baseline="central">Stage D</text>
    <text x="592" y="218" font-size="12.5" fill="#0071e3" text-anchor="middle" dominant-baseline="central">Explainers</text>
  </g>

  <text x="24" y="264" font-size="12.5" fill="#6e6e73" text-anchor="start" dominant-baseline="central">Docs define concepts → terms explain concepts.</text>
  <text x="24" y="284" font-size="12.5" fill="#6e6e73" text-anchor="start" dominant-baseline="central">After adding stage B, all 40+ glossary entries landed on finalized naming.</text>
</svg>
</div>

### Locking down stage B's templates

A stage's position isn't enough — without fixed templates, every wrap-up drifts structurally. The hidden requirement of templating is that the structure emerges on its own.

**PRD — seven sections**

1. Product positioning
2. Target audience
3. System architecture
4. Modules and fields
5. Non-functional rules
6. Design paradigm
7. Acceptance criteria

**Roadmap — four sections**

| Section | Content | Key constraint |
|---|---|---|
| Milestones | Phased goals and deliverables | Every item must be verifiable |
| Status | Current progress snapshot | Kept in sync with the repo |
| Backlog | P0 / P1 / P2 tiers | P0 must state its blocker |
| Risks | Identified risks and responses | Each needs an owner and trigger |

**MOC — four-part form**

Overview → core docs → related experience → related terminology and explainers, **attached to the parent index at `生成工作/MOC.md`**. This step can't be skipped — an unattached project MOC is an island, invisible to the Dataview rollup.

## 4. Decision 3: write the sandbox pitfalls into the Skill

The third decision is the least glamorous but the most immediately useful: **codify the environment pitfalls I'd actually hit into a "constraints table."**

Without codifying them, I'd hit them again every time. And I had already hit these more than once:

| Symptom | Root cause | Response |
|---|---|---|
| Directory won't delete; repeated `rm` fails | safe-delete sandbox blocks it, trash unavailable, fail-closed | Don't force-delete; `mv` it to a `_stale_` prefix |
| Explainer script fails to create directories; all terms float | Dimension title contains `/` (e.g. "Apple Design / Motion"); the script reads it as a path separator | Ban `/` in titles; use concatenation or "and" |
| Index pages always missing entries | Manual rollup breaks down as entries grow | OPA MOC auto-rolls `type: opa-entry` via Dataview; never hand-edit |

That second row is especially telling — `/` is legal inside a filename but semantically a separator in a path. When a script parses by path, a perfectly reasonable-looking title bends the entire directory tree.

## 5. Decision 4: making human gates explicit

Fourth decision: **add a checkpoint list that writes the "must be human-confirmed" points directly into the orchestration.**

The most common failure for an autonomous orchestration Skill isn't lack of capability — it's **skipping the moments where you should stop and ask**. So gates can't rely on "remembering":

- **Stage 0** — status judgment (is the project actually done)
- **Stage A** — category confirmation (which project category this belongs to)
- **Stage B** — document acceptance (do PRD/Roadmap/MOC meet the bar)
- **Stage C Step 4** — human gate (mandatory before terminology enters the glossary)
- **Stage D Step 5** — spot check (sample-verify explainer output)

<div class="callout callout-tip">
<p class="callout-title">Designing gates</p>
<p>A gate must sit <strong>on the flow's mandatory path</strong>, not in a footnote. A rule in a footnote is not a rule.</p>
</div>

## 6. Implementation and three classes of problems

The chain: load darwin-skill → read `SKILL.md` and `references/subskill-contracts.md` → back up `SKILL.md.bak` → baseline score (64.7) → revise to four stages → Round 1 re-score (92.7) → ratchet keep.

Three problems, each with a countermeasure:

| # | Problem | Countermeasure | Result |
|---|---|---|---|
| 1 | Dimension titles with `/` broke directory creation | Ban `/`; use concatenation or "and" | Directory creation restored |
| 2 | safe-delete blocked; leftovers undeletable | `mv` to a `_stale_` prefix instead | Isolated, no more deadlock |
| 3 | Revision risked bloat, diluting readability | Set a 150% size ceiling as a keep condition | 11,473 bytes < 11,553 ceiling |

The third countermeasure deserves unpacking. **A scorecard governs quality, not cost** — judging by score alone, a Skill grows ever fatter until readability suffers. So I added a size ceiling to the keep conditions: the final 11,473 bytes landed under the 11,553 ceiling, on target and unbloated.

## 7. Results

| Metric | Before | After |
|---|---|---|
| Orchestration paradigm | Three stages A→C→D | Four stages A→B→C→D |
| darwin-skill score | 64.7 | **92.7** (bar is ≥90) |
| Environment constraints | none | 3 measured pitfalls codified |
| Human gates | implicit | 5 checkpoints made explicit |
| Size | 11,473 bytes | 11,473 bytes (ceiling 11,553) |

Three deliverables: `收尾总编skill/SKILL.md` (v2), `test-prompts.json` (4 cases), and `results.tsv` (the optimization trail).

## 8. Four reusable conclusions

<div class="callout callout-tip">
<p class="callout-title">The distilled methodology</p>
<p>1. <strong>Build an objective scorecard + ratchet before optimizing a Skill</strong> — more controllable, reproducible, and non-regressing than editing on feel.</p>
<p>2. <strong>An orchestration Skill must hard-code "sub-Skill sequencing + human gates + landing-point mapping,"</strong> or autonomous runs will skip steps.</p>
<p>3. <strong>Documents precede terminology</strong> (A→B→C→D): documents are external deliverables, terminology is internal sediment; only finalized upstream keeps the downstream from floating.</p>
<p>4. <strong>Sandbox pitfalls must be codified into the constraints table,</strong> or you'll repeat them every time.</p>
</div>

<div class="callout callout-warning">
<p class="callout-title">Four pitfalls to avoid</p>
<p>Using <code>/</code> in a glossary dimension title → directory creation fails, everything floats.</p>
<p>Repeatedly <code>rm</code>-ing a blocked leftover directory → fail-closed deadlock; use <code>mv</code> isolation instead.</p>
<p>Skipping stage C's human gate to write terminology directly → noise pollutes the glossary.</p>
<p>Optimizing for score alone, ignoring size → bloat dilutes readability; add a size ceiling as backup.</p>
</div>

The fourth point bears emphasis. The ratchet guarantees "no regression," but "no bloat" is a separate constraint — both must hold simultaneously for a Skill to stay healthy over the long run.
