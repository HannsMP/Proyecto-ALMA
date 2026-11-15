import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { BOM_UNIT_COSTS, CANVAS_BLOCKS, VALUE_CHAIN } from '../data/almaT3Content';
import type { RolePresentationDeck } from '../data/presentationsData';
import { COURSE_METADATA } from '../data/teamMembers';

// ============================================================================
// 1. DESCARGA GENÉRICA EN NAVEGADOR
// ============================================================================
function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  triggerBlobDownload(blob, filename);
}

export function downloadCsvFile(
  filename: string,
  headers: string[],
  rows: Array<Array<string | number>>,
): void {
  const escapeCell = (val: string | number) => {
    const str = String(val ?? '');
    if (/[",\n\r;]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const lines = [headers.map(escapeCell).join(','), ...rows.map((r) => r.map(escapeCell).join(','))];
  // BOM UTF-8 para compatibilidad directa con Microsoft Excel en español
  const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  triggerBlobDownload(blob, filename);
}

export function downloadDataUrlPng(filename: string, dataUrl: string): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ============================================================================
// 2. EXPORTACIÓN EXCEL (.XLSX) MULTI-HOJA CON SHEETJS
// ============================================================================
export interface ExcelSheetSpec {
  name: string;
  headers: string[];
  rows: Array<Array<string | number>>;
  colWidths?: number[];
}

export function downloadExcelWorkbook(filename: string, sheets: ExcelSheetSpec[]): void {
  const wb = XLSX.utils.book_new();
  for (const sheet of sheets) {
    const aoa: Array<Array<string | number>> = [sheet.headers, ...sheet.rows];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    if (sheet.colWidths && sheet.colWidths.length > 0) {
      ws['!cols'] = sheet.colWidths.map((wch) => ({ wch }));
    } else {
      ws['!cols'] = sheet.headers.map((h, colIdx) => {
        const maxLen = Math.max(
          h.length,
          ...sheet.rows.map((r) => String(r[colIdx] ?? '').length),
        );
        return { wch: Math.min(58, Math.max(14, maxLen + 3)) };
      });
    }
    const safeName = sheet.name.replace(/[\\/?*[\]:]/g, '').slice(0, 31) || 'Hoja1';
    XLSX.utils.book_append_sheet(wb, ws, safeName);
  }
  XLSX.writeFile(wb, filename);
}

// ============================================================================
// 3. EXPORTACIÓN PDF (.PDF) CON JSPDF (REPORTES Y DIAPOSITIVAS E20)
// ============================================================================
function pdfSafe(input: string): string {
  return String(input ?? '')
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=')
    .replace(/→/g, '->')
    .replace(/−/g, '-')
    .replace(/Δ/g, 'Delta ')
    .replace(/θ/g, 'theta')
    .replace(/α/g, 'alfa')
    .replace(/·/g, ' · ')
    .replace(/“|”/g, '"')
    .replace(/’/g, "'");
}

export interface PdfSectionSpec {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: {
    headers: string[];
    rows: Array<Array<string | number>>;
  };
}

export function downloadSimplePdf(
  filename: string,
  docTitle: string,
  subtitle: string,
  sections: PdfSectionSpec[],
): void {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > pageHeight - 16) {
      pdf.addPage();
      y = 18;
    }
  };

  // Encabezado institucional
  pdf.setFillColor(15, 23, 42);
  pdf.rect(margin, y - 5, contentWidth, 1.2, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(71, 85, 105);
  pdf.text(pdfSafe(`${COURSE_METADATA.university} | Grupo ${COURSE_METADATA.groupCode} | Proyecto ALMA`), margin, y);
  y += 6;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(15, 23, 42);
  const titleLines = pdf.splitTextToSize(pdfSafe(docTitle), contentWidth);
  pdf.text(titleLines, margin, y);
  y += titleLines.length * 6 + 1;

  if (subtitle) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(71, 85, 105);
    const subLines = pdf.splitTextToSize(pdfSafe(subtitle), contentWidth);
    pdf.text(subLines, margin, y);
    y += subLines.length * 4.5 + 3;
  }

  pdf.setDrawColor(203, 213, 225);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 6;

  for (const sec of sections) {
    ensureSpace(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(29, 78, 216);
    const headLines = pdf.splitTextToSize(pdfSafe(sec.heading), contentWidth);
    pdf.text(headLines, margin, y);
    y += headLines.length * 5 + 2;

    if (sec.paragraphs) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.5);
      pdf.setTextColor(30, 41, 59);
      for (const p of sec.paragraphs) {
        const lines = pdf.splitTextToSize(pdfSafe(p), contentWidth);
        ensureSpace(lines.length * 4.5 + 3);
        pdf.text(lines, margin, y);
        y += lines.length * 4.5 + 2.5;
      }
    }

    if (sec.bullets) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.5);
      pdf.setTextColor(30, 41, 59);
      for (const b of sec.bullets) {
        const lines = pdf.splitTextToSize(`• ${pdfSafe(b)}`, contentWidth - 4);
        ensureSpace(lines.length * 4.5 + 2);
        pdf.text(lines, margin + 2, y);
        y += lines.length * 4.5 + 1.8;
      }
    }

    if (sec.table && sec.table.rows.length > 0) {
      const colCount = sec.table.headers.length;
      const colWidth = contentWidth / colCount;
      ensureSpace(14);

      // Cabecera tabla
      pdf.setFillColor(241, 245, 249);
      pdf.setDrawColor(203, 213, 225);
      const headerHeight = 8;
      pdf.rect(margin, y, contentWidth, headerHeight, 'FD');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.2);
      pdf.setTextColor(15, 23, 42);
      sec.table.headers.forEach((h, i) => {
        const hText = pdf.splitTextToSize(pdfSafe(h), colWidth - 3);
        pdf.text(hText[0] ?? '', margin + i * colWidth + 1.5, y + 5.2);
      });
      y += headerHeight;

      // Filas
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.2);
      pdf.setTextColor(30, 41, 59);
      for (const row of sec.table.rows) {
        const cellLines = row.map((cell) => pdf.splitTextToSize(pdfSafe(String(cell ?? '')), colWidth - 3));
        const maxLines = Math.max(1, ...cellLines.map((l) => l.length));
        const rowH = Math.max(7, maxLines * 4 + 3);
        ensureSpace(rowH + 2);
        pdf.setDrawColor(226, 232, 240);
        pdf.rect(margin, y, contentWidth, rowH, 'S');
        cellLines.forEach((lines, i) => {
          pdf.text(lines, margin + i * colWidth + 1.5, y + 4.5);
        });
        y += rowH;
      }
      y += 4;
    }

    y += 2;
  }

  // Pie de página en todas las páginas
  const totalPages = pdf.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    pdf.setPage(p);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(
      pdfSafe(`${filename} · Proyecto ALMA (${COURSE_METADATA.groupCode} · ${COURSE_METADATA.period})`),
      margin,
      pageHeight - 8,
    );
    pdf.text(`Pág. ${p} / ${totalPages}`, pageWidth - margin - 18, pageHeight - 8);
  }

  pdf.save(filename);
}

