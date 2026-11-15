import PptxGenJS from 'pptxgenjs';
import type { RolePresentationDeck } from '../data/presentationsData';
import { COURSE_METADATA } from '../data/teamMembers';

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

  for (const slideData of deck.slides) {
    const slide = pptx.addSlide();
    slide.background = { color: 'F8FAFC' };

    // Barra superior editorial (16:9 width = 10 inches, height = 5.625 inches)
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 10,
      h: 0.52,
      fill: { color: '0F172A' },
      line: { color: '0F172A' },
    });

    slide.addText(
      `ALMA · Exoesqueleto Mecatrónico UPN (Grupo ${COURSE_METADATA.groupCode}) · ${deck.memberName} (${deck.memberCode})`,
      {
        x: 0.4,
        y: 0.1,
        w: 6.8,
        h: 0.32,
        fontFace: 'Arial',
        fontSize: 10,
        bold: true,
        color: 'FFFFFF',
      },
    );

    slide.addText(`Diapositiva ${slideData.number} / ${deck.slides.length} · ${slideData.timeRange}`, {
      x: 7.2,
      y: 0.1,
      w: 2.4,
      h: 0.32,
      align: 'right',
      fontFace: 'Arial',
      fontSize: 9.5,
      color: 'CBD5E1',
    });

    // Kicker de bloque
    slide.addText(slideData.blockLabel.toUpperCase(), {
      x: 0.45,
      y: 0.66,
      w: 9.1,
      h: 0.24,
      fontFace: 'Arial',
      fontSize: 9.5,
      bold: true,
      color: '1D4ED8',
    });

    // Título principal
    slide.addText(slideData.title, {
      x: 0.45,
      y: 0.92,
      w: 9.1,
      h: 0.65,
      fontFace: 'Arial',
      fontSize: slideData.kind === 'cover' ? 21 : 19,
      bold: true,
      color: '0F172A',
      valign: 'top',
    });

    // Subtítulo
    slide.addText(slideData.subtitle, {
      x: 0.45,
      y: 1.58,
      w: 9.1,
      h: 0.34,
      fontFace: 'Arial',
      fontSize: 11.5,
      color: '475569',
    });

    let contentTopY = 2.04;

    // Franja KPI (2 o 3 cajas)
    if (slideData.kpis && slideData.kpis.length > 0) {
      const kpis = slideData.kpis;
      const gap = 0.2;
      const totalW = 9.1;
      const cardW = (totalW - gap * (kpis.length - 1)) / kpis.length;

      kpis.forEach((kpi, idx) => {
        const kx = 0.45 + idx * (cardW + gap);
        slide.addShape(pptx.ShapeType.rect, {
          x: kx,
          y: contentTopY,
          w: cardW,
          h: 1.08,
          fill: { color: 'FFFFFF' },
          line: { color: 'CBD5E1', width: 1 },
        });

        slide.addText(kpi.label, {
          x: kx + 0.14,
          y: contentTopY + 0.1,
          w: cardW - 0.28,
          h: 0.22,
          fontFace: 'Arial',
          fontSize: 9,
          bold: true,
          color: '64748B',
        });

        slide.addText(kpi.value, {
          x: kx + 0.14,
          y: contentTopY + 0.34,
          w: cardW - 0.28,
          h: 0.38,
          fontFace: 'Arial',
          fontSize: 17,
          bold: true,
          color: '1D4ED8',
        });

        if (kpi.note) {
          slide.addText(kpi.note, {
            x: kx + 0.14,
            y: contentTopY + 0.74,
            w: cardW - 0.28,
            h: 0.26,
            fontFace: 'Arial',
            fontSize: 8.5,
            color: '475569',
          });
        }
      });

      contentTopY += 1.24;
    }

    // Caja de puntos clave
    const boxHeight = 5.05 - contentTopY;
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.45,
      y: contentTopY,
      w: 9.1,
      h: boxHeight,
      fill: { color: 'FFFFFF' },
      line: { color: 'CBD5E1', width: 1 },
    });

    const bulletItems = slideData.bullets.map((b) => ({
      text: b,
      options: {
        bullet: true,
        fontFace: 'Arial',
        fontSize: 12.5,
        color: '1E293B',
        breakLine: true,
        paraSpaceAfter: 8,
      },
    }));

    slide.addText(bulletItems, {
      x: 0.62,
      y: contentTopY + 0.16,
      w: 8.75,
      h: boxHeight - (slideData.referenceTags && slideData.referenceTags.length > 0 ? 0.55 : 0.28),
      valign: 'top',
    });

    if (slideData.referenceTags && slideData.referenceTags.length > 0) {
      slide.addText(`Fuentes verificadas: ${slideData.referenceTags.join('  ·  ')}`, {
        x: 0.62,
        y: contentTopY + boxHeight - 0.34,
        w: 8.75,
        h: 0.24,
        fontFace: 'Arial',
        fontSize: 8.5,
        italic: true,
        color: '64748B',
      });
    }

    // Pie de diapositiva
    slide.addShape(pptx.ShapeType.line, {
      x: 0.45,
      y: 5.18,
      w: 9.1,
      h: 0,
      line: { color: 'CBD5E1', width: 0.75 },
    });

    slide.addText(`Indicador en escena: ${slideData.deliveryCue}`, {
      x: 0.45,
      y: 5.24,
      w: 5.6,
      h: 0.26,
      fontFace: 'Arial',
      fontSize: 8.5,
      color: '64748B',
    });

    slide.addText(deck.roleTitle, {
      x: 6.1,
      y: 5.24,
      w: 3.45,
      h: 0.26,
      align: 'right',
      fontFace: 'Arial',
      fontSize: 8.5,
      color: '64748B',
    });

    // Notas del orador (guion exacto de 3 minutos en PowerPoint Presenter View)
    slide.addNotes(
      `[${slideData.timeRange}] ${slideData.title}\n\nGUION:\n${slideData.speechScript}\n\nINDICACIÓN: ${slideData.deliveryCue}`,
    );
  }

  await pptx.writeFile({ fileName: outName });
}
