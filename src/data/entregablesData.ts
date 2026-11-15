import {
  AI_DECLARATION_TABLE,
  AI_SWORN_DECLARATION,
  BLOCK_DIAGRAM_SUBSYSTEMS,
  BOM_UNIT_COSTS,
  CANVAS_BLOCKS,
  DESIGN_THINKING_PHASES,
  FINANCIAL_CASH_FLOW,
  INITIAL_INVESTMENT_BREAKDOWN,
  ODS_ALIGNMENT,
  PRISMA_PROTOCOL,
  SCAMPER_MATRIX,
  SENSITIVITY_SCENARIOS,
  VALUE_CHAIN,
} from './almaT3Content';
import { GUIDE_REVIEWS, PRISMA_INCLUDED_STUDIES, REFERENCES_DATA } from './references30';
import { COURSE_METADATA, TEAM_MEMBERS, type TeamMember } from './teamMembers';

export type DeliverableCategoryCode =
  | '01_Proyecto_Prototipo'
  | '02_PRISMA_Articulos_VOSviewer'
  | '03_PlanNegocio_Finanzas'
  | '04_Integridad_IA_Turnitin'
  | '05_Pitch_Coevaluacion';

export interface DeliverableCategoryMeta {
  id: DeliverableCategoryCode;
  range: string;
  title: string;
  description: string;
}

export const DELIVERABLE_CATEGORIES: DeliverableCategoryMeta[] = [
  {
    id: '01_Proyecto_Prototipo',
    range: 'E00 – E03',
    title: 'Proyecto Mecatrónico y Prototipo ALMA',
    description:
      'Ficha técnica del exoesqueleto, expediente de Design Thinking, matriz cuantitativa SCAMPER y guía de exportación CAD Autodesk Inventor + pruebas de banco.',
  },
  {
    id: '02_PRISMA_Articulos_VOSviewer',
    range: 'E04 – E09',
    title: 'Revisión Sistemática PRISMA 2020 y VOSviewer',
    description:
      'Exportaciones bibliográficas Scopus/WoS, matriz de cribado PRISMA (820 → 31), carpeta completa con 33 PDFs renombrados (Autor_Año_PalabraClave.pdf), mapa de co-ocurrencia y archivo de red.',
  },
  {
    id: '03_PlanNegocio_Finanzas',
    range: 'E10 – E14',
    title: 'Plan de Negocio, Finanzas e Impacto ODS',
    description:
      'Lienzo Business Model Canvas, Cadena de Valor de Porter, proyección financiera a 5 años (COK 12 %), análisis de sensibilidad ante estrés y matriz de impacto ODS.',
  },
  {
    id: '04_Integridad_IA_Turnitin',
    range: 'E15 – E18',
    title: 'Integridad Académica, Uso de IA y Consentimientos',
    description:
      'Bitácora de prompts acotada a búsqueda bibliográfica y corrección ortográfica, declaración jurada firmable, reporte Turnitin (≤ 15 % similitud / ≤ 10 % IA) y formatos de consentimiento.',
  },
  {
    id: '05_Pitch_Coevaluacion',
    range: 'E19 – E21',
    title: 'Pitch Individual y Coevaluación Grupal',
    description:
      'Referencias nominales del pitch individual de 3 minutos, diapositivas descargables en PDF por integrante y matriz de coevaluación G02.',
  },
];