export function downloadPitchSlidesPdf(filename: string, deck: RolePresentationDeck): void {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const w = pdf.internal.pageSize.getWidth(); // 297mm
  const h = pdf.internal.pageSize.getHeight(); // 210mm
  const margin = 16;

  deck.slides.forEach((slide, idx) => {
    if (idx > 0) pdf.addPage();

    // Fondo limpio editorial
    pdf.setFillColor(248, 250, 252);
    pdf.rect(0, 0, w, h, 'F');

    // Barra superior de diapositiva
    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 0, w, 16, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9.5);
    pdf.setTextColor(255, 255, 255);
    pdf.text(
      pdfSafe(`ALMA · Pitch T3 · ${deck.memberName} (${deck.memberCode})`),
      margin,
      10.5,
    );
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      pdfSafe(`Diapositiva ${slide.number}/8 · ${slide.timeRange} · ${slide.blockLabel}`),
      w - margin - 82,
      10.5,
    );

    // Título principal
    let y = 30;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(17);
    pdf.setTextColor(15, 23, 42);
    const tLines = pdf.splitTextToSize(pdfSafe(slide.title), w - margin * 2);
    pdf.text(tLines, margin, y);
    y += tLines.length * 7.5 + 2;

    if (slide.subtitle) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.setTextColor(71, 85, 105);
      const sLines = pdf.splitTextToSize(pdfSafe(slide.subtitle), w - margin * 2);
      pdf.text(sLines, margin, y);
      y += sLines.length * 5.2 + 5;
    }

    // Banda KPI
    if (slide.kpis && slide.kpis.length > 0) {
      const kpiW = (w - margin * 2 - (slide.kpis.length - 1) * 5) / slide.kpis.length;
      slide.kpis.forEach((kpi, kIdx) => {
        const kx = margin + kIdx * (kpiW + 5);
        pdf.setFillColor(255, 255, 255);
        pdf.setDrawColor(203, 213, 225);
        pdf.rect(kx, y, kpiW, 25, 'FD');

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        pdf.setTextColor(100, 116, 139);
        pdf.text(pdfSafe(kpi.label), kx + 4, y + 6.5);

        pdf.setFontSize(14);
        pdf.setTextColor(29, 78, 216);
        pdf.text(pdfSafe(kpi.value), kx + 4, y + 14.5);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(71, 85, 105);
        const nLines = pdf.splitTextToSize(pdfSafe(kpi.note ?? ''), kpiW - 8);
        pdf.text(nLines[0] ?? '', kx + 4, y + 21);
      });
      y += 33;
    }

    // Puntos clave
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(203, 213, 225);
    const boxH = h - y - 28;
    pdf.rect(margin, y, w - margin * 2, boxH, 'FD');

    let by = y + 9;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9.5);
    pdf.setTextColor(15, 23, 42);
    pdf.text('Puntos clave en pantalla:', margin + 5, by);
    by += 7;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10.5);
    pdf.setTextColor(30, 41, 59);
    for (const bullet of slide.bullets) {
      const bLines = pdf.splitTextToSize(`• ${pdfSafe(bullet)}`, w - margin * 2 - 12);
      pdf.text(bLines, margin + 6, by);
      by += bLines.length * 5.2 + 3;
    }

    if (slide.referenceTags && slide.referenceTags.length > 0) {
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(8.5);
      pdf.setTextColor(71, 85, 105);
      pdf.text(
        pdfSafe(`Fuentes de respaldo: ${slide.referenceTags.join(' · ')}`),
        margin + 6,
        y + boxH - 6,
      );
    }

    // Pie de diapositiva
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(100, 116, 139);
    pdf.text(pdfSafe(`Indicador visual: ${slide.deliveryCue}`), margin, h - 10);
    pdf.text(pdfSafe(`${deck.roleTitle}`), w - margin - 100, h - 10);
  });

  pdf.save(filename);
}

