---
name: chinese-bilingual-course-ppt
description: Create, revise, and audit editable PowerPoint courseware for Chinese university bilingual professional courses. Use when the user needs textbook-aligned bilingual PPTX, technical English courseware, projection-readable classroom slides, short instructional-video candidates, detailed speaker notes, or whole-deck visual QA. Especially suitable for engineering courses whose students need Chinese scaffolding alongside English terminology and sentences.
---

# Chinese Bilingual Course PPT

Build teaching decks that are easy for Chinese undergraduates to follow, easy for the lecturer to teach from, and faithful to the assigned textbook.

## Required companion workflow

Use the `presentations` skill for all PPTX reading, editing, rendering, and export. Treat an accepted existing deck as the visual template. Read these references before planning or editing:

- `references/course-design-rules.md`
- `references/qa-checklist.md`
- `references/research-basis.md`

For an existing course, inspect the textbook, schedule, accepted decks, related past decks, videos, and assets before changing anything.

## Priority order

Resolve conflicts in this order:

1. The current user request.
2. The assigned textbook and official teaching schedule.
3. The teacher's accepted slides and repeated feedback.
4. Instructor-provided related courseware and media.
5. External teaching advice and generic presentation conventions.

Do not replace the course with a visually fashionable but textbook-inconsistent presentation.

## Build the lesson as a learning sequence

For a 90-minute lesson, normally arrange the core teaching slides in this order:

1. A question, photo, engineering situation, or brief retrieval prompt.
2. Learning outcomes and the textbook map.
3. Core terms and paired bilingual concepts.
4. Textbook close reading or sentence decoding.
5. Mechanism, process, comparison, or application.
6. Short video pages distributed near the concepts they support.
7. Guided output: translation, explanation, discussion, or problem.
8. A smart-construction or current-practice extension when relevant.
9. Retrieval and an explicit bilingual takeaway.

Use informative titles that reveal the page's teaching job. When read in order, the titles should form a coherent lesson outline.

## Keep the textbook visible

Preserve the unit order, terminology, definitions, and central examples. Convert useful textbook screenshots into editable text rather than leaving large photographic screenshots of paragraphs. Mark enrichment material as an extension so students can distinguish required content from supplementary material.

## Design for a Chinese bilingual classroom

- Show Chinese and English together on most knowledge-bearing pages.
- Keep technical English exact; use Chinese to explain logic, meaning, and common misunderstanding.
- Use short paired structures, not two long parallel essays.
- Introduce terms before asking students to process dense sentences.
- Capitalize English slide titles and labels consistently, except when grammar or source text requires otherwise.
- Use direct, classroom-ready phrasing.

## Design for projection

- Use the accepted deck's theme and rhythm.
- Prefer blue for titles and navigation. Reserve red for warnings, errors, or deliberate contrast.
- Aim for 32–42 px titles and 24–28 px main body text; secondary labels may be smaller but should remain legible.
- Keep the title-to-body gap compact and consistent.
- Before reducing font size, enlarge the textbox, improve spacing, shorten repetition, or split the page.
- Increase line spacing on sparse text pages so the content occupies the usable area naturally.
- Avoid first-line indentation when it creates a ragged or uneven visual edge.
- Never place an image over instructional text.
- Use authentic, relevant photos or diagrams to enrich genuine blank space; do not add decorative filler.

## Use video as instruction, not decoration

For a two-period lesson, provide about 8–10 separate candidate video pages, normally one candidate per page. Prefer videos of eight minutes or less; otherwise specify a useful excerpt.

Each video page should contain:

- bilingual title;
- platform, duration, and clickable source link;
- local-file placeholder or backup link when available;
- three preview keywords;
- a question before viewing;
- a focused task during viewing;
- a brief output after viewing.

Place candidate pages near the related concept instead of collecting all videos at the end. Do not claim a video is downloadable, licensed, or subtitled unless verified.

## Write speaker notes for every slide

Notes must reduce preparation time, not merely repeat visible text. Include:

- a natural talk track the teacher can say directly;
- the intended student action or question;
- an approximate time;
- a board-writing or emphasis cue when useful;
- a `[Sources]` block with textbook, image, video, or external-source provenance.

Keep sources in the notes rather than crowding the slide.

## Edit and verify

Use `@oai/artifact-tool` JavaScript to edit PPTX. Preserve theme, master layouts, slide order, hyperlinks, media, and notes unless the user asks otherwise.

After each substantial edit:

1. Export layout JSON and rendered PNG for every slide.
2. Run `scripts/audit-course-deck.mjs`.
3. Inspect every changed slide at full size and review the whole-deck montage.
4. Check overflow, overlap, clipping, font consistency, title-body spacing, image occlusion, bilingual coverage, video links, notes, and sources.
5. Run the presentation package test from the `presentations` skill.
6. Repeat until the report contains no unresolved high-severity issue.

The final PPTX must remain editable. Do not deliver an image-only slide deck.


