// 版本号单一事实源：仓库根目录的 VERSION 文件（构建期读取）。
//
// 维护约定（2026-10-09 起）：
//   1. 版本号只改 <仓库根>/VERSION 一处；
//   2. 页脚（Footer.astro 的 `v{SITE_VERSION}`）自动跟随；
//   3. 同步登记「版本迭代台账.md」，页脚与台账从此不再双轨漂移。
//
// 版本号规则见《项目收尾标准工作流程-执行清单》§4.8：
//   基准 1.0.0；改动 ≤30% → PATCH；30%<x≤50% → MINOR；>50% → MAJOR。
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function readSiteVersion(): string {
  // astro build / preview / dev 的 cwd 均为仓库根目录
  try {
    return readFileSync(resolve(process.cwd(), 'VERSION'), 'utf-8').trim();
  } catch {
    // 兜底：读取失败也不阻断构建，便于在非常规工作目录下调试
    return '0.0.0';
  }
}

export const SITE_VERSION: string = readSiteVersion();