// ============================================================================
// 4. EXPORTACIÓN WORD (.DOCX) EDITABLE PARA PLANTILLAS E00, E01, E03, E14–E18
// ============================================================================
export async function downloadTemplateDocx(
  filename: string,
  docTitle: string,
  subtitle: string,
  sections: PdfSectionSpec[],
): Promise<void> {
  const children: Array<Paragraph | Table> = [
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `${COURSE_METADATA.university} · ${COURSE_METADATA.faculty} · Grupo ${COURSE_METADATA.groupCode}`,
          font: 'Arial',
          size: 18,
          bold: true,
          color: '475569',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: docTitle,
          font: 'Arial',
          size: 30,
          bold: true,
          color: '0F172A',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: subtitle,
          font: 'Arial',
          size: 20,
          italics: true,
          color: '475569',
        }),
      ],
    }),
  ];

  for (const sec of sections) {
    children.push(
      new Paragraph({
        spacing: { before: 220, after: 120 },
        children: [
          new TextRun({
            text: sec.heading,
            font: 'Arial',
            size: 24,
            bold: true,
            color: '1D4ED8',
          }),
        ],
      }),
    );

    if (sec.paragraphs) {
      for (const p of sec.paragraphs) {
        children.push(
          new Paragraph({
            spacing: { after: 140, line: 340 },
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: p,
                font: 'Arial',
                size: 21,
                color: '1E293B',
              }),
            ],
          }),
        );
      }
    }

    if (sec.bullets) {
      for (const b of sec.bullets) {
        children.push(
          new Paragraph({
            spacing: { after: 100, line: 320 },
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: b,
                font: 'Arial',
                size: 20,
                color: '1E293B',
              }),
            ],
          }),
        );
      }
    }

    if (sec.table && sec.table.rows.length > 0) {
      const borderCfg = {
        style: BorderStyle.SINGLE,
        size: 4,
        color: 'CBD5E1',
      };
      const headerRow = new TableRow({
        tableHeader: true,
        children: sec.table.headers.map(
          (h) =>
            new TableCell({
              shading: { fill: 'F1F5F9', type: ShadingType.CLEAR, color: 'auto' },
              borders: { top: borderCfg, bottom: borderCfg, left: borderCfg, right: borderCfg },
              margins: { top: 90, bottom: 90, left: 110, right: 110 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: h,
                      font: 'Arial',
                      size: 19,
                      bold: true,
                      color: '0F172A',
                    }),
                  ],
                }),
              ],
            }),
        ),
      });

      const bodyRows = sec.table.rows.map(
        (r) =>
          new TableRow({
            children: r.map(
              (cell) =>
                new TableCell({
                  borders: { top: borderCfg, bottom: borderCfg, left: borderCfg, right: borderCfg },
                  margins: { top: 80, bottom: 80, left: 110, right: 110 },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: String(cell ?? ''),
                          font: 'Arial',
                          size: 18,
                          color: '1E293B',
                        }),
                      ],
                    }),
                  ],
                }),
            ),
          }),
      );

      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [headerRow, ...bodyRows],
        }),
      );
      children.push(new Paragraph({ spacing: { after: 140 }, children: [] }));
    }
  }

  const doc = new Document({
    sections: [{ children }],
  });
  const blob = await Packer.toBlob(doc);
  triggerBlobDownload(blob, filename);
}