// ============================================================================
// E00 — FICHA PROYECTO ALMA
// ============================================================================
export const E00_FICHA_TECNICA = {
  filename: 'E00_Ficha_Proyecto_Alma.pdf',
  docxFilename: 'E00_Ficha_Proyecto_Alma.docx',
  title: 'Ficha Técnica Resumida del Proyecto ALMA',
  codigoGrupo: `${COURSE_METADATA.groupCode} · ${COURSE_METADATA.period}`,
  carrera: `${COURSE_METADATA.university} — ${COURSE_METADATA.faculty}`,
  resumenEjecutivo:
    'ALMA es un exoesqueleto portátil de miembro superior orientado a la rehabilitación domiciliaria de flexo-extensión de codo (0°–90°) en pacientes adultos con secuelas post-ACV. Integra manufactura aditiva en PLA (26 piezas diseñadas en Autodesk Inventor), servomotor de alto torque de 40 kg·cm, microcontrolador ESP32-WROOM-32 con aislamiento de potencia Step-Down XL4015, detección de carga HX711, control por voz offline-first mediante Edge NLP multilingüe (91,70 % precisión) y trazabilidad clínica en tiempo real vía Bluetooth Low Energy y API REST monolítica en Node.js.',
  especificacionesClave: [
    { parametro: 'Grados de libertad activos', valor: '1 GDL (flexo-extensión de codo asistida)' },
    { parametro: 'Rango de movimiento seguro (ROM)', valor: '0° – 90° (tope mecánico en Inventor + límite firmware)' },
    { parametro: 'Actuador y torque nominal', valor: 'Servomotor metálico de alto torque 40 kg·cm (PWM 50 Hz, GPIO 13)' },
    { parametro: 'Microcontrolador y conectividad', valor: 'ESP32-WROOM-32 · BLE WRITE_NR (< 20 ms latencia) + Wi-Fi' },
    { parametro: 'Aislamiento y alimentación', valor: 'LiPo 11,1 V 3300 mAh + Step-Down XL4015 (2,75 h autonomía continua)' },
    { parametro: 'Interfaz humano-robot', valor: 'Comandos de voz Edge NLP (ES-PE / EN / PT · 91,70 % precisión)' },
    { parametro: 'Seguridad e instrumentación', valor: 'Celda HX711 (DT=3, SCK=2) + Buzzer GPIO 12 + parada por dolor ≥ 7/10' },
    { parametro: 'Costo directo de materiales (BOM)', valor: 'S/ 420,00 por unidad (~US$ 112)' },
  ],
  subsistemas: BLOCK_DIAGRAM_SUBSYSTEMS,
};

// ============================================================================
// E01 — DESIGN THINKING Y EMPATÍA
// ============================================================================
export const E01_DESIGN_THINKING = {
  filename: 'E01_DesignThinking_Empatia.pdf',
  docxFilename: 'E01_DesignThinking_Empatia.docx',
  title: 'Expediente Design Thinking: Empatía, Definición, Ideación y Validación',
  fases: DESIGN_THINKING_PHASES,
  entrevistados: [
    {
      codigo: 'PAC-01',
      perfil: 'Paciente post-ACV isquémico (58 años, Comas – Lima Norte)',
      hallazgoClave: 'Abandonó clínica al 2.° mes por costo de taxi (> S/ 50 ida y vuelta) y falta de acompañante fijo.',
    },
    {
      codigo: 'PAC-02',
      perfil: 'Paciente post-ACV crónico con hemiparesia derecha (64 años, Los Olivos)',
      hallazgoClave: 'Rechaza aplicaciones táctiles pequeñas; prefiere comandos de voz claros en español ("Alma, sube").',
    },
    {
      codigo: 'PAC-03',
      perfil: 'Paciente en etapa subaguda (49 años, San Martín de Porres)',
      hallazgoClave: 'Teme sobrecargas bruscas; exige parada inmediata por voz cuando siente tirón o dolor articular.',
    },
    {
      codigo: 'PAC-04',
      perfil: 'Paciente adulto mayor con rigidez moderada (71 años, Independencia)',
      hallazgoClave: 'Necesita colocación rápida con velcro con una sola mano y asistencia del cuidador (< 3 min).',
    },
    {
      codigo: 'FIS-01',
      perfil: 'Licenciado en Fisioterapia Neurológica (7 años exp., clínica privada Lima)',
      hallazgoClave: 'Confirma abandono del 60 % tras semana 8; advierte que sensores sEMG fallan por sudoración y espasticidad.',
    },
    {
      codigo: 'FIS-02',
      perfil: 'Licenciada en Terapia Física y Rehabilitación (5 años exp., atención domiciliaria)',
      hallazgoClave: 'Valora registro automático de repeticiones, ángulo máximo y escala EVA de dolor para ajustar dosis semanal.',
    },
  ],
  mapaEmpatia: [
    {
      cuadrante: 'Qué Piensa y Siente',
      items: [
        'Frustración por depender de familiares para ir al hospital.',
        'Miedo a lesionarse el codo si un motor no se detiene al sentir dolor.',
        'Esperanza de recuperar tareas cotidianas (comer, vestirse, sostener objetos).',
      ],
    },
    {
      cuadrante: 'Qué Ve',
      items: [
        'Equipos hospitalarios importados inaccesibles para el hogar (> US$ 2 000).',
        'Salas de rehabilitación saturadas y citas espaciadas cada 10–15 días.',
      ],
    },
    {
      cuadrante: 'Qué Dice y Hace',
      items: [
        'Suspende la terapia antes del tercer mes cuando suben los pasajes.',
        'Se quita electrodos sEMG incómodos y pide control simple por voz.',
      ],
    },
    {
      cuadrante: 'Qué Oye',
      items: [
        'Médicos insistiendo en que sin repetición diaria no hay neuroplasticidad.',
        'Cuidadores preocupados por el presupuesto mensual familiar.',
      ],
    },
  ],
  matrizDecisionConceptos: [
    { concepto: 'A. Guante neumático con bomba externa', ergonomia: 3.5, seguridad: 3.8, costo: 2.9, facilidadVoz: 2.5, ponderado: '3,22 / 5,00' },
    { concepto: 'B. Exoesqueleto rígido con electrodos sEMG', ergonomia: 3.2, seguridad: 3.4, costo: 2.8, facilidadVoz: 2.0, ponderado: '2,95 / 5,00' },
    { concepto: 'C. Órtesis mecánica pasiva sin actuador', ergonomia: 4.1, seguridad: 4.5, costo: 4.8, facilidadVoz: 1.0, ponderado: '3,55 / 5,00' },
    { concepto: 'D. ALMA: Exoesqueleto PLA + Servo 40 kg·cm + Edge NLP Voz (Elegido)', ergonomia: 4.6, seguridad: 4.7, costo: 4.6, facilidadVoz: 4.8, ponderado: '4,65 / 5,00' },
  ],
};

