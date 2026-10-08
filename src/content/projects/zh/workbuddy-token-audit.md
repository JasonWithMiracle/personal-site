---
title: WorkBuddy Token 审计工具
lang: zh
summary: 解析 WorkBuddy 本地请求日志，按任务/会话维度核算 Token 消耗与成本，支持分时与分段计价。
tags: [Python, 成本分析, 工具开发]
cover: /covers/workbuddy-token-audit.png
repo: JasonWithMiracle/workbuddy-token-audit
role: 独立开发
year: 2026
featured: true
order: 1
github: "https://github.com/JasonWithMiracle/workbuddy-token-audit"
stars: 0
language: "Python"
updated: "2026-09-20"
---

用 AI 干活久了，最说不清的一个问题是：**这笔活到底烧了多少 token、值多少钱**。UI 上只能看到额度，看不到明细，更没法按任务归因。

## 要解决什么

把「额度」翻译回「成本」，并且能回答三个问题：

- 一次任务烧了多少 token？
- 其中有多少是缓存命中（这部分便宜得多）？
- 自动化任务和人工任务各占多少？

## 怎么做的

数据源全部在本地，不依赖任何第三方服务：

- 请求级 token：读会话日志里的 `rawUsage`，拿到 prompt / completion / 缓存命中 / 推理 token；子代理日志按目录归属回溯到父会话。
- 任务元数据：从本地 SQLite 读会话标题、工作目录、模型，以及「是否为自动化任务」标记。
- 计价：按厂商真实档位分三档（非缓存 / 缓存命中 / 缓存写入），并对有峰谷价的模型按时间和节假日判档。

## 关键发现

实测下来，本机的缓存命中率超过 95%。这意味着如果按通用的「输入 / 输出」两档价粗算，成本会被高估七成左右——**分档计价不是优化项，而是准确性前提**。

## 现在的能力

三种用法共用同一份价目表，不会出现两套价格：

- 实测审计：扫历史日志，出真实消耗报表
- 交互看板：按会话/任务维度浏览
- 环节预估：开工前估算这一步大概要花多少

> 工具本身只依赖 Python 标准库，克隆下来就能跑。