// ============================================================================
// 5. GENERADORES DE DIAGRAMAS PNG ALTA RESOLUCIÓN (E08, E10, E11)
// ============================================================================
function drawWrappedCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(' ');
  let line = '';
  let currY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line) {
      ctx.fillText(line, x, currY);
      line = words[i];
      currY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, currY);
    currY += lineHeight;
  }
  return currY;
}

// E08 — Mapa de Co-ocurrencia Bibliométrica VOSviewer (3 Clústeres)
export function generateVosViewerPng(): string {
  const W = 1600;
  const H = 920;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Fondo blanco técnico sutil
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // Cuadrícula sutil de coordenadas
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1;
  for (let gx = 80; gx < W; gx += 80) {
    ctx.beginPath();
    ctx.moveTo(gx, 90);
    ctx.lineTo(gx, H - 90);
    ctx.stroke();
  }
  for (let gy = 100; gy < H - 90; gy += 80) {
    ctx.beginPath();
    ctx.moveTo(40, gy);
    ctx.lineTo(W - 40, gy);
    ctx.stroke();
  }

  // Cabecera
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 26px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText('E08 · Mapa Bibliométrico de Co-ocurrencia VOSviewer (n = 31 + 2 Guías · 2022–2026)', 48, 48);
  ctx.fillStyle = '#475569';
  ctx.font = '15px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText(
    'Síntesis PRISMA 2020 (Scopus, Web of Science, ScienceDirect) · 3 Clústeres estructurales siguiendo plantilla Shafaie et al. (2026)',
    48,
    74,
  );

  // Halos suaves de clúster
  const halos: Array<{ x: number; y: number; rx: number; ry: number; color: string }> = [
    { x: 380, y: 390, rx: 280, ry: 220, color: 'rgba(220, 38, 38, 0.06)' }, // Clúster 1 Rojo
    { x: 850, y: 470, rx: 320, ry: 240, color: 'rgba(37, 99, 235, 0.06)' }, // Clúster 2 Azul
    { x: 1260, y: 360, rx: 270, ry: 220, color: 'rgba(5, 150, 105, 0.06)' }, // Clúster 3 Esmeralda
  ];
  for (const h of halos) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(h.x, h.y, h.rx, h.ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = h.color;
    ctx.fill();
    ctx.restore();
  }

  interface VNode {
    id: string;
    label: string;
    x: number;
    y: number;
    r: number;
    cluster: 1 | 2 | 3;
    sub?: string;
  }

  const clusterColors: Record<1 | 2 | 3, string> = {
    1: '#dc2626',
    2: '#2563eb',
    3: '#059669',
  };

  const nodes: VNode[] = [
    // Clúster 1: Exoesqueletos y Diseño 3D (25,8%)
    { id: 'exo', label: 'upper-limb exoskeleton', sub: '31 occ.', x: 430, y: 370, r: 34, cluster: 1 },
    { id: 'pla', label: '3d printing / pla fdm', sub: 'Ly 2026 · Kansal 2023', x: 250, y: 260, r: 24, cluster: 1 },
    { id: 'cad', label: 'ergonomic cad (inventor)', sub: 'Dong 2025 · Kim 2022', x: 230, y: 460, r: 20, cluster: 1 },
    { id: 'act', label: 'modular 3d actuator', sub: 'Zhang 2026 · Zhao 2025', x: 440, y: 205, r: 20, cluster: 1 },
    { id: 'eit', label: 'interface pressure (eit)', sub: 'Chen 2026 · Ullah 2024', x: 350, y: 560, r: 17, cluster: 1 },

    // Clúster 2: Control Adaptativo y Seguridad (41,9%)
    { id: 'stroke', label: 'stroke rehabilitation', sub: '29 occ.', x: 830, y: 420, r: 35, cluster: 2 },
    { id: 'smc', label: 'sliding mode & adaptive', sub: 'Amiri 2025 · Yin 2026', x: 760, y: 255, r: 24, cluster: 2 },
    { id: 'aan', label: 'assist-as-needed (aan)', sub: 'Chia 2024 · Shah 2026', x: 960, y: 270, r: 22, cluster: 2 },
    { id: 'spast', label: 'spasticity & pain safety', sub: 'Li 2026 · Zhang 2025', x: 720, y: 605, r: 22, cluster: 2 },
    { id: 'esp32', label: 'esp32 & kalman mrac', sub: 'Toro-Ossaba 2024', x: 930, y: 615, r: 21, cluster: 2 },
    { id: 'fault', label: 'barrier fault-tolerant', sub: 'Li 2025 · Chai 2023', x: 590, y: 520, r: 17, cluster: 2 },

    // Clúster 3: IA, Voz, NLP y Telerehabilitación (32,3%)
    { id: 'hri', label: 'human-robot interaction (ai)', sub: 'Shafaie 2026 · 18 occ.', x: 1185, y: 355, r: 30, cluster: 3 },
    { id: 'voice', label: 'voice control / edge nlp', sub: 'Guo 2022 · alma-nlp', x: 1350, y: 220, r: 23, cluster: 3 },
    { id: 'telerehab', label: 'home telerehabilitation', sub: 'Li 2026 · Ventura 2026', x: 1380, y: 425, r: 25, cluster: 3 },
    { id: 'nn', label: 'neural network / gamified', sub: 'Zheng 2025 · Sittiruk 2026', x: 1210, y: 550, r: 22, cluster: 3 },
    { id: 'cost', label: 'low-cost (< usd 500)', sub: 'Gonçalves 2026 · Kang 2026', x: 1390, y: 605, r: 20, cluster: 3 },
  ];

  const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const edges: Array<[string, string, number]> = [
    ['exo', 'stroke', 5.5],
    ['exo', 'pla', 4.0],
    ['exo', 'cad', 3.2],
    ['exo', 'act', 3.0],
    ['exo', 'eit', 2.4],
    ['exo', 'smc', 3.6],
    ['exo', 'hri', 3.8],
    ['pla', 'esp32', 2.6],
    ['pla', 'cost', 2.4],
    ['stroke', 'smc', 4.2],
    ['stroke', 'aan', 3.8],
    ['stroke', 'spast', 3.5],
    ['stroke', 'esp32', 3.2],
    ['stroke', 'hri', 4.5],
    ['stroke', 'telerehab', 4.0],
    ['smc', 'aan', 2.8],
    ['smc', 'fault', 2.5],
    ['spast', 'fault', 2.6],
    ['hri', 'voice', 3.4],
    ['hri', 'telerehab', 3.8],
    ['hri', 'nn', 3.5],
    ['telerehab', 'cost', 3.4],
    ['voice', 'esp32', 2.2],
    ['nn', 'cost', 2.2],
  ];

  // Dibujar aristas curvas
  for (const [srcId, dstId, w] of edges) {
    const a = nodeById[srcId];
    const b = nodeById[dstId];
    if (!a || !b) continue;
    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2 - 22;

    const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
    grad.addColorStop(0, clusterColors[a.cluster]);
    grad.addColorStop(1, clusterColors[b.cluster]);

    ctx.save();
    ctx.globalAlpha = 0.28;
    ctx.strokeStyle = grad;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.quadraticCurveTo(midX, midY, b.x, b.y);
    ctx.stroke();
    ctx.restore();
  }

  // Dibujar nodos + etiquetas legibles
  for (const n of nodes) {
    const color = clusterColors[n.cluster];
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r + 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Etiqueta con recuadro blanco semitransparente para lectura limpia
    ctx.font = n.r >= 28 ? 'bold 15px "Plus Jakarta Sans", Arial, sans-serif' : 'bold 13px "Plus Jakarta Sans", Arial, sans-serif';
    const textW = ctx.measureText(n.label).width;
    const labelX = n.x - textW / 2;
    const labelY = n.y + n.r + 20;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.fillRect(labelX - 5, labelY - 14, textW + 10, n.sub ? 33 : 19);

    ctx.fillStyle = '#0f172a';
    ctx.fillText(n.label, labelX, labelY);

    if (n.sub) {
      ctx.font = '11.5px "IBM Plex Mono", monospace';
      ctx.fillStyle = '#475569';
      const subW = ctx.measureText(n.sub).width;
      ctx.fillText(n.sub, n.x - subW / 2, labelY + 15);
    }
  }

  // Leyenda inferior
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(48, H - 74, W - 96, 54);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.strokeRect(48, H - 74, W - 96, 54);

  const legendItems: Array<{ color: string; text: string; x: number }> = [
    { color: '#dc2626', text: 'Clúster 1 (Rojo): Exoesqueletos y Diseño 3D (8 estudios · 25,8 %)', x: 74 },
    { color: '#2563eb', text: 'Clúster 2 (Azul): Control Adaptativo y Seguridad (13 estudios · 41,9 %)', x: 560 },
    { color: '#059669', text: 'Clúster 3 (Verde): IA, Voz Edge NLP y Telerehab (10 estudios · 32,3 %)', x: 1085 },
  ];

  for (const item of legendItems) {
    ctx.beginPath();
    ctx.arc(item.x, H - 47, 8, 0, Math.PI * 2);
    ctx.fillStyle = item.color;
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13.5px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText(item.text, item.x + 16, H - 42);
  }

  return canvas.toDataURL('image/png');
}