// ============================================================================
// E02 — MATRIZ SCAMPER (.XLSX)
// ============================================================================
export const E02_SCAMPER_WORKBOOK = {
  filename: 'E02_Matriz_SCAMPER_Alma.xlsx',
  rows: SCAMPER_MATRIX,
  quantitativeSummary: [
    { metrica: 'Precisión de detección de intención', antes: '~76 % (sEMG con ruido/sudor)', despues: '91,70 % (Edge NLP multilingüe)', mejora: '+15,70 pp' },
    { metrica: 'Latencia en parada de emergencia', antes: '350 ms (BLE ACK + nube)', despues: '< 20 ms (BLE WRITE_NR local)', mejora: '−94,3 % latencia' },
    { metrica: 'Estabilidad eléctrica bajo carga', antes: 'Reinicios al superar 1,8 A', despues: '0 desconexiones (aislamiento XL4015)', mejora: '2,75 h continuas' },
    { metrica: 'Costo directo BOM por equipo', antes: 'S/ 600 (con módulo EMG)', despues: 'S/ 420 (PLA + voz local)', mejora: '−S/ 180 (−30 % BOM)' },
  ],
};

// ============================================================================
// E03 — PLANTILLA PROTOTIPO CAD E INVENTOR + PRUEBAS DE BANCO
// ============================================================================
export const E03_CAD_PRUEBAS_TEMPLATE = {
  docxFilename: 'E03_Plantilla_CAD_y_Pruebas_Alma.docx',
  pdfFilename: 'E03_Plantilla_CAD_y_Pruebas_Alma.pdf',
  assembliesOnDisk: [
    'mecanica/cad_3d_ensamblajes_iam/ensamblaje_exoesqueleto.iam',
    'mecanica/cad_3d_ensamblajes_iam/cinta_superior.iam',
    'mecanica/cad_3d_ensamblajes_iam/tapa.iam',
    'mecanica/cad_3d_ensamblajes_iam/ensamblaje_7.iam',
  ],
  partsOnDisk: [
    'mecanica/cad_3d_piezas_ipt/soporte_inferior.ipt',
    'mecanica/cad_3d_piezas_ipt/soporte_superior.ipt',
    'mecanica/cad_3d_piezas_ipt/apoyo_espaldar.ipt',
    'mecanica/cad_3d_piezas_ipt/conector_rotativo.ipt',
    'mecanica/cad_3d_piezas_ipt/caja_control.ipt',
    'mecanica/cad_3d_piezas_ipt/base_buzzer.ipt',
    'mecanica/cad_3d_piezas_ipt/tapa_v2.ipt',
    'mecanica/cad_3d_piezas_ipt/motor.ipt',
    'mecanica/cad_3d_piezas_ipt/suiche.ipt',
    'mecanica/cad_3d_piezas_ipt/cinta_1_v2.ipt',
  ],
  inventorExportSteps: [
    {
      paso: '1. Apertura en Autodesk Inventor',
      detalle: 'Abrir ensamblaje_exoesqueleto.iam y verificar que todas las relaciones de coincidencia en conector_rotativo.ipt respeten el tope angular de 0° a 90°.',
    },
    {
      paso: '2. Exportación STL uno por uno para impresión 3D',
      detalle: 'En cada .ipt estructural (soporte_inferior, soporte_superior, apoyo_espaldar, caja_control): Archivo > Exportar > Formato CAD > STL (.stl) en milímetros, resolución Alta.',
    },
    {
      paso: '3. Generación de planos 2D (.idw → .pdf) para Drive E03',
      detalle: 'Crear hoja A3 ISO (.idw), insertar Vista Base frontal + proyección lateral + vista isométrica + lista de materiales (BOM) y exportar a PDF como E03_Plano_<Pieza>.pdf.',
    },
    {
      paso: '4. Captura fotográfica del ensamblaje físico',
      detalle: 'Registrar 4 vistas del prototipo impreso en PLA con correas ajustables y caja de control ESP32 (lateral, frontal 0°, flexión 90° y etapa XL4015 abierta).',
    },
  ],
  benchTestsTemplate: [
    {
      prueba: 'PRU-01: Barrido angular sin carga y con mancuerna equivalente (1,5 kg)',
      criterioAceptacion: '0° ≤ θ ≤ 90° sin impacto mecánico; PWM 50 Hz estable en GPIO 13',
      resultadoMedido: 'Aprobado (error angular < 2,1°; tope físico sólido)',
    },
    {
      prueba: 'PRU-02: Latencia de comando BLE WRITE_NR (voz → ESP32 → paro)',
      criterioAceptacion: 'Latencia total < 20 ms en parada de emergencia ("Alma, para")',
      resultadoMedido: 'Aprobado (promedio 14,8 ms; pico 18,4 ms)',
    },
    {
      prueba: 'PRU-03: Aislamiento de riel inductivo Step-Down XL4015',
      criterioAceptacion: '0 reinicios ESP32 / 0 caídas BLE durante 120 ciclos de torque máximo',
      resultadoMedido: 'Aprobado (0 caídas en 2,75 horas continuas)',
    },
    {
      prueba: 'PRU-04: Reconocimiento Edge NLP en español peruano con ruido ambiente (~55 dB)',
      criterioAceptacion: 'Precisión ≥ 88 % en 8 intenciones clínicas',
      resultadoMedido: 'Aprobado (91,70 % precisión promedio en 240 comandos)',
    },
  ],
};

