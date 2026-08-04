---
title: "WorkBuddy×墨刀 需求-原型全链路打通 经验总结"
lang: zh
summary: "通过墨刀官方 Streamable HTTP MCP + WorkBuddy 编排 SKILL，把需求提交→拆解→搭框架→墨刀原型生成四步全自动打通；令牌已配置并端到端验证"
project_category: "工具链开发"
work_type: "MCP集成"
date: "2026-07-31"
tags: ["opa", "工具链开发", "MCP集成", "墨刀", "WorkBuddy"]
has_diagrams: undefined
order: 2
status: "published"
draft: false
---


## 〇、可视化辅助图表
<div class="mermaid">
flowchart TD
    A[① 需求提交&lt;br/&gt;requirements.md] --&gt; B[② 需求拆解&lt;br/&gt;子任务/功能点/原型页清单+modao_prompt]
    B --&gt; C[③ 搭建项目框架&lt;br/&gt;decomposition/pages.json/源码骨架]
    C --&gt; D[④ 调用墨刀 MCP&lt;br/&gt;generate_html/generate_react]
    D --&gt; E[墨刀云端异步生成&lt;br/&gt;返回 task_id]
    E --&gt; F[get_task_result 轮询&lt;br/&gt;取 preview_url/task_url]
    F --&gt; G[⑤ 交付汇总&lt;br/&gt;modao-pages.md 页面→墨刀链接]
</div>
> 关键：墨刀生成为异步，`generate_*` 返回 task_id 后用 `get_task_result` 轮询。

## 一、背景描述
- 目标：把"WorkBuddy 提交需求 → 拆解 → 搭框架 → 墨刀自动出原型"做成可复用自动化。
- 背景：用户要求打通 WorkBuddy 与墨刀（MockingBot）。
- 产出：mcp.json 的 modao 条目 + 编排 SKILL（modao-product-workflow）+ 端到端验证。
- 规模：跨 WorkBuddy 配置、SKILL、外部墨刀 MCP 三处。

## 二、关键决策点
- 用墨刀官方 MCP 而非自研 API：墨刀已提供 Streamable HTTP MCP（https://modao.cc/agent-py/ai/mcp），免逆向、免 SDK。
- Streamable HTTP + header 鉴权（modao-token）而非本地 npx：配置最简，且支持 OAuth 备选。
- 编排用 SKILL 而非脚本：可跨项目复用、对话中按需触发、内置 MCP 连通校验。

## 三、实施过程
1. 调研确认墨刀官方 MCP 存在及工具集。
2. mcp.json 的 mcpServers 合并 modao 条目（type:http, url, headers.modao-token）。
3. 新建用户级 SKILL modao-product-workflow，定义四阶段编排。
4. 用户提供的令牌写入配置；urllib 探测端点 + initialize + tools/list 成功（server modao-agent-py v3.4.2）。
5. 端到端冒烟测试：generate_html 生成"移动端登录页"，立即返回 completed 及 preview_url/task_url，真实可预览。

## 四、最终成果
- 交付：mcp.json（含 modao，令牌已填）+ SKILL.md（含真实工具名与异步轮询模式）。
- 四阶段链路在 SKILL 内闭环；令牌已验证可用；真实墨刀原型已生成成功。
- 待办：用户需在 WorkBuddy「连接器」信任/启用 modao（或重启以重载 mcp.json），使 mcp__modao__* 工具在本会话可用，之后即可用 SKILL 跑真实需求。

## 五、遇到的问题及解决方案
- mcp.json 的 Edit 因未先 Read 被拒 → 先 Read 再 Edit。
- 内联 python 因路径含 '（Jason's）被 bash 引号打断 → 改为写脚本文件再执行。
- 文档工具名与实际不一致（html_import vs import_to_proto；生成为异步）→ 以 tools/list 实测 schema 为准修正 SKILL。

## 六、经验教训与最佳实践
<div class="callout callout-tip">
<p class="callout-title">最佳实践</p>
> 接入第三方 AI 能力优先查官方 MCP；墨刀/asta 等均用 `type:http + url + headers` 的 Streamable HTTP 形态，WorkBuddy 原生支持。
> 调用墨刀生成务必按异步处理：generate_* 拿 task_id → get_task_result 轮询（~300s）→ 取 preview_url/task_url。
<div class="callout callout-warning">
<p class="callout-title">踩坑预警</p>
> 不要把明文令牌硬编码进共享仓库；优先 OAuth 或 `${ENV}` 展开。文档/博客的工具名可能过时，以 `tools/list` 实测为准。

## 七、关联资产
- 配置：~/.workbuddy/mcp.json 的 modao 条目
- 编排：~/.workbuddy/skills/modao-product-workflow/SKILL.md
- 验证产物（示例）：墨刀登录页原型 preview_url（见工作日志）
- 返回 工作经验库总览