// E10 — Business Model Canvas PNG (9 bloques)
export function generateBusinessModelCanvasPng(): string {
  const W = 1600;
  const H = 960;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, W, H);

  // Header
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, W, 86);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText('E10 · Business Model Canvas — Proyecto ALMA (Telerehabilitación Post-ACV)', 44, 40);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '14.5px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText(
    'Modelo híbrido B2B2C · Grupo G02 (UPN Mecatrónica) · BOM unitario S/ 420 · Inversión S/ 24 000 · VAN S/ 9 589,89 · TIR 25,16 %',
    44,
    66,
  );

  const marginX = 40;
  const startY = 110;
  const gridW = W - marginX * 2;
  const colW = gridW / 5;
  const topH = 560;
  const rowHalf = topH / 2;
  const bottomY = startY + topH + 14;
  const bottomH = H - bottomY - 30;

  interface CellBox {
    title: string;
    body: string;
    x: number;
    y: number;
    w: number;
    h: number;
    accent?: boolean;
  }

  const getBlock = (idx: number) => CANVAS_BLOCKS[idx]?.detail ?? '';

  const boxes: CellBox[] = [
    { title: '8. Socios Clave', body: getBlock(7), x: marginX, y: startY, w: colW, h: topH },
    { title: '7. Actividades Clave', body: getBlock(6), x: marginX + colW, y: startY, w: colW, h: rowHalf },
    { title: '6. Recursos Clave', body: getBlock(5), x: marginX + colW, y: startY + rowHalf, w: colW, h: rowHalf },
    { title: '2. Propuesta de Valor', body: getBlock(1), x: marginX + colW * 2, y: startY, w: colW, h: topH, accent: true },
    { title: '4. Relación con Clientes', body: getBlock(3), x: marginX + colW * 3, y: startY, w: colW, h: rowHalf },
    { title: '3. Canales', body: getBlock(2), x: marginX + colW * 3, y: startY + rowHalf, w: colW, h: rowHalf },
    { title: '1. Segmentos de Clientes', body: getBlock(0), x: marginX + colW * 4, y: startY, w: colW, h: topH },
    { title: '9. Estructura de Costos', body: getBlock(8), x: marginX, y: bottomY, w: gridW / 2, h: bottomH },
    { title: '5. Fuentes de Ingresos', body: getBlock(4), x: marginX + gridW / 2, y: bottomY, w: gridW / 2, h: bottomH },
  ];

  for (const b of boxes) {
    ctx.fillStyle = b.accent ? '#eff6ff' : '#ffffff';
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.strokeStyle = b.accent ? '#1d4ed8' : '#cbd5e1';
    ctx.lineWidth = b.accent ? 2 : 1;
    ctx.strokeRect(b.x, b.y, b.w, b.h);

    // Header de bloque
    ctx.fillStyle = b.accent ? '#1d4ed8' : '#f1f5f9';
    ctx.fillRect(b.x, b.y, b.w, 38);
    ctx.fillStyle = b.accent ? '#ffffff' : '#0f172a';
    ctx.font = 'bold 15px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText(b.title, b.x + 14, b.y + 24);

    // Texto principal
    ctx.fillStyle = '#1e293b';
    ctx.font = '14px "Plus Jakarta Sans", Arial, sans-serif';
    drawWrappedCanvasText(ctx, b.body, b.x + 14, b.y + 62, b.w - 28, 22);
  }

  return canvas.toDataURL('image/png');
}