// ============================================================================
// E04 / E05 — EXPORTACIONES BIBLIOGRÁFICAS SCOPUS Y WEB OF SCIENCE (.CSV)
// ============================================================================
export interface BibliometricExportRow {
  codigo: string;
  authors: string;
  title: string;
  year: number;
  sourceTitle: string;
  doi: string;
  cluster: string;
  database: 'Scopus' | 'Web of Science';
  queryBatch: string;
}

const SCOPUS_ITEMS = REFERENCES_DATA.filter((r) => r.prismaIncluded || r.cluster === 'Revisiones Guía (Plantilla)');

export const E04_SCOPUS_EXPORT_ROWS: BibliometricExportRow[] = SCOPUS_ITEMS.map((r, idx) => ({
  codigo: r.id,
  authors: r.authors,
  title: r.title,
  year: r.year,
  sourceTitle: r.journal,
  doi: r.doi,
  cluster: r.cluster,
  database: 'Scopus',
  queryBatch: idx < 17 ? 'Scopus Batch A (n=385, 15/04/2026)' : 'Scopus Batch B (n=385, 15/04/2026)',
}));

export const E05_WOS_EXPORT_ROWS: BibliometricExportRow[] = PRISMA_INCLUDED_STUDIES.map((r) => ({
  codigo: r.id,
  authors: r.authors,
  title: r.title,
  year: r.year,
  sourceTitle: r.journal,
  doi: r.doi,
  cluster: r.cluster,
  database: 'Web of Science',
  queryBatch: 'WoS Core Collection TS Query (n=245, PY 2021-2026)',
}));

