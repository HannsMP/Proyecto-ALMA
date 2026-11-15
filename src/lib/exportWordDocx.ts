import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  Packer,
  PageBreak,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import {
  AI_DECLARATION_TABLE,
  AI_SWORN_DECLARATION,
  ARTICLE_METADATA,
  BIBLIOMETRIC_STATS,
  BLOCK_DIAGRAM_SUBSYSTEMS,
  BOM_UNIT_COSTS,
  CANVAS_BLOCKS,
  DESIGN_THINKING_PHASES,
  EVIDENCE_MASTER_TABLE,
  FINANCIAL_CASH_FLOW,
  INITIAL_INVESTMENT_BREAKDOWN,
  ODS_ALIGNMENT,
  PRISMA_PROTOCOL,
  SCAMPER_MATRIX,
  SENSITIVITY_SCENARIOS,
  VALUE_CHAIN,
} from '../data/almaT3Content';
import { PRISMA_INCLUDED_STUDIES, REFERENCES_DATA } from '../data/references30';
import { COURSE_METADATA, TEAM_MEMBERS, type TeamMember } from '../data/teamMembers';

const FONT_NAME = 'Arial';
const COLOR_TEXT = '1E293B';
const COLOR_MUTED = '475569';
const COLOR_NAVY = '0F172A';
const COLOR_ACCENT = '1D4ED8';
const COLOR_BORDER = 'CBD5E1';
const COLOR_HEADER_BG = 'F1F5F9';

function bodyPara(text: string, opts?: { bold?: boolean; italic?: boolean; spacingAfter?: number }) {
  return new Paragraph({
    spacing: { after: opts?.spacingAfter ?? 140, line: 360 },
    alignment: AlignmentType.JUSTIFIED,
    children: [
      new TextRun({
        text,
        font: FONT_NAME,
        size: 22, // 11pt
        color: COLOR_TEXT,
        bold: opts?.bold,
        italics: opts?.italic,
      }),
    ],
  });
}

function heading1(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 260, after: 140 },
    children: [
      new TextRun({
        text,
        font: FONT_NAME,
        size: 28, // 14pt
        bold: true,
        color: COLOR_NAVY,
      }),
    ],
  });
}

function heading2(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
    children: [
      new TextRun({
        text,
        font: FONT_NAME,
        size: 24, // 12pt
        bold: true,
        color: COLOR_ACCENT,
      }),
    ],
  });
}

function bulletPara(prefixBold: string, rest: string) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80, line: 320 },
    children: [
      new TextRun({
        text: prefixBold,
        font: FONT_NAME,
        size: 21,
        bold: true,
        color: COLOR_NAVY,
      }),
      new TextRun({
        text: rest,
        font: FONT_NAME,
        size: 21,
        color: COLOR_TEXT,
      }),
    ],
  });
}

function createStyledTable(headers: string[], rows: string[][], colWidths?: number[]): Table {
  const tableBorders = {
    top: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
    left: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
    right: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
    insideVertical: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
  };

  const defaultWidth = Math.floor(100 / headers.length);

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(
      (h, idx) =>
        new TableCell({
          width: { size: colWidths?.[idx] ?? defaultWidth, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: COLOR_HEADER_BG },
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [
            new Paragraph({
              spacing: { after: 0 },
              children: [
                new TextRun({
                  text: h,
                  font: FONT_NAME,
                  size: 19,
                  bold: true,
                  color: COLOR_NAVY,
                }),
              ],
            }),
          ],
        }),
    ),
  });

  const dataRows = rows.map(
    (row) =>
      new TableRow({
        children: row.map(
          (cellText, idx) =>
            new TableCell({
              width: { size: colWidths?.[idx] ?? defaultWidth, type: WidthType.PERCENTAGE },
              margins: { top: 70, bottom: 70, left: 100, right: 100 },
              children: [
                new Paragraph({
                  spacing: { after: 0, line: 260 },
                  children: [
                    new TextRun({
                      text: cellText,
                      font: FONT_NAME,
                      size: 18,
                      color: COLOR_TEXT,
                    }),
                  ],
                }),
              ],
            }),
        ),
      }),
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [headerRow, ...dataRows],
  });
}

