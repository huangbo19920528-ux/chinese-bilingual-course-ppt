import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { FileBlob, PresentationFile } from "@oai/artifact-tool";

function option(name, fallback = "") {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function clean(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function hasChinese(value) {
  return /[\u3400-\u9fff]/u.test(value);
}

function hasEnglish(value) {
  return /[A-Za-z]{2,}/u.test(value);
}

function fontSizes(element) {
  return (element.paragraphs ?? [])
    .flatMap((paragraph) => paragraph.runs ?? [])
    .map((run) => Number(run.fontSize))
    .filter((value) => Number.isFinite(value) && value > 0);
}

function colors(element) {
  return (element.paragraphs ?? [])
    .flatMap((paragraph) => paragraph.runs ?? [])
    .map((run) => clean(run.color).replace(/^#/, "").toUpperCase())
    .filter(Boolean);
}

function mainText(layout) {
  const elements = (layout.elements ?? []).filter(
    (element) =>
      element.scope === "slide" &&
      element.kind === "shape" &&
      clean(element.text) &&
      Array.isArray(element.bbox),
  );
  const title = elements
    .filter((element) => element.bbox[1] < 160)
    .sort((a, b) => a.bbox[1] - b.bbox[1])[0];
  const body = elements
    .filter(
      (element) =>
        element !== title &&
        element.bbox[1] >= 125 &&
        element.bbox[2] >= 250 &&
        element.bbox[3] >= 80,
    )
    .sort((a, b) => b.bbox[2] * b.bbox[3] - a.bbox[2] * a.bbox[3])[0];
  return { title, body };
}

const pptxPath = option("pptx");
const outPath = option("out");
const renderDir = option("render-dir");
if (!pptxPath || !outPath) {
  throw new Error(
    "Usage: node audit-course-deck.mjs --pptx deck.pptx --out report.json [--render-dir folder]",
  );
}

await fs.mkdir(path.dirname(outPath), { recursive: true });
if (renderDir) await fs.mkdir(renderDir, { recursive: true });

const presentation = await PresentationFile.importPptx(
  await FileBlob.load(pptxPath),
);
const notesBySlide = new Map();
const notesInspection = await presentation.inspect({
  kind: "notes",
  include: "slide,text",
  maxChars: 1000000,
});
for (const line of String(notesInspection.ndjson ?? "").split(/\r?\n/)) {
  if (!line.trim()) continue;
  const record = JSON.parse(line);
  if (Number.isFinite(Number(record.slide))) {
    notesBySlide.set(Number(record.slide), clean(record.text));
  }
}
const result = {
  file: pptxPath,
  slideCount: presentation.slides.items.length,
  summary: {
    bilingualCoreSlides: 0,
    slidesWithNotes: 0,
    slidesWithSources: 0,
    videoSlides: 0,
    slidesWithImages: 0,
    warnings: 0,
    highSeverity: 0,
  },
  slides: [],
};

for (let index = 0; index < presentation.slides.items.length; index += 1) {
  const slideNumber = index + 1;
  const slide = presentation.slides.getItem(index);
  const layout = JSON.parse(await (await slide.export({ format: "layout" })).text());
  const { title, body } = mainText(layout);
  const titleText = clean(title?.text);
  const bodyText = clean(body?.text);
  const visibleText = clean(
    (layout.elements ?? [])
      .filter((element) => element.scope === "slide")
      .map((element) => element.text)
      .join(" "),
  );
  const notesText = notesBySlide.get(slideNumber) ?? "";
  const images = (layout.elements ?? []).filter(
    (element) => element.scope === "slide" && element.kind === "image",
  ).length;
  const bodySizes = fontSizes(body ?? {});
  const minimumBodySize = bodySizes.length ? Math.min(...bodySizes) : null;
  const titleColors = colors(title ?? {});
  const isVideo =
    /视频|video/i.test(titleText) ||
    /before watching|观看前|while watching|观看中/i.test(visibleText);
  const isCore =
    slideNumber > 1 &&
    !isVideo &&
    !/目录|contents|lesson map|学习目标|learning outcomes/i.test(titleText);
  const bilingual = hasChinese(visibleText) && hasEnglish(visibleText);
  const titleBodyGap =
    title?.bbox && body?.bbox
      ? Math.round(body.bbox[1] - (title.bbox[1] + title.bbox[3]))
      : null;
  const issues = [];

  if (isCore && !bilingual) {
    issues.push({ severity: "medium", code: "CORE_NOT_BILINGUAL" });
  }
  if (!notesText) {
    issues.push({ severity: "high", code: "MISSING_NOTES" });
  } else if (!/\[Sources\]/i.test(notesText)) {
    issues.push({ severity: "medium", code: "MISSING_SOURCES" });
  }
  if (minimumBodySize !== null && minimumBodySize < 24 && !isVideo) {
    issues.push({
      severity: minimumBodySize < 20 ? "high" : "medium",
      code: "SMALL_BODY_TEXT",
      value: minimumBodySize,
    });
  }
  if (slideNumber > 1 && titleBodyGap !== null && titleBodyGap > 95) {
    issues.push({
      severity: "medium",
      code: "LARGE_TITLE_BODY_GAP",
      value: titleBodyGap,
    });
  }
  if (
    titleColors.some((color) => /^(C00000|FF0000|E74C3C|D32F2F)$/.test(color))
  ) {
    issues.push({ severity: "medium", code: "DEFAULT_RED_TITLE" });
  }

  if (bilingual && isCore) result.summary.bilingualCoreSlides += 1;
  if (notesText) result.summary.slidesWithNotes += 1;
  if (/\[Sources\]/i.test(notesText)) result.summary.slidesWithSources += 1;
  if (isVideo) result.summary.videoSlides += 1;
  if (images) result.summary.slidesWithImages += 1;
  result.summary.warnings += issues.length;
  result.summary.highSeverity += issues.filter(
    (issue) => issue.severity === "high",
  ).length;

  result.slides.push({
    slide: slideNumber,
    title: titleText,
    bilingual,
    isCore,
    isVideo,
    imageCount: images,
    minimumBodySize,
    titleBodyGap,
    notes: Boolean(notesText),
    sources: /\[Sources\]/i.test(notesText),
    issues,
  });

  if (renderDir) {
    const blob = await presentation.export({ slide, format: "png", scale: 1 });
    await fs.writeFile(
      path.join(renderDir, `slide-${String(slideNumber).padStart(2, "0")}.png`),
      new Uint8Array(await blob.arrayBuffer()),
    );
  }
}

await fs.writeFile(outPath, JSON.stringify(result, null, 2), "utf8");
process.stdout.write(`${JSON.stringify(result.summary)}\n`);