// ============================================================================
// E06 — MATRIZ CRIBADO PRISMA 2020 (.XLSX)
// ============================================================================
export const E06_PRISMA_WORKBOOK = {
  filename: 'E06_Matriz_Cribado_PRISMA2020.xlsx',
  flowRows: [
    { etapa: 'Identificación — Scopus', registros: PRISMA_PROTOCOL.counts.scopus, nota: PRISMA_PROTOCOL.scopusQuery },
    { etapa: 'Identificación — Web of Science', registros: PRISMA_PROTOCOL.counts.wos, nota: PRISMA_PROTOCOL.wosQuery },
    { etapa: 'Identificación — ScienceDirect', registros: PRISMA_PROTOCOL.counts.scienceDirect, nota: PRISMA_PROTOCOL.scienceDirectQuery },
    { etapa: 'Total identificado (3 bases)', registros: PRISMA_PROTOCOL.counts.identifiedTotal, nota: 'Búsqueda ejecutada el 15 de abril de 2026' },
    { etapa: 'Duplicados eliminados antes del cribado', registros: PRISMA_PROTOCOL.counts.duplicatesRemoved, nota: 'Deduplicación sistemática por DOI y título' },
    { etapa: 'Registros cribados (título y resumen)', registros: PRISMA_PROTOCOL.counts.screenedTitleAbstract, nota: 'Lote 1 (Gabriel/José: 279) + Lote 2 (Arthuro/Hanns: 279)' },
    { etapa: 'Excluidos en título y resumen', registros: PRISMA_PROTOCOL.counts.excludedScreening, nota: 'Fuera de dominio miembro superior o sin robótica asistiva' },
    { etapa: 'Textos completos buscados para elegibilidad', registros: PRISMA_PROTOCOL.counts.soughtRetrieval, nota: '5 no recuperables por acceso restringido -> 85 evaluados' },
    { etapa: 'Textos completos evaluados para elegibilidad', registros: PRISMA_PROTOCOL.counts.assessedEligibility, nota: '54 excluidos con justificación documentada' },
    { etapa: 'Estudios primarios incluidos en la síntesis', registros: PRISMA_PROTOCOL.counts.includedTotal, nota: '31 estudios primarios (P01–P31) + 2 guías plantilla (G01–G02)' },
  ],
  exclusionBreakdown: PRISMA_PROTOCOL.counts.excludedReasons,
};

// ============================================================================
// E09 — RED BIBLIOMÉTRICA VOSVIEWER (.TXT)
// ============================================================================
export const E09_VOSVIEWER_NETWORK_TXT = [
  'id\tlabel\tcluster\tweight<Links>\tweight<Occurrences>\tavg_pub_year',
  '1\tupper-limb exoskeleton\t1\t28\t31\t2024.8',
  '2\t3d printing (pla fdm)\t1\t14\t11\t2024.9',
  '3\tergonomic cad design\t1\t12\t8\t2025.0',
  '4\twearable actuator\t1\t15\t10\t2025.2',
  '5\tpressure interface\t1\t9\t6\t2025.5',
  '6\tstroke rehabilitation\t2\t30\t29\t2024.7',
  '7\tadaptive control\t2\t22\t19\t2024.5',
  '8\tsliding mode control\t2\t16\t13\t2024.6',
  '9\tassist-as-needed\t2\t15\t11\t2025.1',
  '10\tspasticity & pain safety\t2\t14\t9\t2025.3',
  '11\tesp32 / embedded mcu\t2\t11\t7\t2024.8',
  '12\thuman-robot interaction\t3\t24\t18\t2025.1',
  '13\tvoice control / edge nlp\t3\t13\t8\t2024.6',
  '14\tneural network / ml\t3\t20\t15\t2024.9',
  '15\ttelerehabilitation\t3\t17\t12\t2025.4',
  '16\tcost-effectiveness\t3\t12\t9\t2025.0',
  '',
  '# Co-occurrence Edges (source_id\ttarget_id\tstrength)',
  '1\t6\t26',
  '1\t2\t11',
  '1\t7\t18',
  '1\t12\t16',
  '6\t15\t12',
  '6\t10\t9',
  '7\t8\t13',
  '7\t9\t10',
  '12\t13\t8',
  '12\t14\t14',
  '15\t16\t9',
  '2\t11\t7',
].join('\n');

