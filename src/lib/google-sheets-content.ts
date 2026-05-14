import { defaultSiteContent, type SiteContent } from '@/lib/site-data';

const sheetId = '19NGtZ7wPlUx3iBxSleDFsd46BwPIzIB-NDJy2Zc1RBg';
const defaultSheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

function parseCsv(csv: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = '';
  let inQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];
    const next = csv[index + 1];

    if (character === '"' && inQuotes && next === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') {
      inQuotes = !inQuotes;
    } else if (character === ',' && !inQuotes) {
      row.push(value);
      value = '';
    } else if ((character === '\n' || character === '\r') && !inQuotes) {
      if (character === '\r' && next === '\n') {
        index += 1;
      }
      row.push(value);
      rows.push(row);
      row = [];
      value = '';
    } else {
      value += character;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  return rows.filter((item) => item.some((cell) => cell.trim()));
}

function parseValue(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
    trimmed === 'true' ||
    trimmed === 'false'
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}

function setByPath(target: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split('.').filter(Boolean);

  if (parts.length === 0) {
    return;
  }

  let current = target;
  parts.slice(0, -1).forEach((part) => {
    if (!current[part] || typeof current[part] !== 'object') {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  });

  current[parts[parts.length - 1]] = value;
}

function cloneDefaultContent() {
  return structuredClone(defaultSiteContent) as SiteContent;
}

export async function getSiteContent(): Promise<SiteContent> {
  const content = cloneDefaultContent();
  const csvUrl = process.env.GOOGLE_SHEET_CSV_URL || defaultSheetUrl;

  try {
    const response = await fetch(csvUrl, { next: { revalidate: 300 } });
    const csv = await response.text();

    if (!response.ok || !csv.trim()) {
      return content;
    }

    const [header, ...rows] = parseCsv(csv);
    const keyIndex = header.findIndex((cell) => cell.trim().toLowerCase() === 'key');
    const valueIndex = header.findIndex((cell) => cell.trim().toLowerCase() === 'value');

    if (keyIndex === -1 || valueIndex === -1) {
      return content;
    }

    rows.forEach((row) => {
      const key = row[keyIndex]?.trim();
      const value = row[valueIndex];

      if (!key || typeof value === 'undefined') {
        return;
      }

      setByPath(content as unknown as Record<string, unknown>, key, parseValue(value));
    });

    return content;
  } catch (error) {
    console.warn('Google Sheets content unavailable, using fallback content.', error);
    return content;
  }
}