// E11 — Cadena de Valor de Porter PNG
export function generateCadenaValorPng(): string {
  const W = 1600;
  const H = 900;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // Encabezado
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, W, 86);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText('E11 · Cadena de Valor de Porter Aplicada al Sistema ALMA', 44, 40);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '14.5px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText(
    'Integración vertical hardware CAD/PLA + ESP32 + Edge NLP con margen bruto del 63,5 % en venta B2B y flujo recurrente B2C',
    44,
    66,
  );

  const leftX = 48;
  const chainW = 1280;
  const marginTipX = leftX + chainW + 20;
  const marginTipEnd = W - 48;

  // Bloque MARGEN derecho (flecha de Porter)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(leftX + chainW - 20, 120);
  ctx.lineTo(marginTipX, 120);
  ctx.lineTo(marginTipEnd, 490);
  ctx.lineTo(marginTipX, 850);
  ctx.lineTo(leftX + chainW - 20, 850);
  ctx.closePath();
  ctx.fillStyle = '#eff6ff';
  ctx.fill();
  ctx.strokeStyle = '#1d4ed8';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#1d4ed8';
  ctx.font = 'bold 24px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText('MARGEN', marginTipX + 8, 435);
  ctx.font = 'bold 16px "IBM Plex Mono", monospace';
  ctx.fillStyle = '#0f172a';
  ctx.fillText('63,5 % B2B', marginTipX + 8, 470);
  ctx.fillText('VAN S/ 9 590', marginTipX + 8, 498);
  ctx.fillText('TIR 25,16 %', marginTipX + 8, 526);
  ctx.fillText('B/C 1,40', marginTipX + 8, 554);
  ctx.restore();

  // Actividades de Apoyo (4 franjas horizontales)
  const supportActivities = [
    {
      title: 'Infraestructura del Emprendimiento',
      desc: 'Taller de manufactura aditiva UPN/Lima Norte, gestión regulatoria DIGEMID/INDECOPI, control financiero E12–E13 y gobierno G02.',
      fill: '#f8fafc',
    },
    {
      title: 'Gestión del Talento Humano',
      desc: 'Equipo multidisciplinario mecatrónico (CAD, Electrónica ESP32, NLP, Finanzas) y asesoría clínica de fisioterapeutas aliados.',
      fill: '#f1f5f9',
    },
    {
      title: 'Desarrollo Tecnológico (I+D)',
      desc: 'Modelado paramétrico Autodesk Inventor (26 .ipt), aislamiento Step-Down XL4015, lógica difusa Mamdani, Edge NLP (91,70 %) y API REST Node.js.',
      fill: '#e2e8f0',
    },
    {
      title: 'Abastecimiento y Compras',
      desc: `Adquisición estandarizada (${BOM_UNIT_COSTS.length} partidas BOM = S/ 420): ESP32, servo 40 kg·cm, LiPo 11,1 V, HX711 y filamento PLA certificado.`,
      fill: '#f8fafc',
    },
  ];

  const supH = 88;
  const supGap = 10;
  supportActivities.forEach((s, i) => {
    const sy = 120 + i * (supH + supGap);
    ctx.fillStyle = s.fill;
    ctx.fillRect(leftX, sy, chainW - 30, supH);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(leftX, sy, chainW - 30, supH);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText(s.title, leftX + 20, sy + 30);

    ctx.fillStyle = '#334155';
    ctx.font = '14px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText(s.desc, leftX + 20, sy + 58);
  });

  // Etiqueta divisoria
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 13px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText('ACTIVIDADES PRIMARIAS DE CREACIÓN DE VALOR (FLUJO OPERATIVO ALMA)', leftX, 524);

  // 5 Actividades Primarias en columnas
  const primY = 540;
  const primH = 310;
  const stageW = (chainW - 30) / 5;

  VALUE_CHAIN.forEach((stage, i) => {
    const sx = leftX + i * stageW;
    ctx.fillStyle = i % 2 === 0 ? '#0f172a' : '#1e293b';
    ctx.fillRect(sx, primY, stageW - 8, 56);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText(`${i + 1}. ${stage.stage}`, sx + 14, primY + 34);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(sx, primY + 56, stageW - 8, primH - 56);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(sx, primY + 56, stageW - 8, primH - 56);

    ctx.fillStyle = '#1e293b';
    ctx.font = '14.5px "Plus Jakarta Sans", Arial, sans-serif';
    drawWrappedCanvasText(ctx, stage.detail, sx + 14, primY + 90, stageW - 36, 23);
  });

  return canvas.toDataURL('image/png');
}