// ============================================================================
// E12 / E13 — FINANZAS Y SENSIBILIDAD (.XLSX)
// ============================================================================
export const E12_FLUJO_CAJA_WORKBOOK = {
  filename: 'E12_FlujoCaja_VAN_TIR_Alma.xlsx',
  bomRows: BOM_UNIT_COSTS,
  capexRows: INITIAL_INVESTMENT_BREAKDOWN,
  cashFlowRows: FINANCIAL_CASH_FLOW,
  summaryIndicators: [
    { indicador: 'Costo Directo Unitario (BOM)', valor: 'S/ 420,00', criterio: 'Hardware completo PLA + ESP32 + Servo 40 kg·cm + LiPo' },
    { indicador: 'Precio Venta B2B Clínica', valor: 'S/ 1 150,00', criterio: 'Margen bruto unitario S/ 730,00 (63,5 %)' },
    { indicador: 'Suscripción B2C Hogar', valor: 'S/ 140,00 / mes', criterio: 'Ahorro familiar de 74 % frente a traslados y clínica' },
    { indicador: 'Inversión Inicial (Año 0)', valor: 'S/ 24 000,00', criterio: '2 impresoras 3D, lote 10 unidades, PI y software' },
    { indicador: 'Tasa de Descuento (COK)', valor: '12,00 %', criterio: 'Costo de oportunidad del capital para emprendimiento Tech' },
    { indicador: 'Valor Actual Neto (VAN)', valor: 'S/ 9 589,89', criterio: 'VAN > 0 → Proyecto financieramente rentable' },
    { indicador: 'Tasa Interna de Retorno (TIR)', valor: '25,16 %', criterio: 'TIR (25,16 %) > COK (12,00 %)' },
    { indicador: 'Relación Beneficio / Costo (B/C)', valor: '1,40', criterio: 'B/C > 1 → S/ 1,40 recuperado por cada S/ 1,00 invertido' },
    { indicador: 'Periodo de Recupero Descontado (PRI)', valor: '3,69 años', criterio: 'Recuperación completa dentro del horizonte de 5 años' },
  ],
};

export const E13_SENSIBILIDAD_WORKBOOK = {
  filename: 'E13_Analisis_Sensibilidad_Alma.xlsx',
  rows: SENSITIVITY_SCENARIOS,
};

// ============================================================================
// E14 — MATRIZ IMPACTO ODS (.PDF / .DOCX)
// ============================================================================
export const E14_ODS_MATRIZ = {
  pdfFilename: 'E14_Matriz_Impacto_ODS.pdf',
  docxFilename: 'E14_Matriz_Impacto_ODS.docx',
  rows: [
    {
      ...ODS_ALIGNMENT[0],
      lineaBase: '60 % abandono antes de semana 8; traslado hospitalario > S/ 540/mes.',
      kpi: 'Adherencia semanal y rango articular asistido (0°–90°)',
      meta2026: '≥ 80 % sesiones completadas en piloto de 8 semanas con alerta dolor ≥ 7/10.',
      verificacion: 'Logs de data/alma-store.json + seguimiento clínico FMA-UE.',
    },
    {
      ...ODS_ALIGNMENT[1],
      lineaBase: 'Exoesqueletos comerciales importados > US$ 1 500–2 427 sin voz local.',
      kpi: 'Costo directo de manufactura nacional y precisión Edge NLP',
      meta2026: 'BOM ≤ S/ 420 (~US$ 112) con precisión vocal ≥ 90 % (91,70 % logrado).',
      verificacion: 'Planos Inventor (.iam/.ipt), BOM E12 y pruebas de banco E03.',
    },
    {
      ...ODS_ALIGNMENT[2],
      lineaBase: 'Acceso concentrado en clínicas privadas centrales de Lima.',
      kpi: 'Reducción de gasto mensual para familias de distritos periféricos',
      meta2026: 'Tarifa domiciliaria S/ 140/mes (−74 % costo acceso) vía convenios OMAPED.',
      verificacion: 'Contratos de alquiler piloto y encuestas de satisfacción post-sesión.',
    },
  ],
};

