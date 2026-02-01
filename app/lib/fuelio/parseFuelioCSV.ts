import { parse } from "csv-parse/sync";

export function parseFuelioSection(csvText: string, sectionName: string) {
  const rawLines = csvText.replace(/\r\n/g, "\n").split("\n");

  const sectionIndex = rawLines.findIndex((line) => {
    const cleaned = line
      .replace(/^\uFEFF/, "")
      .trim()
      .replace(/^"+|"+$/g, "");

    return cleaned === `## ${sectionName}`;
  });

  if (sectionIndex === -1) {
    return [];
  }

  const csvLines: string[] = [];

  for (let i = sectionIndex + 1; i < rawLines.length; i++) {
    const line = rawLines[i];

    const cleaned = line
      .replace(/^\uFEFF/, "")
      .trim()
      .replace(/^"+|"+$/g, "");

    if (cleaned.startsWith("## ")) break;
    if (!cleaned) continue;

    csvLines.push(line);
  }

  if (!csvLines.length) return [];

  return parse(csvLines.join("\n"), {
    columns: true,
    skip_empty_lines: true,
    delimiter: ",",
    quote: '"',
    trim: true,
  });
}

type SectionRows = Record<string, any[]>;

export function parseFuelioCsvBySections(
  csvText: string,
  sectionDelimiter = "## "
): SectionRows {
  const lines = csvText.replace(/\r\n/g, "\n").split("\n");

  const sections: Record<string, string[]> = {};
  let currentSection: string | null = null;

  for (const rawLine of lines) {
    const cleaned = rawLine
      .replace(/^\uFEFF/, "")
      .trim()
      .replace(/^"+|"+$/g, "");

    if (cleaned.startsWith(sectionDelimiter)) {
      currentSection = cleaned.slice(sectionDelimiter.length).trim();
      sections[currentSection] = [];
      continue;
    }

    if (!cleaned || !currentSection) continue;

    sections[currentSection].push(rawLine);
  }

  const result: SectionRows = {};

  for (const [sectionName, csvLines] of Object.entries(sections)) {
    if (!csvLines.length) {
      result[sectionName] = [];
      continue;
    }

    result[sectionName] = parse(csvLines.join("\n"), {
      columns: true,
      skip_empty_lines: true,
      delimiter: ",",
      quote: '"',
      trim: true,
    });
  }

  return result;
}
