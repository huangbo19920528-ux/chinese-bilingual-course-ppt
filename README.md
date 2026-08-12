# Chinese Bilingual Course PPT

面向中国高校双语专业课程的 Codex Skill，用于创建、修订和审计可编辑的 PowerPoint 授课课件。

This Codex skill creates, revises, and audits editable PowerPoint courseware for bilingual professional courses in Chinese universities.

## 适用场景

- 教材同步的专业英语或双语课程课件
- 中国本科生需要中文辅助的工程类课程
- 面向教室投影的大字号、较充实页面
- 短视频候选、观看任务和逐页教师备注
- 全套PPT的双语、排版、视频、备注与来源审计

## 核心原则

1. 当前教师要求与指定教材优先于通用设计潮流。
2. 大多数知识页同时呈现英文和中文，但避免两段机械重复。
3. 教材段落截图优先转换成可编辑文字。
4. 标题与导航默认使用蓝色，红色只用于警示或明确对比。
5. 正文通常不低于24 px，并针对课堂投影检查可读性。
6. 图片用于补充真实工程语境，不得遮挡教学文字。
7. 每讲准备约8—10个独立视频候选页，每页包含观看前、观看中和观看后任务。
8. 每页备注包含可直接讲的话、课堂操作、时间建议、板书提示和来源。
9. 修改后逐页渲染，并检查溢出、重叠、双语覆盖和整体视觉节奏。
10. 最终PPT保持可编辑，不输出为整页图片。

## Repository structure

```text
.
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
│   ├── course-design-rules.md
│   ├── qa-checklist.md
│   └── research-basis.md
└── scripts/
    └── audit-course-deck.mjs
```

## Installation

将本仓库克隆或复制到个人 Codex Skills 目录：

```text
~/.codex/skills/chinese-bilingual-course-ppt
```

重新启动或刷新 Codex 后，可在任务中使用：

```text
$chinese-bilingual-course-ppt
```

示例：

```text
使用 $chinese-bilingual-course-ppt，按照教材、双语教学和课堂投影要求，复核并更新这套授课PPT。
```

## Audit script

`scripts/audit-course-deck.mjs` 用于检查：

- 双语核心页面覆盖
- 演讲者备注与 `[Sources]` 来源块
- 视频候选页数量
- 正文字号
- 标题与正文间距
- 红色标题误用
- 图片分布情况

该脚本需要在安装了 `@oai/artifact-tool` 的演示文稿工作区中运行。

## Scope and copyright

本仓库只包含可复用的工作流、规则与审计脚本，不包含教材原文、授课PPT、教学视频或受版权保护的课程资源。

This repository contains only reusable workflow instructions and auditing utilities. It does not include textbooks, course decks, videos, or copyrighted teaching assets.