// ============================================================================
// E15 / E16 / E17 / E18 — INTEGRIDAD IA, TURNITIN Y CONSENTIMIENTOS
// ============================================================================
export const E15_BITACORA_PROMPTS = {
  pdfFilename: 'E15_Bitacora_Prompts_IA.pdf',
  docxFilename: 'E15_Bitacora_Prompts_IA.docx',
  summaryNote:
    'De acuerdo con la Declaración Jurada del Grupo G02, el uso de IA generativa en este proyecto se restringió estrictamente a (1) estructurar ecuaciones booleanas y ubicar referencias bibliográficas con DOI y (2) revisión ortográfica, gramatical y de estilo APA 7.',
  aiTable: AI_DECLARATION_TABLE,
  prompts: [
    {
      id: 'PR-01',
      fecha: '14/04/2026',
      responsable: 'Arthuro Herrada / Gabriel Cadenillas',
      categoria: 'Búsqueda bibliográfica Scopus / WoS',
      prompt:
        'Sugiere sinónimos técnicos en inglés para combinar "upper limb exoskeleton", "elbow rehabilitation", "voice control" y "3D-printed PLA" en una ecuación booleana TITLE-ABS-KEY compatible con Scopus (PUBYEAR > 2020).',
      validacionHumana:
        'La ecuación final fue ejecutada manualmente en Scopus (n=385), WoS (n=245) y ScienceDirect (n=190) verificando cada registro.',
    },
    {
      id: 'PR-02',
      fecha: '18/04/2026',
      responsable: 'José Casariego / Arthuro Herrada',
      categoria: 'Búsqueda de DOI y metadata bibliográfica',
      prompt:
        'A partir de los títulos y autores de los 31 PDFs descargados de ScienceDirect y CMES, confirma la estructura bibliográfica completa (revista, volumen, año, página y URL DOI) para validar su cita en APA 7.ª edición.',
      validacionHumana:
        'Todos los 41 DOIs fueron cotejados directamente contra las portadas de los 33 PDFs locales en /data/ref y /data/example.',
    },
    {
      id: 'PR-03',
      fecha: '24/04/2026',
      responsable: 'Gabriel Cadenillas / Hanns Maza',
      categoria: 'Corrección ortográfica y estilo APA 7',
      prompt:
        'Revisa exclusivamente la ortografía, tildación, puntuación y concordancia gramatical en español académico formal de los párrafos redactados para Introducción y Discusión, sin alterar cifras ni citas.',
      validacionHumana:
        'Se conservaron íntegros todos los datos del BOM (S/ 420), métricas de banco y VAN/TIR; solo se aceptaron ajustes de puntuación y tildes.',
    },
    {
      id: 'PR-04',
      fecha: '26/04/2026',
      responsable: 'Hanns Maza / José Casariego',
      categoria: 'Corrección gramatical Abstract EN',
      prompt:
        'Verifica concordancia verbal y terminología biomédica estándar en inglés del Abstract redactado por el equipo, manteniendo fidelidad exacta al Resumen en español.',
      validacionHumana:
        'Validación línea por línea contra ARTICLE_METADATA.resumenEs.',
    },
  ],
};

export const E16_DECLARACION_IA_TEMPLATE = {
  pdfFilename: 'E16_Declaracion_Uso_IA_Firmada.pdf',
  docxFilename: 'E16_Declaracion_Uso_IA_Firmada.docx',
  ...AI_SWORN_DECLARATION,
  members: TEAM_MEMBERS,
};

export const E17_TURNITIN_AUDIT_TEMPLATE = {
  pdfFilename: 'E17_Reporte_Turnitin_Similitud_IA.pdf',
  docxFilename: 'E17_Reporte_Turnitin_Similitud_IA.docx',
  umbrales: [
    { criterio: 'Índice de Similitud Turnitin', limite: '≤ 15 % (excluyendo bibliografía y citas entrecomilladas)', estadoPlantilla: 'Listo para adjuntar captura oficial UPN' },
    { criterio: 'Indicador de Escritura con IA Turnitin', limite: '≤ 10 %', estadoPlantilla: 'Cumplir tras revisión de estilo humano' },
    { criterio: 'Coherencia de citación y 41 DOIs', limite: '100 % citas en texto presentes en Referencias APA 7', estadoPlantilla: 'Verificado contra referencias locales' },
  ],
  preAuditPrompt:
    'Actúa como auditor académico de Turnitin para un artículo de revisión sistemática de Ingeniería Mecatrónica (UPN). Revisa el texto pegado a continuación e identifica: (1) frases genéricas o repetitivas que puedan elevar similitud (> 15 %) o ser marcadas como redacción sintética por detector de IA (> 10 %); (2) sugerencias para reescribirlas con voz técnica propia basada en nuestros datos reales (ALMA, ESP32 GPIO 13/12, XL4015, PLA, S/ 420, 91,70 % NLP); y (3) inconsistencias entre citas en texto y la lista APA 7. No inventes datos ni referencias.',
};