function pageBreakPara() {
  return new Paragraph({ children: [new PageBreak()] });
}

export async function generateAlmaT3WordDocx(activeMember: TeamMember): Promise<void> {
  const coauthorRows = TEAM_MEMBERS.map((m) => [
    m.id === activeMember.id ? `${m.fullName} (Autor de entrega)` : m.fullName,
    m.code,
    m.email,
    m.orcidPlaceholder,
    m.roleTitle,
  ]);

  const prismaFlowRows = [
    ['Identificación', 'Registros en Scopus (385) + Web of Science (245) + ScienceDirect (190)', String(PRISMA_PROTOCOL.counts.identifiedTotal)],
    ['Depuración', 'Registros duplicados eliminados antes del cribado', String(PRISMA_PROTOCOL.counts.duplicatesRemoved)],
    ['Cribado', 'Registros cribados por título y resumen (doble ciego: 279 + 279)', String(PRISMA_PROTOCOL.counts.screenedTitleAbstract)],
    ['Excluidos en cribado', 'No cumplen criterios PCC (234 en Lote 1 + 234 en Lote 2)', String(PRISMA_PROTOCOL.counts.excludedScreening)],
    ['Buscados a texto completo', 'Artículos seleccionados para recuperación', String(PRISMA_PROTOCOL.counts.soughtRetrieval)],
    ['No recuperados', 'Texto completo inaccesible o retiro editorial', String(PRISMA_PROTOCOL.counts.notRetrieved)],
    ['Evaluados en elegibilidad', 'Evaluados a texto completo contra criterios I/E', String(PRISMA_PROTOCOL.counts.assessedEligibility)],
    [
      'Excluidos a texto completo',
      PRISMA_PROTOCOL.counts.excludedReasons.map((r) => `${r.reason} (${r.count})`).join('; '),
      String(PRISMA_PROTOCOL.counts.excludedEligibilityTotal),
    ],
    ['Estudios primarios incluidos', 'Estudios primarios (P01–P31) con DOI verificado en síntesis final', `${PRISMA_PROTOCOL.counts.includedTotal} (${PRISMA_PROTOCOL.counts.recentSharePercent} 2022–2026)`],
  ];

  const extractionRows = PRISMA_INCLUDED_STUDIES.map((r) => [
    r.id,
    `${r.year} · ${r.country}`,
    `${r.authors.split(',')[0]} et al. (${r.doi})`,
    r.prismaExtraction.architecture,
    r.prismaExtraction.controlOrAi,
    r.prismaExtraction.performanceMetric,
    r.prismaExtraction.costOrImpact,
  ]);

  const cashFlowRows = FINANCIAL_CASH_FLOW.map((f) => [
    f.year,
    `S/ ${f.ingresos.toLocaleString('es-PE')}`,
    `S/ ${f.egresos.toLocaleString('es-PE')}`,
    `S/ ${f.flujoNeto.toLocaleString('es-PE')}`,
    f.factorDescuento.toFixed(4),
    `S/ ${f.flujoDescontado.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    `S/ ${f.acumuladoDescontado.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  ]);

  const doc = new Document({
    creator: activeMember.fullName,
    title: ARTICLE_METADATA.title,
    description: ARTICLE_METADATA.subtitle,
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 2.54 cm
          },
        },
        children: [
          // ===== 1. PORTADA =====
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({ text: COURSE_METADATA.university.toUpperCase(), font: FONT_NAME, size: 28, bold: true, color: COLOR_NAVY }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 280 },
            children: [
              new TextRun({ text: COURSE_METADATA.faculty, font: FONT_NAME, size: 22, color: COLOR_MUTED }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({ text: 'EXAMEN T3 – ARTÍCULO DE REVISIÓN SISTEMÁTICA (PRISMA 2020)', font: FONT_NAME, size: 20, bold: true, color: COLOR_ACCENT }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 160 },
            children: [
              new TextRun({ text: ARTICLE_METADATA.title, font: FONT_NAME, size: 30, bold: true, color: COLOR_NAVY }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 280 },
            children: [
              new TextRun({ text: ARTICLE_METADATA.subtitle, font: FONT_NAME, size: 21, italics: true, color: COLOR_MUTED }),
            ],
          }),
          createStyledTable(
            ['Coautor(a)', 'Código UPN', 'Correo institucional', 'ORCID', 'Rol en el estudio'],
            coauthorRows,
            [24, 13, 20, 17, 26],
          ),
          new Paragraph({ spacing: { after: 180 }, children: [] }),
          bulletPara('Curso: ', `${COURSE_METADATA.course} (${COURSE_METADATA.groupCode})`),
          bulletPara('Docente: ', COURSE_METADATA.docente),
          bulletPara('Periodo académico y sede: ', `${COURSE_METADATA.period} · ${COURSE_METADATA.city}`),
          bulletPara('Archivo de entrega individual: ', activeMember.fileTag),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Carpeta compartida de evidencias Drive (E00): ', font: FONT_NAME, size: 21, bold: true, color: COLOR_NAVY }),
              new ExternalHyperlink({
                link: COURSE_METADATA.driveRootPlaceholder,
                children: [
                  new TextRun({ text: COURSE_METADATA.driveRootPlaceholder, font: FONT_NAME, size: 20, style: 'Hyperlink', color: COLOR_ACCENT }),
                ],
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 160 },
            children: [
              new TextRun({ text: `Enlace del Pitch individual 3 min (E20 – ${activeMember.shortName}): `, font: FONT_NAME, size: 21, bold: true, color: COLOR_NAVY }),
              new ExternalHyperlink({
                link: activeMember.drivePitchPlaceholder,
                children: [
                  new TextRun({ text: activeMember.drivePitchPlaceholder, font: FONT_NAME, size: 20, style: 'Hyperlink', color: COLOR_ACCENT }),
                ],
              }),
            ],
          }),
          pageBreakPara(),

          // ===== 2. ÍNDICE Y RESUMEN / ABSTRACT =====
          heading1('Índice de Contenidos (Estructura PRISMA 2020 – T3)'),
          bulletPara('Resumen y Palabras Clave / Abstract y Keywords', ' — Síntesis estructurada ES/EN con 5 descriptores UNESCO.'),
          bulletPara('1. Introducción', ' — Brecha clínica post-ACV, revisiones guía Karasheva 2025 / Shafaie 2026, marco PCC y RQ1–RQ3.'),
          bulletPara('2. Contexto del Proyecto ALMA', ' — Arquitectura mecatrónica, Design Thinking (5 fases) y SCAMPER.'),
          bulletPara('3. Metodología (PRISMA 2020)', ' — Protocolo, ecuaciones Scopus/WoS/ScienceDirect, criterios I/E y flujo 820 → 31.'),
          bulletPara('4. Resultados', ' — Bibliometría (100 % 2022–2026), matriz de extracción (P01–P31) y respuestas RQ1–RQ3.'),
          bulletPara('5. Discusión, Modelo de Negocio y Viabilidad', ' — Canvas 9 bloques, Cadena de Valor, BOM, Flujo 0–5, VAN/TIR/B-C/Sensibilidad y ODS.'),
          bulletPara('6. Conclusiones y Declaración CRediT', ' — Hallazgos integrados, limitaciones y aportes de coautoría.'),
          bulletPara('Declaración Jurada de Uso Responsable de IA', ' — Uso acotado a búsqueda bibliográfica y corrección ortográfica (E15–E16).'),
          bulletPara('Referencias Bibliográficas (APA 7)', ' — 41 referencias verificadas con enlace DOI activo.'),
          bulletPara('Anexos A – F', ' — Registro de prompts, Turnitin, Matriz E00–E21, Anexo D Individual y Coevaluación.'),

          heading1('Resumen'),
          bodyPara(ARTICLE_METADATA.resumenEs),
          bodyPara(`Palabras clave: ${ARTICLE_METADATA.keywordsEs.join('; ')}.`, { bold: true }),

          heading1('Abstract'),
          bodyPara(ARTICLE_METADATA.abstractEn),
          bodyPara(`Keywords: ${ARTICLE_METADATA.keywordsEn.join('; ')}.`, { bold: true }),

          // ===== 3. INTRODUCCIÓN =====
          heading1('1. Introducción'),
          bodyPara(
            'El accidente cerebrovascular (ACV) constituye una de las principales causas globales de discapacidad motora permanente en adultos, generando una carga sostenida sobre los sistemas de salud y las familias cuidadoras (Feigin et al., 2024). En economías emergentes como el Perú, más del 65 % de los pacientes con hemiparesia de miembro superior ve interrumpida su rehabilitación antes de consolidar neuroplasticidad funcional debido a la centralización hospitalaria, el costo recurrente de traslado y las largas listas de espera.',
          ),
          bodyPara(
            'Revisiones sistemáticas recientes utilizadas como guía estructural evidencian dos vacíos principales: el control basado en electromiografía superficial (sEMG) exhibe elevada variabilidad ante espasticidad post-ACV y la mayoría de prototipos se valida solo en sujetos sanos (Karasheva et al., 2025); simultáneamente, la interacción humano-robot basada en IA en entornos clínicos requiere interfaces naturales centradas en confianza y marcos económicos sostenibles (Shafaie et al., 2026). Aunque existen avances notables en robots gamificados (Zheng et al., 2025) y guantes activados por voz (Guo et al., 2022), los sistemas comerciales superan US$ 1 500–2 427 (Kansal et al., 2023). Frente a ello, el proyecto mecatrónico ALMA (UPN) propone un exoesqueleto portátil de codo controlado por voz local (Edge NLP), impreso en PLA y gobernado por ESP32 con aislamiento galvánico.',
          ),
          heading2('1.1 Marco PCC y Preguntas de Revisión'),
          bulletPara('Población (P): ', ARTICLE_METADATA.pcc.poblacion),
          bulletPara('Concepto (C): ', ARTICLE_METADATA.pcc.concepto),
          bulletPara('Contexto (C): ', ARTICLE_METADATA.pcc.contexto),
          ...ARTICLE_METADATA.rqs.map((rq) => bulletPara(`${rq.id}: `, rq.question)),

          // ===== 4. CONTEXTO DEL PROYECTO ALMA =====
          heading1('2. Contexto del Proyecto Mecatrónico ALMA: Design Thinking y SCAMPER'),
          bodyPara(
            'El sistema ALMA integra ingeniería mecánica, electrónica de potencia, control difuso y procesamiento de lenguaje natural en el borde dentro de una arquitectura monolítica offline-first sincronizada con un servidor clínico Express/Node.js.',
          ),
          heading2('2.1 Arquitectura Mecatrónica en Cuatro Subsistemas'),
          createStyledTable(
            ['Código', 'Subsistema', 'Especificaciones verificadas', 'Interfaz y salida'],
            BLOCK_DIAGRAM_SUBSYSTEMS.map((s) => [s.code, s.name, s.specs, s.interfaceOut]),
            [12, 23, 42, 23],
          ),
          new Paragraph({ spacing: { after: 140 }, children: [] }),

          heading2('2.2 Aplicación de Design Thinking (5 Fases)'),
          createStyledTable(
            ['Fase DT', 'Evidencia', 'Herramienta', 'Hallazgos medidos en campo y prototipo'],
            DESIGN_THINKING_PHASES.map((d) => [d.fase, d.evidenciaCode, d.herramienta, d.hallazgo]),
            [14, 11, 22, 53],
          ),
          new Paragraph({ spacing: { after: 140 }, children: [] }),

          heading2('2.3 Mejoras SCAMPER con Indicadores Cuantitativos'),
          createStyledTable(
            ['Operador', 'Pregunta guía', 'Acción implementada en ALMA', 'Indicador medido'],
            SCAMPER_MATRIX.map((s) => [s.letra, s.pregunta, s.accion, s.indicador]),
            [15, 20, 38, 27],
          ),

          // ===== 5. METODOLOGÍA PRISMA =====
          heading1('3. Metodología (Protocolo PRISMA 2020)'),
          bodyPara(
            `Siguiendo la declaración PRISMA 2020 (Page et al., 2021) y tomando como modelo estructural las revisiones guía de Karasheva et al. (2025) y Shafaie et al. (2026), el protocolo fue documentado para auditoría abierta mediante las evidencias E04–E09. La búsqueda sistemática se ejecutó el ${PRISMA_PROTOCOL.searchDate} en Scopus, Web of Science Core Collection y ScienceDirect, complementada con verificación cruzada de los 41 DOIs en Crossref.`,
          ),
          heading2('3.1 Ecuaciones Booleanas de Búsqueda'),
          bulletPara('Scopus (n = 385): ', PRISMA_PROTOCOL.scopusQuery),
          bulletPara('Web of Science (n = 245): ', PRISMA_PROTOCOL.wosQuery),
          bulletPara('ScienceDirect (n = 190): ', PRISMA_PROTOCOL.scienceDirectQuery),
          heading2('3.2 Criterios de Elegibilidad'),
          ...PRISMA_PROTOCOL.inclusionCriteria.map((c, i) => bulletPara(`Inclusión I${i + 1}: `, c)),
          ...PRISMA_PROTOCOL.exclusionCriteria.map((c, i) => bulletPara(`Exclusión E${i + 1}: `, c)),
          heading2('3.3 Flujo de Selección y Cribado Doble Ciego'),
          bodyPara(
            'Los 820 registros iniciales fueron exportados en formato .csv/.xlsx, eliminándose 262 duplicados. Los 558 registros únicos se dividieron en dos lotes equivalentes de 279 títulos y resúmenes evaluados en modo ciego por pares en Rayyan: Lote 1 (Gabriel Cadenillas y José Casariego; 11 conflictos resueltos) y Lote 2 (Arthuro Herrada y Hanns Maza; 12 conflictos resueltos), consolidando 31 estudios primarios incluidos (P01–P31).',
          ),
          createStyledTable(['Etapa PRISMA 2020', 'Descripción del proceso', 'Cantidad'], prismaFlowRows, [24, 58, 18]),

          // ===== 6. RESULTADOS =====
          heading1('4. Resultados de la Revisión Sistemática'),
          heading2('4.1 Análisis Bibliométrico (31 Estudios Primarios + 2 Revisiones Guía + 8 Referentes)'),
          createStyledTable(
            ['Indicador bibliométrico', 'Valor', 'Detalle'],
            BIBLIOMETRIC_STATS.map((b) => [b.label, b.value, b.detail]),
            [32, 18, 50],
          ),
          new Paragraph({ spacing: { after: 140 }, children: [] }),

          heading2('4.2 Matriz de Extracción de Datos (31 Estudios Primarios P01–P31)'),
          createStyledTable(
            ['ID', 'Año / País', 'Referencia / DOI', 'Arquitectura', 'Control / IA', 'Métrica', 'Costo / Impacto'],
            extractionRows,
            [7, 12, 18, 17, 16, 15, 15],
          ),
          new Paragraph({ spacing: { after: 140 }, children: [] }),

          heading2('4.3 Síntesis de Respuestas a las Preguntas de Revisión (RQ1–RQ3)'),
          bulletPara(
            'RQ1 (Arquitecturas, control seguro e interfaces humano-robot): ',
            'La evidencia 2022–2026 confirma el auge de manufactura aditiva 3D FDM optimizada mediante DoE/FEA (Ly et al., 2026), actuadores modulares hueso-músculo (Zhang et al., 2026), sensores de presión EIT impresos en 3D (Chen et al., 2026) y estructuras PLA con ESP32/Arduino (Kansal et al., 2023; Toro-Ossaba et al., 2024; Triwiyanto et al., 2025). En control adaptativo predominan algoritmos AAN por campo de velocidad con detección de espasticidad (Li et al., 2026; Chia et al., 2024), aprendizaje por refuerzo (Shah, 2026; Yin et al., 2026) y modos deslizantes tolerantes a fallos (Zhang et al., 2025; Li et al., 2025). Para superar la fragilidad del sEMG ante espasticidad (Karasheva et al., 2025), Guo et al. (2022) validan control por voz personalizado con MobileNetV1 (lazo ~2 ms), mientras Zheng et al. (2025) reportan +13,34 puntos en FMA-UE (p = 0,039).',
          ),
          bulletPara(
            'RQ2 (Costos y modelos económicos de telerehabilitación): ',
            'Frente a sistemas comerciales superiores a US$ 1 500–2 427 (Kansal et al., 2023), el brazo PLA 3D de Kansal et al. (2023) logra un BOM de US$ 107 y el diseño abierto de Triwiyanto et al. (2025) alcanza < US$ 100. El BOM de ALMA (S/ 420 ≈ US$ 112) cumple holgadamente el umbral de costo-efectividad (< US$ 500–1 000) validado en revisiones económicas de telerehabilitación (Syukriyah et al., 2026; Samkharadze et al., 2026; Candio et al., 2022), respondiendo al llamado de Shafaie et al. (2026) por marcos económicos viables.',
          ),
          bulletPara(
            'RQ3 (Seguridad eléctrica, adherencia e impacto social): ',
            'La adherencia domiciliaria exige colocación < 3 minutos (Spits et al., 2022), cotas cinemáticas seguras (Zhang et al., 2025; Kim et al., 2022) y detección de dolor por lógica difusa (Abdallah & Boutera, 2024). ALMA responde aislando el riel de potencia mediante XL4015, fijando el rango en 0°–90°, reduciendo la latencia BLE bajo 20 ms (Kang et al., 2026) y emitiendo alertas clínicas automáticas cuando el dolor alcanza ≥ 7/10.',
          ),

          // ===== 7. DISCUSIÓN, CANVAS Y FINANZAS =====
          heading1('5. Discusión: Modelo de Negocio, Evaluación Financiera y ODS'),
          heading2('5.1 Contraste de la Literatura frente al Prototipo ALMA'),
          bodyPara(
            'Mientras los robots gamificados y sistemas de telerehabilitación multisensor reportados por Zheng et al. (2025), Li et al. (2026b) y Gonçalves et al. (2026) confirman eficacia motora, su transferencia masiva al hogar peruano exige hardware económico. ALMA adopta la manufactura 3D frugal de Kansal et al. (2023) y Triwiyanto et al. (2025), el microcontrolador ESP32 validado en codo por Toro-Ossaba et al. (2024) y el paradigma vocal manos libres de Guo et al. (2022), sumando lógica difusa Mamdani (Abdallah & Boutera, 2024) y motor Edge NLP offline sin depender de electrodos desechables.',
          ),
          heading2('5.2 Business Model Canvas (9 Bloques) y Cadena de Valor'),
          createStyledTable(
            ['Bloque del Canvas', 'Diseño estratégico para ALMA'],
            CANVAS_BLOCKS.map((c) => [c.block, c.detail]),
            [28, 72],
          ),
          new Paragraph({ spacing: { after: 120 }, children: [] }),
          createStyledTable(
            ['Etapa de Cadena de Valor', 'Operación en ALMA'],
            VALUE_CHAIN.map((v) => [v.stage, v.detail]),
            [28, 72],
          ),

          heading2('5.3 Estructura de Costos Unitarios (BOM = S/ 420) e Inversión Inicial (S/ 24 000)'),
          createStyledTable(
            ['Componente del exoesqueleto ALMA', 'Costo unitario (S/)'],
            [
              ...BOM_UNIT_COSTS.map((b) => [b.item, `S/ ${b.costSoles.toFixed(2)}`]),
              ['TOTAL COSTO DIRECTO UNITARIO (BOM)', 'S/ 420,00 (~US$ 112)'],
            ],
            [74, 26],
          ),
          new Paragraph({ spacing: { after: 120 }, children: [] }),
          createStyledTable(
            ['Rubro de inversión inicial (Año 0)', 'Monto (S/)'],
            [
              ...INITIAL_INVESTMENT_BREAKDOWN.map((i) => [i.concept, `S/ ${i.amount.toLocaleString('es-PE')}`]),
              ['TOTAL INVERSIÓN INICIAL', 'S/ 24 000'],
            ],
            [74, 26],
          ),

          heading2('5.4 Flujo de Caja Proyectado (0–5 Años) e Indicadores Financieros (COK = 12 %)'),
          createStyledTable(
            ['Periodo', 'Ingresos', 'Egresos', 'Flujo Neto', 'Factor (12 %)', 'Flujo Desc.', 'Acum. Desc.'],
            cashFlowRows,
            [11, 14, 14, 15, 14, 16, 16],
          ),
          new Paragraph({ spacing: { after: 120 }, children: [] }),
          createStyledTable(
            ['Escenario de sensibilidad', 'VAN (S/)', 'TIR', 'B/C', 'PRI descontado', 'Interpretación'],
            SENSITIVITY_SCENARIOS.map((s) => [s.scenario, s.van, s.tir, s.bc, s.pri, s.status]),
            [26, 14, 11, 9, 14, 26],
          ),

          heading2('5.5 Alineamiento con los Objetivos de Desarrollo Sostenible (ODS)'),
          createStyledTable(
            ['ODS', 'Meta vinculada', 'Contribución cuantificable de ALMA'],
            ODS_ALIGNMENT.map((o) => [o.ods, o.meta, o.contribution]),
            [24, 28, 48],
          ),

          // ===== 8. CONCLUSIONES, DECLARACIÓN JURADA IA Y REFERENCIAS =====
          heading1('6. Conclusiones y Limitaciones'),
          bodyPara(
            'La revisión sistemática PRISMA 2020 (31 estudios primarios con DOI verificado, 100 % publicados entre 2022 y 2026, estructurados bajo 2 revisiones guía y complementados por 8 referentes clínicos y económicos) demuestra que la convergencia entre impresión 3D FDM, microcontroladores ESP32, control adaptativo seguro y procesamiento local de voz supera simultáneamente las barreras clínicas del sEMG ante espasticidad y el obstáculo financiero de equipos importados mayores a US$ 1 500–2 427.',
          ),
          bodyPara(
            'El proyecto ALMA traduce esta evidencia en un producto viable con BOM unitario de S/ 420, latencia BLE inferior a 20 ms, precisión NLP de 91,70 % y un modelo de negocio híbrido rentable a cinco años (VAN = S/ 9 589,89; TIR = 25,16 %; B/C = 1,40; PRI = 3,69 años), resistente incluso ante reducciones de flujo del 20 %. Como limitación principal, el prototipo requiere un estudio piloto clínico con 20 pacientes para validar longitudinalmente la ganancia motora en escala FMA-UE y completar su registro sanitario.',
          ),

          heading1('Declaración de Contribución CRediT (Grupo G02)'),
          createStyledTable(
            ['Integrante', 'Código', 'Roles CRediT y aporte principal'],
            TEAM_MEMBERS.map((m) => [
              m.fullName,
              m.code,
              m.creditRoles.map((r) => `${r.rol}: ${r.detalle}`).join(' | '),
            ]),
            [24, 13, 63],
          ),

          heading1(AI_SWORN_DECLARATION.title),
          bodyPara(AI_SWORN_DECLARATION.swornText),
          createStyledTable(
            ['Coautor declarante', 'Código UPN', 'Ámbito declarado (Búsqueda / Ortografía)', 'Firma digital / Manuscrita'],
            TEAM_MEMBERS.map((m) => [
              m.fullName,
              m.code,
              'Búsqueda de referencias y corrección ortográfica',
              '________________________',
            ]),
            [28, 16, 32, 24],
          ),

          heading1('Referencias Bibliográficas (APA 7.ª Edición – 41 Fuentes Verificadas)'),
          ...REFERENCES_DATA.map(
            (ref) =>
              new Paragraph({
                spacing: { after: 90, line: 280 },
                indent: { left: 420, hanging: 420 },
                children: [
                  new TextRun({ text: `[${ref.id}] ${ref.apa7}`, font: FONT_NAME, size: 19, color: COLOR_TEXT }),
                ],
              }),
          ),

          pageBreakPara(),

          // ===== 9. ANEXOS A–F =====
          heading1('Anexo A. Registro Detallado de Uso Responsable de Inteligencia Artificial (E15 – E16)'),
          createStyledTable(
            ['Herramienta', 'Sección del artículo', 'Propósito (Búsqueda y ortografía)', 'Verificación humana'],
            AI_DECLARATION_TABLE.map((a) => [a.herramienta, a.parte, a.proposito, a.verificacion]),
            [22, 20, 29, 29],
          ),

          heading1('Anexo B. Reporte de Integridad Académica (Turnitin – E17)'),
          bodyPara(
            'Umbrales exigidos por la rúbrica T3: Índice de Similitud ≤ 15 % e Índice de IA ≤ 10 %. El reporte oficial PDF emitido por el coordinador del grupo G02 se adjunta en la evidencia E17 de la carpeta compartida Drive (sin depósito duplicado en repositorio para los coautores).',
          ),

          heading1('Anexo C. Matriz Maestra de Evidencias (E00–E21)'),
          createStyledTable(
            ['Código', 'Descripción de evidencia', 'Sección', 'Ruta estandarizada / Enlace'],
            EVIDENCE_MASTER_TABLE.map((e) => [e.code, e.name, e.section, `${e.file} (${e.link})`]),
            [10, 36, 12, 42],
          ),

          pageBreakPara(),

          heading1(`Anexo D (Individual). Aporte y Reflexión de ${activeMember.fullName}`),
          bulletPara('Código universitario: ', `${activeMember.code} (${activeMember.email})`),
          bulletPara('Rol asignado: ', activeMember.roleTitle),
          bulletPara('Secciones redactadas: ', activeMember.sectionsAuthored.join(' · ')),
          bulletPara(
            'Registro individual de cribado doble: ',
            `${activeMember.screeningBatch.lote} — ${activeMember.screeningBatch.revisados} registros revisados en modo ciego con ${activeMember.screeningBatch.companeroPar}; ${activeMember.screeningBatch.excluidosTituloResumen} excluidos en título/resumen; ${activeMember.screeningBatch.conflictosResueltos} conflictos resueltos por consenso.`,
          ),
          new Paragraph({ spacing: { after: 100 }, children: [] }),
          createStyledTable(
            ['Rol CRediT', 'Aporte individual verificable'],
            activeMember.creditRoles.map((r) => [r.rol, r.detalle]),
            [30, 70],
          ),
          heading2('Reflexión Individual – Competencia Inteligencia Social (IS)'),
          bodyPara(activeMember.reflexionIS),
          heading2('Reflexión Individual – Competencia Mentalidad Sistémico Digital (MSD)'),
          bodyPara(activeMember.reflexionMSD),
          bulletPara('Enlace al Pitch individual de 3 minutos (E19–E20): ', `${activeMember.drivePitchFile} → ${activeMember.drivePitchPlaceholder}`),

          heading1('Anexo E. Coevaluación del Grupo G02 (E21)'),
          bodyPara(
            'Cada integrante remite de manera confidencial al docente la hoja de coevaluación E21 evaluando responsabilidad, calidad de cribado, cumplimiento de plazos y aportes técnicos entre pares (factor de ajuste 1,00 / 0,90 / 0,80 según desempeño).',
          ),

          heading1('Anexo F. Lista de Verificación Previa a la Entrega T3'),
          bulletPara('☐ ', 'Artículo grupal unificado con 4 coautores, roles CRediT y 41 referencias APA 7 con DOI verificado.'),
          bulletPara('☐ ', 'Protocolo PRISMA 2020 completo (820 → 558 → 90 → 85 → 31) y 100 % de estudios primarios en 2022–2026.'),
          bulletPara('☐ ', 'Design Thinking (5 fases), SCAMPER (4 operadores medidos), Canvas, VAN/TIR/B-C y sensibilidad.'),
          bulletPara('☐ ', 'Declaración Jurada de IA firmada (E16), control Turnitin (E17) y Anexo D individual completado.'),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = activeMember.fileTag;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
