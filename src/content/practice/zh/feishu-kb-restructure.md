---
title: "飞书知识库重构与 WIKI-SCHEMA 建立 经验总结"
lang: zh
summary: "飞书知识库重构与 WIKI-SCHEMA 建立 · 经验总结"
project_category: "飞书知识库重构"
work_type: "架构选型"
date: "2026-07-30"
tags: ["opa", "飞书知识库重构", "知识管理", "架构选型", "最佳实践"]
has_diagrams: undefined
order: 1
status: "published"
draft: false
---


## 一、背景描述
原来散落在飞书云文档里的资料越攒越多，检索和复用都很费劲。2026-07-27 起把这些内容系统性地搬进本地 Obsidian vault（`本地 Obsidian vault`），并定下一套长期维护规范。目标只有一个：让知识能持续积累、随时找回，而不是搬完就荒着。

## 二、关键决策点
- **源文档与知识库分层（`raw/` vs `wiki/`）。** 飞书导出原文进 `raw/`（只读、永不改），LLM 提炼页进 `wiki/`。理由：源是事实来源，不能越改越失真；知识库要能反复重写而不污染原始记录。备选：混在一起（被否，后期分不清哪句是原文哪句是总结）。
- **单独建 `report/` 收过程产物。** 检查/校对/核对类临时报告和辅助 JSON 统一归档，不进知识库正文。理由：这些文件只在本地、不出现在飞书树，靠「本地有、飞书无」的差集即可识别，挪走不影响图谱。
- **frontmatter + Dataview 代替手工索引。** 每页带结构化元数据，索引页用 Dataview 查询自动生成。理由：条目多了手工维护索引必漏，自动化汇总零成本。
- **图表统一用 Mermaid。** Obsidian 原生渲染、不引插件。理由：可版本化、可 diff、可导出。

## 三、实施过程
1. 建目录骨架：`raw/`（原始）、`wiki/`（知识库）、`report/`（过程产物）、`WIKI-SCHEMA.md`（规范）。
2. 写 `WIKI-SCHEMA.md`：定层级架构、页面类型、交叉引用规则、frontmatter 标准、标签体系、图表规范、摄入/查询/Lint 工作流。
3. 用飞书 API 把「产品与市场」空间 54 篇文档全量导入 `raw/08-产品与市场/`，再生成 54 篇 `wiki/` 提炼页，建立 218+ 条交叉引用。
4. 写 `diff_local_feishu.py` 做本地树 ↔ 飞书树差集检测，识别应归档的过程产物。
5. 几轮复盘/Lint：修 `<cite>` 串联链接、归并检查报告、消灭死链。

<div class="mermaid">
flowchart TD
    A[飞书云文档] --&gt; B[API 全量导入 raw/]
    B --&gt; C[LLM 提炼 wiki/ 页面]
    C --&gt; D[WIKI-SCHEMA 规范约束]
    D --&gt; E[Dataview 自动索引]
    D --&gt; F[Mermaid 图表]
    D --&gt; G[report/ 收过程产物]
    C --&gt; H[Lint: 死链/过时/孤立页]
</div>

## 四、最终成果
- 一个 329 篇笔记、结构清晰、可检索的个人知识库。
- `WIKI-SCHEMA.md` 成为后续所有主题库（工程经验、工具与自动化等）共同遵守的规范。
- 导入 + 提炼 + 差集检测 + Lint 形成可复用闭环，新资料进来能快速归位。

## 五、经验教训
- **原始资料不可变**是底线：源文档只读，所有加工都在 `wiki/` 发生，知识才不会越攒越乱。
- **LLM 拥有 wiki、用户阅读**：把提炼/维护/交叉引用交给 LLM 常态做，人只消费，雪球才滚得起来。
- **过程产物别混进正文**：`report/` 的隔离让知识库图谱保持干净，检索不被噪声干扰。
- **frontmatter 纪律决定上限**：写齐 `type/status/tags/related`，Dataview 和 Lint 才跑得动。

## 六、参见
- WIKI-SCHEMA、组织过程资产/MOC、飞书主文档串联链接cite修复、工作经验库总览