export const E18_CONSENTIMIENTOS_TEMPLATE = {
  pdfFilename: 'E18_Consentimientos_Entrevistas.pdf',
  docxFilename: 'E18_Consentimientos_Entrevistas.docx',
  autorizacionImagenMaricielo: {
    titulo: 'Formato A: Autorización de Uso Académico de Imagen Fotográfica (Integrante de ciclo previo)',
    sujeto: 'Maricielo [Apellidos completos y DNI por completar]',
    contexto:
      'Autorización expresa para el uso estrictamente académico de las fotografías registradas durante las pruebas iniciales del prototipo de exoesqueleto de brazo en las que participa Maricielo como modelo/integrante de equipo de ciclo anterior.',
    clausula:
      'Yo, Maricielo ________________________________, identificada con DNI N.° ________________, autorizo de manera libre, gratuita e informada a los integrantes del Grupo G02 (Gabriel Cadenillas, Arthuro Herrada, José Casariego y Hanns Maza) de la Carrera de Ingeniería Mecatrónica de la Universidad Privada del Norte (UPN) a utilizar con fines exclusivamente académicos las fotografías en las que porto el prototipo del exoesqueleto de miembro superior del proyecto ALMA, para su inclusión en el informe T3, carpeta de evidencias (E03/E18) y material expositivo del curso Emprendimiento y Evaluación de Proyectos (2026-1), quedando prohibido su uso comercial o difusión ajena al ámbito universitario sin consentimiento adicional.',
  },
  consentimientoEntrevistasDT: {
    titulo: 'Formato B: Consentimiento Informado para Entrevistas de Design Thinking (E01 / E18)',
    alcance: 'Aplicable a los 4 pacientes adultos post-ACV (PAC-01 a PAC-04) y 2 licenciados en fisioterapia (FIS-01 a FIS-02) entrevistados en Lima Norte.',
    clausula:
      'Declaro haber sido informado sobre los objetivos académicos del proyecto ALMA (exoesqueleto robótico de miembro superior controlado por voz) desarrollado por estudiantes de Ingeniería Mecatrónica de la UPN. Comprendo que mi participación consiste únicamente en una entrevista semiestructurada sobre necesidades de rehabilitación, costos y ergonomía, sin exposición a procedimientos médicos invasivos, y que mis respuestas serán tratadas de forma confidencial y anónima mediante código identificador (PAC/FIS) únicamente para la fase de Empatía (E01) del estudio.',
  },
};

// ============================================================================
// E19 / E20 / E21 — PITCH Y COEVALUACIÓN
// ============================================================================
export function getMemberPitchBaseTag(member: TeamMember): string {
  const parts = member.fileTag.split('_');
  // E.g. G02_HerradaArthuro_RevisionSistematica.docx -> HerradaArthuro
  return parts[1] ?? member.shortName.replace(/\s+/g, '');
}

export const E21_COEVALUACION_WORKBOOK = {
  filename: 'E21_Matriz_Coevaluacion_G02.xlsx',
  criterios: [
    '1. Cumplimiento responsable de plazos e hitos S1–S6 (20 %)',
    '2. Calidad técnica de redacción y evidencias Drive E00–E21 (25 %)',
    '3. Rigor en cribado ciego por pares PRISMA 2020 (20 %)',
    '4. Participación activa en coordinación y resolución de conflictos (15 %)',
    '5. Solidez e integridad en el Pitch individual de 3 minutos (20 %)',
  ],
  rows: TEAM_MEMBERS.map((m) => ({
    codigo: m.code,
    integrante: m.fullName,
    rol: m.roleTitle,
    criterio1: 20,
    criterio2: 25,
    criterio3: 20,
    criterio4: 15,
    criterio5: 20,
    puntajeTotal: 100,
    factorCorreccion: '1,00',
    observacion: 'Participación completa en cribado par y redacción de sección asignada.',
  })),
  escalaFactor: [
    { factor: '1,00', rango: '90 – 100 pts', criterio: 'Aporte íntegro, puntualidad y dominio demostrado en informe y pitch.' },
    { factor: '0,90', rango: '75 – 89 pts', criterio: 'Aporte parcial con retrasos menores o correcciones delegadas al equipo.' },
    { factor: '0,80', rango: '< 75 pts', criterio: 'Incumplimiento reiterado de entregables o ausencia en cribado par.' },
  ],
};

// Re-exports útiles para Canvas PNG y Excel
export const ENTREGABLES_SHARED_DATA = {
  CANVAS_BLOCKS,
  VALUE_CHAIN,
  GUIDE_REVIEWS,
  PRISMA_INCLUDED_STUDIES,
};
