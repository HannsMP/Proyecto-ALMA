import PptxGenJS from 'pptxgenjs';
import { SLIDE_KIND_LABELS, type RolePresentationDeck } from '../data/presentationsData';
import { COURSE_METADATA } from '../data/teamMembers';

function estimateLineCount(text: string, maxCharsPerLine: number): number {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 1;
  let lines = 1;
  let currentLen = 0;
  for (const word of words) {
    const nextLen = currentLen === 0 ? word.length : currentLen + 1 + word.length;
    if (nextLen > maxCharsPerLine && currentLen > 0) {
      lines += 1;
      currentLen = word.length;
    } else {
      currentLen = nextLen;
    }
  }
  return lines;
}

export async function exportPresentationPptx(
  deck: RolePresentationDeck,
  filename?: string,
): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = deck.memberName;
  pptx.company = `${COURSE_METADATA.university} — Grupo ${COURSE_METADATA.groupCode}`;
  pptx.subject = 'Proyecto ALMA · Pitch T3 (3 minutos)';
  pptx.title = `ALMA Pitch — ${deck.memberName}`;

  const safeTag = deck.memberName.split(' ').slice(0, 2).join('');
  const outName = filename ?? `${COURSE_METADATA.groupCode}_${safeTag}_Pitch_ALMA.pptx`;

  const marginX = 0.55;
  const contentW = 10 - marginX * 2; // 8.90 in

  for (const slideData of deck.slides) {
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };

    // Encabezado editorial limpio sobre fondo blanco (idéntico al HTML)
    slide.addText(
      `DIAPOSITIVA ${slideData.number} / ${deck.slides.length} · ${SLIDE_KIND_LABELS[slideData.kind].toUpperCase()}`,
      {
        x: marginX,
        y: 0.34,
        w: 5.2,
        h: 0.22,
        fontFace: 'Arial',
        fontSize: 8.5,
        bold: true,
        charSpacing: 0.6,
        color: '64748B',
        margin: 0,
      },
    );

    slide.addText(`${slideData.timeRange} · ${deck.memberName}`, {
      x: marginX + 5.2,
      y: 0.34,
      w: contentW - 5.2,
      h: 0.22,
      align: 'right',
      fontFace: 'Consolas',
      fontSize: 8.5,
      color: '475569',
      margin: 0,
    });

    slide.addShape(pptx.ShapeType.line, {
      x: marginX,
      y: 0.60,
      w: contentW,
      h: 0,
      line: { color: 'E2E8F0', width: 0.75 },
    });

    // Título principal y subtítulo
    let cursorY = 0.72;
    const isCover = slideData.kind === 'cover';
    const titleFontSize = isCover ? 18.5 : 17;
    const titleLines = estimateLineCount(slideData.title, isCover ? 60 : 66);
    const titleH = Math.max(0.32, titleLines * (isCover ? 0.30 : 0.28) + 0.04);

    slide.addText(slideData.title, {
      x: marginX,
      y: cursorY,
      w: contentW,
      h: titleH,
      fontFace: 'Arial',
      fontSize: titleFontSize,
      bold: true,
      color: '020617',
      valign: 'top',
      margin: 0,
    });
    cursorY += titleH + 0.05;

    const subLines = estimateLineCount(slideData.subtitle, 100);
    const subH = Math.max(0.22, subLines * 0.20 + 0.02);
    slide.addText(slideData.subtitle, {
      x: marginX,
      y: cursorY,
      w: contentW,
      h: subH,
      fontFace: 'Arial',
      fontSize: 10.5,
      color: '475569',
      valign: 'top',
      margin: 0,
    });
    cursorY += subH;

    // Franja KPI (2 o 3 cajas slate-50 sin borde, idéntico al HTML)
    if (slideData.kpis && slideData.kpis.length > 0) {
      cursorY += 0.18;
      const kpis = slideData.kpis;
      const gap = 0.18;
      const cardW = (contentW - gap * (kpis.length - 1)) / kpis.length;
      const cardH = 0.96;

      kpis.forEach((kpi, idx) => {
        const kx = marginX + idx * (cardW + gap);
        slide.addShape(pptx.ShapeType.rect, {
          x: kx,
          y: cursorY,
          w: cardW,
          h: cardH,
          fill: { color: 'F8FAFC' },
          line: { color: 'F8FAFC', width: 0 },
        });

        slide.addText(kpi.label.toUpperCase(), {
          x: kx + 0.16,
          y: cursorY + 0.11,
          w: cardW - 0.32,
          h: 0.18,
          fontFace: 'Arial',
          fontSize: 8,
          bold: true,
          charSpacing: 0.4,
          color: '64748B',
          margin: 0,
        });

        slide.addText(kpi.value, {
          x: kx + 0.16,
          y: cursorY + 0.32,
          w: cardW - 0.32,
          h: 0.34,
          fontFace: 'Arial',
          fontSize: 16,
          bold: true,
          color: '1E40AF',
          margin: 0,
        });

        if (kpi.note) {
          slide.addText(kpi.note, {
            x: kx + 0.16,
            y: cursorY + 0.68,
            w: cardW - 0.32,
            h: 0.20,
            fontFace: 'Arial',
            fontSize: 8,
            color: '475569',
            margin: 0,
          });
        }
      });

      cursorY += cardH;
    }

    // Puntos clave directamente sobre fondo blanco con numeración 01, 02, 03 en azul
    cursorY += 0.20;
    slideData.bullets.forEach((bullet, idx) => {
      const bLines = estimateLineCount(bullet, 94);
      const rowH = Math.max(0.24, bLines * 0.21 + 0.03);

      slide.addText(`0${idx + 1}`, {
        x: marginX,
        y: cursorY + 0.01,
        w: 0.30,
        h: 0.22,
        fontFace: 'Consolas',
        fontSize: 9.5,
        bold: true,
        color: '1D4ED8',
        margin: 0,
      });

      slide.addText(bullet, {
        x: marginX + 0.34,
        y: cursorY,
        w: contentW - 0.34,
        h: rowH,
        fontFace: 'Arial',
        fontSize: 10.5,
        color: '1E293B',
        valign: 'top',
        margin: 0,
      });

      cursorY += rowH + 0.07;
    });

    // Nota destacada opcional (bg-blue-50)
    if (slideData.highlightNote) {
      cursorY += 0.08;
      const nLines = estimateLineCount(slideData.highlightNote, 100);
      const noteH = Math.max(0.30, nLines * 0.19 + 0.12);
      slide.addShape(pptx.ShapeType.rect, {
        x: marginX,
        y: cursorY,
        w: contentW,
        h: noteH,
        fill: { color: 'EFF6FF' },
        line: { color: 'EFF6FF', width: 0 },
      });
      slide.addText(slideData.highlightNote, {
        x: marginX + 0.14,
        y: cursorY + 0.06,
        w: contentW - 0.28,
        h: noteH - 0.12,
        fontFace: 'Arial',
        fontSize: 9.5,
        bold: true,
        color: '172554',
        valign: 'middle',
        margin: 0,
      });
      cursorY += noteH;
    }

    // Fuentes citadas (opcional)
    if (slideData.referenceTags && slideData.referenceTags.length > 0) {
      const refY = Math.min(4.72, Math.max(cursorY + 0.10, 4.56));
      slide.addShape(pptx.ShapeType.line, {
        x: marginX,
        y: refY,
        w: contentW,
        h: 0,
        line: { color: 'F1F5F9', width: 0.75 },
      });

      slide.addText(
        [
          {
            text: 'Fuentes citadas:   ',
            options: { fontFace: 'Arial', fontSize: 8.5, bold: true, color: '334155' },
          },
          {
            text: slideData.referenceTags.join('   ·   '),
            options: { fontFace: 'Consolas', fontSize: 8.5, color: '334155' },
          },
        ],
        {
          x: marginX,
          y: refY + 0.06,
          w: contentW,
          h: 0.24,
          margin: 0,
        },
      );
    }

    // Pie fijo limpio de la diapositiva (idéntico al HTML)
    slide.addShape(pptx.ShapeType.line, {
      x: marginX,
      y: 5.06,
      w: contentW,
      h: 0,
      line: { color: 'E2E8F0', width: 0.75 },
    });

    slide.addText(
      `ALMA · Exoesqueleto Mecatrónico UPN (Grupo ${COURSE_METADATA.groupCode}) · Revisión Sistemática PRISMA 2020`,
      {
        x: marginX,
        y: 5.14,
        w: 6.1,
        h: 0.24,
        fontFace: 'Arial',
        fontSize: 8.5,
        color: '64748B',
        margin: 0,
      },
    );

    slide.addText(`${deck.memberCode} · Examen por Competencias T3`, {
      x: marginX + 6.1,
      y: 5.14,
      w: contentW - 6.1,
      h: 0.24,
      align: 'right',
      fontFace: 'Consolas',
      fontSize: 8.5,
      color: '64748B',
      margin: 0,
    });

    // Notas del orador (guion optimizado en PowerPoint Presenter View)
    slide.addNotes(
      `[${slideData.timeRange}] ${slideData.title}\n\nGUION:\n${slideData.speechScript}\n\nINDICACIÓN: ${slideData.deliveryCue}`,
    );
  }

  await pptx.writeFile({ fileName: outName });
}
