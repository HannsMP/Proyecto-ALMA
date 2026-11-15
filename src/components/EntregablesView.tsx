import { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  RefreshCw,
  Search,
} from 'lucide-react';
import {
  CANVAS_BLOCKS,
  PRISMA_PROTOCOL,
  VALUE_CHAIN,
} from '../data/almaT3Content';
import {
  DELIVERABLE_CATEGORIES,
  E00_FICHA_TECNICA,
  E01_DESIGN_THINKING,
  E02_SCAMPER_WORKBOOK,
  E03_CAD_PRUEBAS_TEMPLATE,
  E04_SCOPUS_EXPORT_ROWS,
  E05_WOS_EXPORT_ROWS,
  E06_PRISMA_WORKBOOK,
  E09_VOSVIEWER_NETWORK_TXT,
  E12_FLUJO_CAJA_WORKBOOK,
  E13_SENSIBILIDAD_WORKBOOK,
  E14_ODS_MATRIZ,
  E15_BITACORA_PROMPTS,
  E16_DECLARACION_IA_TEMPLATE,
  E17_TURNITIN_AUDIT_TEMPLATE,
  E18_CONSENTIMIENTOS_TEMPLATE,
  E21_COEVALUACION_WORKBOOK,
  getMemberPitchBaseTag,
  type DeliverableCategoryCode,
} from '../data/entregablesData';
import { ROLE_PRESENTATIONS } from '../data/presentationsData';
import { PRISMA_INCLUDED_STUDIES } from '../data/references30';
import { TEAM_MEMBERS, type TeamMember } from '../data/teamMembers';
import {
  downloadCsvFile,
  downloadDataUrlPng,
  downloadExcelWorkbook,
  downloadPitchSlidesPdf,
  downloadSimplePdf,
  downloadTemplateDocx,
  downloadTextFile,
  generateBusinessModelCanvasPng,
  generateCadenaValorPng,
  generateVosViewerPng,
  type PdfSectionSpec,
} from '../lib/exportEntregables';

interface EntregablesViewProps {
  activeMember: TeamMember;
  onSelectMember: (id: TeamMember['id']) => void;
}

interface PdfManifestApiItem {
  code: string;
  renamedFilename: string;
  sourceFolder: 'example' | 'ref';
  originalFilename: string;
  citationShort: string;
  doi: string;
  cluster: string;
  roleType: string;
  exists: boolean;
  sizeBytes: number;
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '—';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(2)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

export function EntregablesView({ activeMember, onSelectMember }: EntregablesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | DeliverableCategoryCode>('all');
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({
    E00: true,
    E02: true,
    E07: true,
    E08: true,
    E10: true,
    E11: true,
    E12: true,
    E16: true,
    E18: true,
  });

  // Estado de PNGs generados en Canvas
  const [vosPngUrl, setVosPngUrl] = useState('');
  const [canvasPngUrl, setCanvasPngUrl] = useState('');
  const [cadenaPngUrl, setCadenaPngUrl] = useState('');

  // Manifiesto en vivo de los 33 PDFs desde el servidor
  const [articulos, setArticulos] = useState<PdfManifestApiItem[]>([]);
  const [articulosLoading, setArticulosLoading] = useState(true);
  const [articulosError, setArticulosError] = useState<string | null>(null);
  const [pdfSearch, setPdfSearch] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const toggleExpand = (code: string) => {
    setExpandedKeys((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  useEffect(() => {
    setVosPngUrl(generateVosViewerPng());
    setCanvasPngUrl(generateBusinessModelCanvasPng());
    setCadenaPngUrl(generateCadenaValorPng());
  }, []);

  const loadArticulosManifest = async () => {
    setArticulosLoading(true);
    setArticulosError(null);
    try {
      const resp = await fetch('/api/entregables/articulos');
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
      const data = (await resp.json()) as { items?: PdfManifestApiItem[] };
      setArticulos(data.items ?? []);
    } catch (err) {
      setArticulosError(err instanceof Error ? err.message : 'No se pudo cargar el listado E07.');
    } finally {
      setArticulosLoading(false);
    }
  };

  useEffect(() => {
    void loadArticulosManifest();
  }, []);

  const filteredArticulos = useMemo(() => {
    const q = pdfSearch.trim().toLowerCase();
    if (!q) return articulos;
    return articulos.filter(
      (a) =>
        a.code.toLowerCase().includes(q) ||
        a.renamedFilename.toLowerCase().includes(q) ||
        a.citationShort.toLowerCase().includes(q) ||
        a.doi.toLowerCase().includes(q) ||
        a.cluster.toLowerCase().includes(q),
    );
  }, [articulos, pdfSearch]);

  const activePitchDeck = useMemo(
    () => ROLE_PRESENTATIONS.find((d) => d.memberId === activeMember.id) ?? ROLE_PRESENTATIONS[0],
    [activeMember.id],
  );
  const pitchTag = useMemo(() => getMemberPitchBaseTag(activeMember), [activeMember]);

  const showCategory = (code: DeliverableCategoryCode) =>
    selectedCategory === 'all' || selectedCategory === code;

  // ============================================================================
  // CONSTRUCTORES DE SECCIONES PARA PDF / DOCX
  // ============================================================================
  const buildE00Sections = (): PdfSectionSpec[] => [
    {
      heading: '1. Identificación del Proyecto',
      paragraphs: [
        `${E00_FICHA_TECNICA.carrera} · Grupo ${E00_FICHA_TECNICA.codigoGrupo}`,
        E00_FICHA_TECNICA.resumenEjecutivo,
      ],
    },
    {
      heading: '2. Especificaciones Técnicas Verificadas',
      table: {
        headers: ['Parámetro de Ingeniería', 'Especificación ALMA'],
        rows: E00_FICHA_TECNICA.especificacionesClave.map((s) => [s.parametro, s.valor]),
      },
    },
    {
      heading: '3. Subsistemas Acoplados',
      table: {
        headers: ['Código', 'Subsistema', 'Arquitectura e Interfaz'],
        rows: E00_FICHA_TECNICA.subsistemas.map((sub) => [
          sub.code,
          sub.name,
          `${sub.specs} Salida: ${sub.interfaceOut}`,
        ]),
      },
    },
  ];

  const buildE01Sections = (): PdfSectionSpec[] => [
    {
      heading: '1. Fases Design Thinking Aplicadas',
      table: {
        headers: ['Fase', 'Herramienta', 'Evidencia y Hallazgo Clave'],
        rows: E01_DESIGN_THINKING.fases.map((f) => [f.fase, f.herramienta, f.hallazgo]),
      },
    },
    {
      heading: '2. Registro Anonimizado de Actores Entrevistados (Lima Norte, n = 6)',
      table: {
        headers: ['Código', 'Perfil del Participante', 'Hallazgo Crítico'],
        rows: E01_DESIGN_THINKING.entrevistados.map((e) => [e.codigo, e.perfil, e.hallazgoClave]),
      },
    },
    {
      heading: '3. Síntesis del Mapa de Empatía',
      table: {
        headers: ['Cuadrante', 'Evidencias Recogidas'],
        rows: E01_DESIGN_THINKING.mapaEmpatia.map((q) => [q.cuadrante, q.items.join(' | ')]),
      },
    },
    {
      heading: '4. Matriz de Decisión Ponderada de Conceptos',
      table: {
        headers: ['Concepto Evaluado', 'Ergonomía', 'Seguridad', 'Costo', 'Voz', 'Total'],
        rows: E01_DESIGN_THINKING.matrizDecisionConceptos.map((c) => [
          c.concepto,
          c.ergonomia,
          c.seguridad,
          c.costo,
          c.facilidadVoz,
          c.ponderado,
        ]),
      },
    },
  ];

  const buildE03Sections = (): PdfSectionSpec[] => [
    {
      heading: '1. Archivos Nativos Autodesk Inventor Existentes en el Repositorio',
      bullets: [
        ...E03_CAD_PRUEBAS_TEMPLATE.assembliesOnDisk.map((f) => `Ensamblaje IAM: ${f}`),
        ...E03_CAD_PRUEBAS_TEMPLATE.partsOnDisk.map((f) => `Pieza IPT principal: ${f}`),
      ],
    },
    {
      heading: '2. Procedimiento de Exportación Uno por Uno desde Autodesk Inventor',
      table: {
        headers: ['Paso', 'Instrucción Operativa'],
        rows: E03_CAD_PRUEBAS_TEMPLATE.inventorExportSteps.map((s) => [s.paso, s.detalle]),
      },
    },
    {
      heading: '3. Registro de Pruebas Funcionales de Banco y Seguridad Eléctrica',
      table: {
        headers: ['Prueba', 'Criterio de Aceptación', 'Resultado Registrado'],
        rows: E03_CAD_PRUEBAS_TEMPLATE.benchTestsTemplate.map((t) => [
          t.prueba,
          t.criterioAceptacion,
          t.resultadoMedido,
        ]),
      },
    },
  ];

  const buildE14Sections = (): PdfSectionSpec[] => [
    {
      heading: 'Matriz de Impacto Social y Objetivos de Desarrollo Sostenible (ODS 3, 9 y 10)',
      table: {
        headers: ['ODS', 'Línea Base', 'Indicador KPI', 'Meta Cuantitativa', 'Medio de Verificación'],
        rows: E14_ODS_MATRIZ.rows.map((r) => [
          `${r.ods} (${r.meta})`,
          r.lineaBase,
          r.kpi,
          r.meta2026,
          r.verificacion,
        ]),
      },
    },
  ];

  const buildE15Sections = (): PdfSectionSpec[] => [
    {
      heading: '1. Alcance Declarado de Uso de Inteligencia Artificial',
      paragraphs: [E15_BITACORA_PROMPTS.summaryNote],
    },
    {
      heading: '2. Bitácora Trazable de Consultas (Búsqueda Bibliográfica y Corrección Ortográfica)',
      table: {
        headers: ['ID', 'Fecha', 'Responsable', 'Categoría', 'Prompt Utilizado', 'Validación Humana'],
        rows: E15_BITACORA_PROMPTS.prompts.map((p) => [
          p.id,
          p.fecha,
          p.responsable,
          p.categoria,
          p.prompt,
          p.validacionHumana,
        ]),
      },
    },
  ];

  const buildE16Sections = (): PdfSectionSpec[] => [
    {
      heading: E16_DECLARACION_IA_TEMPLATE.title,
      paragraphs: [E16_DECLARACION_IA_TEMPLATE.swornText],
    },
    {
      heading: 'Constancia de Suscripción y Firmas de los Coautores (Grupo G01)',
      table: {
        headers: ['Apellidos y Nombres', 'Código UPN', 'Rol en Revisión', 'Firma / V°B°'],
        rows: E16_DECLARACION_IA_TEMPLATE.members.map((m) => [
          m.fullName,
          m.code,
          m.roleTitle,
          '__________________________',
        ]),
      },
    },
  ];

  const buildE17Sections = (): PdfSectionSpec[] => [
    {
      heading: '1. Control de Umbrales Institucionales Turnitin (Similitud <= 15 %, IA <= 10 %)',
      table: {
        headers: ['Indicador Auditado', 'Límite Exigido', 'Estado / Evidencia Adjunta'],
        rows: E17_TURNITIN_AUDIT_TEMPLATE.umbrales.map((u) => [
          u.criterio,
          u.limite,
          u.estadoPlantilla,
        ]),
      },
    },
    {
      heading: '2. Prompt Estándar de Pre-Auditoría Interna Antes de Turnitin',
      paragraphs: [E17_TURNITIN_AUDIT_TEMPLATE.preAuditPrompt],
    },
  ];

  const buildE18Sections = (): PdfSectionSpec[] => [
    {
      heading: E18_CONSENTIMIENTOS_TEMPLATE.autorizacionImagenMaricielo.titulo,
      paragraphs: [
        `Participante: ${E18_CONSENTIMIENTOS_TEMPLATE.autorizacionImagenMaricielo.sujeto}`,
        E18_CONSENTIMIENTOS_TEMPLATE.autorizacionImagenMaricielo.contexto,
        E18_CONSENTIMIENTOS_TEMPLATE.autorizacionImagenMaricielo.clausula,
        'Firma de Maricielo: __________________________   DNI: ______________   Fecha: ____/____/2026',
      ],
    },
    {
      heading: E18_CONSENTIMIENTOS_TEMPLATE.consentimientoEntrevistasDT.titulo,
      paragraphs: [
        E18_CONSENTIMIENTOS_TEMPLATE.consentimientoEntrevistasDT.alcance,
        E18_CONSENTIMIENTOS_TEMPLATE.consentimientoEntrevistasDT.clausula,
        'Código anonimizado (PAC/FIS): _________   Firma / Aceptación verbal registrada: ______________',
      ],
    },
  ];

  // ============================================================================
  // DESCARGAS DE EXCEL (.XLSX)
  // ============================================================================
  const handleDownloadE02Excel = () => {
    downloadExcelWorkbook(E02_SCAMPER_WORKBOOK.filename, [
      {
        name: 'Matriz_SCAMPER',
        headers: ['Operador', 'Pregunta Guía', 'Acción Aplicada en ALMA', 'Indicador Cuantificado'],
        rows: E02_SCAMPER_WORKBOOK.rows.map((r) => [r.letra, r.pregunta, r.accion, r.indicador]),
      },
      {
        name: 'Impacto_Antes_Despues',
        headers: ['Métrica Técnica', 'Línea Base Previa', 'Resultado ALMA Rediseñado', 'Mejora Lograda'],
        rows: E02_SCAMPER_WORKBOOK.quantitativeSummary.map((q) => [q.metrica, q.antes, q.despues, q.mejora]),
      },
    ]);
  };

  const handleDownloadE06PrismaExcel = () => {
    downloadExcelWorkbook(E06_PRISMA_WORKBOOK.filename, [
      {
        name: 'Flujo_PRISMA_2020',
        headers: ['Etapa del Protocolo', 'Registros (n)', 'Detalle / Ecuación Aplicada'],
        rows: E06_PRISMA_WORKBOOK.flowRows.map((f) => [f.etapa, f.registros, f.nota]),
      },
      {
        name: 'Incluidos_n31',
        headers: ['ID', 'Autores', 'Año', 'Título', 'Revista', 'DOI', 'Clúster', 'Arquitectura', 'Control / IA', 'Métrica', 'Costo / Impacto'],
        rows: PRISMA_INCLUDED_STUDIES.map((s) => [
          s.id,
          s.authors,
          s.year,
          s.title,
          s.journal,
          s.doi,
          s.cluster,
          s.prismaExtraction.architecture,
          s.prismaExtraction.controlOrAi,
          s.prismaExtraction.performanceMetric,
          s.prismaExtraction.costOrImpact,
        ]),
      },
      {
        name: 'Motivos_Exclusion',
        headers: ['Motivo de Exclusión en Texto Completo (n=54)', 'Cantidad'],
        rows: E06_PRISMA_WORKBOOK.exclusionBreakdown.map((e) => [e.reason, e.count]),
      },
    ]);
  };

  const handleDownloadE12FlujoExcel = () => {
    downloadExcelWorkbook(E12_FLUJO_CAJA_WORKBOOK.filename, [
      {
        name: 'BOM_Unitario',
        headers: ['Componente / Partida Directa', 'Costo Unitario (S/)'],
        rows: [
          ...E12_FLUJO_CAJA_WORKBOOK.bomRows.map((b) => [b.item, b.costSoles]),
          ['TOTAL BOM UNITARIO ALMA', 420],
        ],
      },
      {
        name: 'Inversion_CAPEX',
        headers: ['Concepto de Inversión Inicial (Año 0)', 'Monto (S/)'],
        rows: [
          ...E12_FLUJO_CAJA_WORKBOOK.capexRows.map((c) => [c.concept, c.amount]),
          ['TOTAL INVERSIÓN INICIAL', 24000],
        ],
      },
      {
        name: 'Flujo_Caja_5_Anios',
        headers: ['Periodo', 'Ingresos (S/)', 'Egresos (S/)', 'Flujo Neto (S/)', 'Factor Desc. (12%)', 'Flujo Descontado (S/)', 'Acumulado Desc. (S/)'],
        rows: E12_FLUJO_CAJA_WORKBOOK.cashFlowRows.map((r) => [
          r.year,
          r.ingresos,
          r.egresos,
          r.flujoNeto,
          r.factorDescuento,
          r.flujoDescontado,
          r.acumuladoDescontado,
        ]),
      },
      {
        name: 'Indicadores_VAN_TIR',
        headers: ['Indicador', 'Valor Calculado', 'Criterio de Decisión'],
        rows: E12_FLUJO_CAJA_WORKBOOK.summaryIndicators.map((i) => [i.indicador, i.valor, i.criterio]),
      },
    ]);
  };

  const handleDownloadE13SensibilidadExcel = () => {
    downloadExcelWorkbook(E13_SENSIBILIDAD_WORKBOOK.filename, [
      {
        name: 'Sensibilidad_Escenarios',
        headers: ['Escenario Evaluado', 'VAN (S/)', 'TIR (%)', 'Relación B/C', 'PRI Descontado', 'Interpretación de Viabilidad'],
        rows: E13_SENSIBILIDAD_WORKBOOK.rows.map((s) => [s.scenario, s.van, s.tir, s.bc, s.pri, s.status]),
      },
    ]);
  };

  const handleDownloadE21CoevaluacionExcel = () => {
    downloadExcelWorkbook(E21_COEVALUACION_WORKBOOK.filename, [
      {
        name: 'Coevaluacion_G01',
        headers: ['Código', 'Integrante', 'Rol T3', 'Plazos (20%)', 'Evidencias (25%)', 'PRISMA (20%)', 'Trabajo Par (15%)', 'Pitch (20%)', 'Total (100%)', 'Factor', 'Observación'],
        rows: E21_COEVALUACION_WORKBOOK.rows.map((r) => [
          r.codigo,
          r.integrante,
          r.rol,
          r.criterio1,
          r.criterio2,
          r.criterio3,
          r.criterio4,
          r.criterio5,
          r.puntajeTotal,
          r.factorCorreccion,
          r.observacion,
        ]),
      },
      {
        name: 'Escala_Factor',
        headers: ['Factor', 'Rango de Puntaje', 'Criterio Aplicado'],
        rows: E21_COEVALUACION_WORKBOOK.escalaFactor.map((f) => [f.factor, f.rango, f.criterio]),
      },
    ]);
  };

  const handleDownloadCsvScopus = () => {
    downloadCsvFile(
      'E04_Exportacion_Scopus.csv',
      ['Codigo', 'Authors', 'Title', 'Year', 'Source title', 'DOI', 'Cluster', 'Database', 'Query Batch'],
      E04_SCOPUS_EXPORT_ROWS.map((r) => [
        r.codigo,
        r.authors,
        r.title,
        r.year,
        r.sourceTitle,
        r.doi,
        r.cluster,
        r.database,
        r.queryBatch,
      ]),
    );
  };

  const handleDownloadCsvWos = () => {
    downloadCsvFile(
      'E05_Exportacion_WoS.csv',
      ['Codigo', 'Authors', 'Article Title', 'Publication Year', 'Source Title', 'DOI', 'Cluster', 'Database', 'Query Batch'],
      E05_WOS_EXPORT_ROWS.map((r) => [
        r.codigo,
        r.authors,
        r.title,
        r.year,
        r.sourceTitle,
        r.doi,
        r.cluster,
        r.database,
        r.queryBatch,
      ]),
    );
  };

  const handleCopyAuditPrompt = async () => {
    try {
      await navigator.clipboard.writeText(E17_TURNITIN_AUDIT_TEMPLATE.preAuditPrompt);
      setCopiedPrompt(true);
      window.setTimeout(() => setCopiedPrompt(false), 1800);
    } catch {
      setCopiedPrompt(false);
    }
  };

  return (
    <section className="mx-auto max-w-[1360px] px-4 py-6 sm:px-6">
      {/* Barra superior de control de carpeta y coautor activo */}
      <div className="mb-6 border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-bold text-slate-950">
              Repositorio Estandarizado de Entregables (E00 – E21)
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">
              Estructura de carpetas para entrega grupal e individual de Proyecto ALMA: lectura directa de fichas, tablas, diagramas y descarga en formato PDF, Word, Excel, CSV, TXT, PNG y paquete ZIP completo de los 33 artículos PDF.
            </p>
          </div>
          <div className="text-xs text-slate-500 tabular-nums">
            5 subcarpetas · 22 códigos (E00–E21)
          </div>
        </div>

        {/* Filtros por subcarpeta y selector de integrante (para E19 / E20) */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`whitespace-nowrap shrink-0 border px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Todas (01–05)
            </button>
            {DELIVERABLE_CATEGORIES.map((cat, idx) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap shrink-0 border px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                0{idx + 1} · {cat.range}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs font-medium text-slate-500">Integrante (E19/E20):</span>
            {TEAM_MEMBERS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelectMember(m.id)}
                className={`whitespace-nowrap shrink-0 border px-2.5 py-1 text-xs font-medium transition-colors ${
                  m.id === activeMember.id
                    ? 'border-blue-700 bg-blue-700 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {m.shortName}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* ================================================================
            CATEGORÍA 01: 01_Proyecto_Prototipo (E00 – E03)
            ================================================================ */}
        {showCategory('01_Proyecto_Prototipo') && (
          <div className="border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
              <div>
                <div className="font-mono text-xs font-semibold text-blue-700">
                  01_Proyecto_Prototipo · E00 – E03
                </div>
                <h2 className="mt-0.5 font-display text-lg font-bold text-slate-950">
                  {DELIVERABLE_CATEGORIES[0].title}
                </h2>
              </div>
              <span className="text-xs text-slate-500">4 entregables técnicos</span>
            </div>

            <div className="divide-y divide-slate-200">
              {/* E00 */}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-900">E00</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{E00_FICHA_TECNICA.filename}</span>
                      <span aria-hidden="true">·</span>
                      <span>Resumen técnico extraído del informe</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900">
                      {E00_FICHA_TECNICA.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand('E00')}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {expandedKeys.E00 ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {expandedKeys.E00 ? 'Ocultar vista' : 'Leer ficha'}
                    </button>
                    <button
                      type="button"
                      onClick={() => void downloadTemplateDocx(E00_FICHA_TECNICA.docxFilename, E00_FICHA_TECNICA.title, E00_FICHA_TECNICA.carrera, buildE00Sections())}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Word (.docx)
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadSimplePdf(E00_FICHA_TECNICA.filename, E00_FICHA_TECNICA.title, E00_FICHA_TECNICA.carrera, buildE00Sections())}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Descargar PDF
                    </button>
                  </div>
                </div>

                {expandedKeys.E00 && (
                  <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                    <p className="text-sm leading-relaxed text-slate-700">
                      {E00_FICHA_TECNICA.resumenEjecutivo}
                    </p>
                    <div className="overflow-x-auto border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600">
                          <tr>
                            <th className="px-3 py-2 font-semibold">Parámetro de Ingeniería</th>
                            <th className="px-3 py-2 font-semibold">Especificación ALMA</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {E00_FICHA_TECNICA.especificacionesClave.map((row) => (
                            <tr key={row.parametro}>
                              <td className="px-3 py-2 font-medium text-slate-900">{row.parametro}</td>
                              <td className="px-3 py-2 text-slate-700 tabular-nums">{row.valor}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* E01 */}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-900">E01</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{E01_DESIGN_THINKING.filename}</span>
                      <span aria-hidden="true">·</span>
                      <span>5 fases · 6 entrevistas Lima Norte · Mapa de Empatía · Matriz Decisión</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900">
                      {E01_DESIGN_THINKING.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand('E01')}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {expandedKeys.E01 ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {expandedKeys.E01 ? 'Ocultar vista' : 'Leer expediente'}
                    </button>
                    <button
                      type="button"
                      onClick={() => void downloadTemplateDocx(E01_DESIGN_THINKING.docxFilename, E01_DESIGN_THINKING.title, 'Proyecto ALMA · Metodología Design Thinking', buildE01Sections())}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Word (.docx)
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadSimplePdf(E01_DESIGN_THINKING.filename, E01_DESIGN_THINKING.title, 'Proyecto ALMA · Metodología Design Thinking', buildE01Sections())}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Descargar PDF
                    </button>
                  </div>
                </div>

                {expandedKeys.E01 && (
                  <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {E01_DESIGN_THINKING.mapaEmpatia.map((q) => (
                        <div key={q.cuadrante} className="border border-slate-200 bg-slate-50/70 p-3.5">
                          <div className="text-xs font-bold text-slate-900">{q.cuadrante}</div>
                          <ul className="mt-1.5 space-y-1 text-xs text-slate-700">
                            {q.items.map((item) => (
                              <li key={item}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="overflow-x-auto border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600">
                          <tr>
                            <th className="px-3 py-2 font-semibold">Código</th>
                            <th className="px-3 py-2 font-semibold">Perfil Entrevistado</th>
                            <th className="px-3 py-2 font-semibold">Hallazgo Principal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {E01_DESIGN_THINKING.entrevistados.map((e) => (
                            <tr key={e.codigo}>
                              <td className="px-3 py-2 font-mono font-semibold text-slate-900">{e.codigo}</td>
                              <td className="px-3 py-2 text-slate-800">{e.perfil}</td>
                              <td className="px-3 py-2 text-slate-700">{e.hallazgoClave}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* E02 */}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-900">E02</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{E02_SCAMPER_WORKBOOK.filename}</span>
                      <span aria-hidden="true">·</span>
                      <span>2 hojas Excel (Matriz SCAMPER + KPI Antes/Después)</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900">
                      Matriz SCAMPER de Mejoras Cuantificadas Aplicadas al Exoesqueleto
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand('E02')}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {expandedKeys.E02 ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {expandedKeys.E02 ? 'Ocultar tabla' : 'Ver tabla'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadE02Excel}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-emerald-700 bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5" />
                      Descargar Excel (.xlsx)
                    </button>
                  </div>
                </div>

                {expandedKeys.E02 && (
                  <div className="mt-4 overflow-x-auto border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Operador</th>
                          <th className="px-3 py-2 font-semibold">Acción Implementada en ALMA</th>
                          <th className="px-3 py-2 font-semibold">Indicador Cuantificado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {E02_SCAMPER_WORKBOOK.rows.map((r) => (
                          <tr key={r.letra}>
                            <td className="px-3 py-2 font-semibold text-slate-900 whitespace-nowrap">{r.letra}</td>
                            <td className="px-3 py-2 text-slate-700">{r.accion}</td>
                            <td className="px-3 py-2 font-medium text-slate-900 tabular-nums">{r.indicador}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* E03 */}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-900">E03</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">E03_Prototipo_CAD_Pruebas/</span>
                      <span aria-hidden="true">·</span>
                      <span>Plantilla editable para planos Inventor (.ipt/.iam) + pruebas de banco</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900">
                      Guía de Exportación Autodesk Inventor y Registro de Pruebas Funcionales
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand('E03')}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {expandedKeys.E03 ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {expandedKeys.E03 ? 'Ocultar guía' : 'Ver plantilla'}
                    </button>
                    <button
                      type="button"
                      onClick={() => void downloadTemplateDocx(E03_CAD_PRUEBAS_TEMPLATE.docxFilename, 'E03 · Plantilla Planos Inventor y Pruebas de Banco', 'Guía para exportación manual de piezas .ipt / ensamblajes .iam en Drive', buildE03Sections())}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Plantilla Word (.docx)
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadSimplePdf(E03_CAD_PRUEBAS_TEMPLATE.pdfFilename, 'E03 · Plantilla Planos Inventor y Pruebas de Banco', 'Guía de exportación CAD 1x1 y protocolo de banco ALMA', buildE03Sections())}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Descargar PDF
                    </button>
                  </div>
                </div>

                {expandedKeys.E03 && (
                  <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <div className="border border-slate-200 bg-slate-50/70 p-4">
                        <div className="text-xs font-bold text-slate-900">
                          Archivos Inventor detectados en el proyecto (26 .ipt + 10 .iam)
                        </div>
                        <ul className="mt-2 space-y-1 font-mono text-[11px] text-slate-700">
                          {E03_CAD_PRUEBAS_TEMPLATE.assembliesOnDisk.map((f) => (
                            <li key={f}>• {f}</li>
                          ))}
                          {E03_CAD_PRUEBAS_TEMPLATE.partsOnDisk.slice(0, 6).map((f) => (
                            <li key={f}>• {f}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="border border-slate-200 bg-slate-50/70 p-4">
                        <div className="text-xs font-bold text-slate-900">
                          Flujo recomendado de exportación uno por uno desde Inventor
                        </div>
                        <ol className="mt-2 space-y-1.5 text-xs text-slate-700">
                          {E03_CAD_PRUEBAS_TEMPLATE.inventorExportSteps.map((s) => (
                            <li key={s.paso}>
                              <span className="font-semibold text-slate-900">{s.paso}:</span> {s.detalle}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600">
                          <tr>
                            <th className="px-3 py-2 font-semibold">Prueba de Banco</th>
                            <th className="px-3 py-2 font-semibold">Criterio de Aceptación</th>
                            <th className="px-3 py-2 font-semibold">Resultado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {E03_CAD_PRUEBAS_TEMPLATE.benchTestsTemplate.map((t) => (
                            <tr key={t.prueba}>
                              <td className="px-3 py-2 font-medium text-slate-900">{t.prueba}</td>
                              <td className="px-3 py-2 text-slate-700">{t.criterioAceptacion}</td>
                              <td className="px-3 py-2 font-medium text-emerald-700">{t.resultadoMedido}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================
            CATEGORÍA 02: 02_PRISMA_Articulos_VOSviewer (E04 – E09)
            ================================================================ */}
        {showCategory('02_PRISMA_Articulos_VOSviewer') && (
          <div className="border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
              <div>
                <div className="font-mono text-xs font-semibold text-blue-700">
                  02_PRISMA_Articulos_VOSviewer · E04 – E09
                </div>
                <h2 className="mt-0.5 font-display text-lg font-bold text-slate-950">
                  {DELIVERABLE_CATEGORIES[1].title}
                </h2>
              </div>
              <span className="text-xs text-slate-500 tabular-nums">6 entregables · 33 PDFs locales listos</span>
            </div>

            <div className="divide-y divide-slate-200">
              {/* E04 & E05 */}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-900">E04 &amp; E05</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">E04_Exportacion_Scopus.csv / E05_Exportacion_WoS.csv</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900">
                      Exportaciones Bibliográficas Scopus (n = 385) y Web of Science (n = 245) en CSV
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand('E04')}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {expandedKeys.E04 ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {expandedKeys.E04 ? 'Ocultar vista' : 'Ver registros'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadCsvScopus}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Scopus .csv
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadCsvWos}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-blue-700 bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
                    >
                      <Download className="h-3.5 w-3.5" />
                      WoS .csv
                    </button>
                  </div>
                </div>

                {expandedKeys.E04 && (
                  <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs font-bold text-slate-900">Ecuación Scopus (n = 385 · 15/04/2026)</div>
                        <p className="mt-1 font-mono text-[11px] text-slate-600 break-words">
                          {PRISMA_PROTOCOL.scopusQuery}
                        </p>
                      </div>
                      <div className="border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs font-bold text-slate-900">Ecuación Web of Science (n = 245 · PY 2021–2026)</div>
                        <p className="mt-1 font-mono text-[11px] text-slate-600 break-words">
                          {PRISMA_PROTOCOL.wosQuery}
                        </p>
                      </div>
                    </div>

                    <div className="max-h-60 overflow-auto border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="sticky top-0 bg-slate-50 text-slate-600">
                          <tr>
                            <th className="px-3 py-2 font-semibold">ID</th>
                            <th className="px-3 py-2 font-semibold">Autores</th>
                            <th className="px-3 py-2 font-semibold">Año</th>
                            <th className="px-3 py-2 font-semibold">Revista</th>
                            <th className="px-3 py-2 font-semibold">DOI</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {E04_SCOPUS_EXPORT_ROWS.map((r) => (
                            <tr key={r.codigo}>
                              <td className="px-3 py-1.5 font-mono font-semibold text-slate-900">{r.codigo}</td>
                              <td className="px-3 py-1.5 text-slate-800">{r.authors.split(',')[0]} et al.</td>
                              <td className="px-3 py-1.5 font-mono tabular-nums">{r.year}</td>
                              <td className="px-3 py-1.5 text-slate-700">{r.sourceTitle}</td>
                              <td className="px-3 py-1.5 font-mono text-[11px] text-blue-700">{r.doi}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* E06 */}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-900">E06</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{E06_PRISMA_WORKBOOK.filename}</span>
                      <span aria-hidden="true">·</span>
                      <span>3 hojas (Flujo PRISMA 820 → 31 · Extracción 31 estudios · Exclusiones)</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900">
                      Matriz de Cribado PRISMA 2020 y Registro de Inclusión/Exclusión
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand('E06')}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {expandedKeys.E06 ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {expandedKeys.E06 ? 'Ocultar flujo' : 'Ver flujo PRISMA'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadE06PrismaExcel}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-emerald-700 bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5" />
                      Descargar Excel (.xlsx)
                    </button>
                  </div>
                </div>

                {expandedKeys.E06 && (
                  <div className="mt-4 overflow-x-auto border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Etapa del Protocolo PRISMA 2020</th>
                          <th className="px-3 py-2 text-right font-semibold">Registros (n)</th>
                          <th className="px-3 py-2 font-semibold">Observación / Trazabilidad</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {E06_PRISMA_WORKBOOK.flowRows.map((row) => (
                          <tr key={row.etapa}>
                            <td className="px-3 py-2 font-medium text-slate-900">{row.etapa}</td>
                            <td className="px-3 py-2 text-right font-mono font-semibold text-slate-900 tabular-nums">
                              {row.registros}
                            </td>
                            <td className="px-3 py-2 text-slate-600">{row.nota}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* E07 — 33 PDFs locales renombrados + ZIP */}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-900">E07</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">E07_Articulos_Incluidos_PDF/</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        31 estudios primarios + 2 revisiones guía (Autor_Año_PalabraClave.pdf)
                      </span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900">
                      Biblioteca Completa de 33 Artículos PDF Renombrados y Paquete ZIP
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand('E07')}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <FolderOpen className="h-3.5 w-3.5" />
                      {expandedKeys.E07 ? 'Ocultar carpeta (33)' : 'Explorar 33 PDFs'}
                    </button>
                    <a
                      href="/api/entregables/articulos-zip"
                      download="E07_Articulos_Incluidos_PDF.zip"
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-900 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                      <Archive className="h-3.5 w-3.5" />
                      Descargar ZIP (33 PDFs)
                    </a>
                  </div>
                </div>

                {expandedKeys.E07 && (
                  <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="relative w-full sm:w-80">
                        <Search className="pointer-events-none absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="text"
                          value={pdfSearch}
                          onChange={(e) => setPdfSearch(e.target.value)}
                          placeholder="Buscar autor, código P01–P31, G01–G02 o palabra..."
                          className="w-full border border-slate-300 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                      <span className="text-xs text-slate-500 tabular-nums">
                        Mostrando {filteredArticulos.length} de {articulos.length} archivos locales
                      </span>
                    </div>

                    {articulosLoading && (
                      <div className="space-y-2 border border-slate-200 p-4">
                        <div className="h-4 w-2/3 animate-pulse bg-slate-100" />
                        <div className="h-4 w-full animate-pulse bg-slate-100" />
                        <div className="h-4 w-5/6 animate-pulse bg-slate-100" />
                      </div>
                    )}

                    {!articulosLoading && articulosError && (
                      <div className="flex flex-wrap items-center justify-between gap-3 border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">
                        <span>No se pudo consultar el manifiesto en servidor ({articulosError}).</span>
                        <button
                          type="button"
                          onClick={() => void loadArticulosManifest()}
                          className="inline-flex items-center gap-1 border border-red-300 bg-white px-2.5 py-1 font-medium text-red-800 hover:bg-red-100"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Reintentar
                        </button>
                      </div>
                    )}

                    {!articulosLoading && !articulosError && filteredArticulos.length === 0 && (
                      <div className="border border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs text-slate-600">
                        No hay PDFs que coincidan con &ldquo;{pdfSearch}&rdquo;.
                      </div>
                    )}

                    {!articulosLoading && !articulosError && filteredArticulos.length > 0 && (
                      <div className="max-h-96 overflow-auto border border-slate-200">
                        <table className="w-full text-left text-xs">
                          <thead className="sticky top-0 bg-slate-50 text-slate-600">
                            <tr>
                              <th className="px-3 py-2 font-semibold">Código</th>
                              <th className="px-3 py-2 font-semibold">Nombre Estandarizado (E07)</th>
                              <th className="px-3 py-2 font-semibold">Tipo</th>
                              <th className="px-3 py-2 text-right font-semibold">Tamaño</th>
                              <th className="px-3 py-2 text-right font-semibold">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {filteredArticulos.map((art) => (
                              <tr key={art.code} className="hover:bg-slate-50/70">
                                <td className="px-3 py-2 font-mono font-semibold text-slate-900">
                                  {art.code}
                                </td>
                                <td className="px-3 py-2">
                                  <div className="font-mono text-[11px] font-semibold text-slate-900">
                                    {art.renamedFilename}
                                  </div>
                                  <div className="text-[11px] text-slate-500">
                                    {art.citationShort} · DOI: {art.doi}
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-slate-700 whitespace-nowrap">
                                  {art.roleType}
                                </td>
                                <td className="px-3 py-2 text-right font-mono text-slate-600 tabular-nums whitespace-nowrap">
                                  {formatBytes(art.sizeBytes)}
                                </td>
                                <td className="px-3 py-2 text-right whitespace-nowrap">
                                  <div className="inline-flex items-center gap-1.5">
                                    <a
                                      href={`/api/entregables/articulo/${encodeURIComponent(art.renamedFilename)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      Leer PDF
                                    </a>
                                    <a
                                      href={`/api/entregables/articulo/${encodeURIComponent(art.renamedFilename)}?download=1`}
                                      download={art.renamedFilename}
                                      className="inline-flex items-center gap-1 border border-slate-900 bg-slate-900 px-2 py-1 text-[11px] font-medium text-white hover:bg-slate-800"
                                    >
                                      <Download className="h-3 w-3" />
                                      Bajar
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* E08 — Mapa VOSviewer PNG */}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-900">E08</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">E08_Mapa_VOSviewer.png</span>
                      <span aria-hidden="true">·</span>
                      <span>3 clústeres de co-ocurrencia (Diseño 3D · Control · IA/Voz)</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900">
                      Mapa Bibliométrico de Co-ocurrencia VOSviewer
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand('E08')}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      {expandedKeys.E08 ? 'Ocultar imagen' : 'Ver mapa'}
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadDataUrlPng('E08_Mapa_VOSviewer.png', vosPngUrl)}
                      disabled={!vosPngUrl}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Descargar PNG
                    </button>
                  </div>
                </div>

                {expandedKeys.E08 && vosPngUrl && (
                  <div className="mt-4 border border-slate-200 bg-slate-50 p-2">
                    <img
                      src={vosPngUrl}
                      alt="Mapa bibliométrico de co-ocurrencia VOSviewer de 3 clústeres para Proyecto ALMA"
                      referrerPolicy="no-referrer"
                      className="h-auto w-full border border-slate-200 bg-white"
                    />
                  </div>
                )}
              </div>

              {/* E09 — Red Bibliométrica TXT */}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-900">E09</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">E09_Red_Bibliometrica_Datos.txt</span>
                      <span aria-hidden="true">·</span>
                      <span>Archivo tabulado VOSviewer Map &amp; Network</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900">
                      Datos Estructurados de Red Bibliométrica (Nodos y Enlaces)
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand('E09')}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {expandedKeys.E09 ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {expandedKeys.E09 ? 'Ocultar TXT' : 'Leer TXT'}
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadTextFile('E09_Red_Bibliometrica_Datos.txt', E09_VOSVIEWER_NETWORK_TXT)}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Descargar TXT
                    </button>
                  </div>
                </div>

                {expandedKeys.E09 && (
                  <pre className="mt-4 max-h-60 overflow-auto border border-slate-200 bg-slate-950 p-4 font-mono text-[11px] leading-relaxed text-slate-200">
                    {E09_VOSVIEWER_NETWORK_TXT}
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================
            CATEGORÍA 03: 03_PlanNegocio_Finanzas (E10 – E14)
            ================================================================ */}
        {showCategory('03_PlanNegocio_Finanzas') && (
          <div className="border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
              <div>
                <div className="font-mono text-xs font-semibold text-blue-700">
                  03_PlanNegocio_Finanzas · E10 – E14
                </div>
                <h2 className="mt-0.5 font-display text-lg font-bold text-slate-950">
                  {DELIVERABLE_CATEGORIES[2].title}
                </h2>
              </div>
              <span className="text-xs text-slate-500 tabular-nums">5 entregables · VAN S/ 9 589,89 · TIR 25,16 %</span>
            </div>

            <div className="divide-y divide-slate-200">
              {/* E10 — Business Model Canvas PNG */}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-900">E10</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">E10_Business_Model_Canvas_Alma.png</span>
                      <span aria-hidden="true">·</span>
                      <span>Lienzo estratégico de 9 bloques</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900">
                      Business Model Canvas del Sistema ALMA (B2B2C)
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand('E10')}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      {expandedKeys.E10 ? 'Ocultar lienzo' : 'Ver Canvas'}
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadDataUrlPng('E10_Business_Model_Canvas_Alma.png', canvasPngUrl)}
                      disabled={!canvasPngUrl}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Descargar PNG
                    </button>
                  </div>
                </div>

                {expandedKeys.E10 && (
                  <div className="mt-4 space-y-3">
                    {canvasPngUrl ? (
                      <div className="border border-slate-200 bg-slate-50 p-2">
                        <img
                          src={canvasPngUrl}
                          alt="Business Model Canvas de 9 bloques del proyecto ALMA"
                          referrerPolicy="no-referrer"
                          className="h-auto w-full border border-slate-200 bg-white"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        {CANVAS_BLOCKS.map((b) => (
                          <div key={b.block} className="border border-slate-200 p-3 text-xs">
                            <div className="font-bold text-slate-900">{b.block}</div>
                            <p className="mt-1 text-slate-600">{b.detail}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* E11 — Cadena de Valor PNG */}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-900">E11</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">E11_Cadena_Valor_Alma.png</span>
                      <span aria-hidden="true">·</span>
                      <span>Actividades de apoyo y primarias (Porter)</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900">
                      Cadena de Valor Aplicada al Exoesqueleto ALMA
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand('E11')}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      {expandedKeys.E11 ? 'Ocultar diagrama' : 'Ver Cadena'}
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadDataUrlPng('E11_Cadena_Valor_Alma.png', cadenaPngUrl)}
                      disabled={!cadenaPngUrl}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Descargar PNG
                    </button>
                  </div>
                </div>

                {expandedKeys.E11 && (
                  <div className="mt-4">
                    {cadenaPngUrl ? (
                      <div className="border border-slate-200 bg-slate-50 p-2">
                        <img
                          src={cadenaPngUrl}
                          alt="Cadena de Valor de Porter para el sistema ALMA"
                          referrerPolicy="no-referrer"
                          className="h-auto w-full border border-slate-200 bg-white"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                        {VALUE_CHAIN.map((v) => (
                          <div key={v.stage} className="border border-slate-200 p-3 text-xs">
                            <div className="font-bold text-slate-900">{v.stage}</div>
                            <p className="mt-1 text-slate-600">{v.detail}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* E12 — Flujo de Caja 5 años */}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-900">E12</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{E12_FLUJO_CAJA_WORKBOOK.filename}</span>
                      <span aria-hidden="true">·</span>
                      <span>Proyección 5 años · COK 12 % · 4 hojas Excel</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900">
                      Flujo de Caja Proyectado a 5 Años, BOM Unitario, VAN, TIR, B/C y PRI
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand('E12')}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {expandedKeys.E12 ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {expandedKeys.E12 ? 'Ocultar flujo' : 'Ver proyección'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadE12FlujoExcel}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-emerald-700 bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5" />
                      Descargar Excel (.xlsx)
                    </button>
                  </div>
                </div>

                {expandedKeys.E12 && (
                  <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 tabular-nums">
                      <div className="border border-slate-200 bg-slate-50 p-3">
                        <div className="text-[11px] text-slate-500">BOM Unitario</div>
                        <div className="font-display text-base font-bold text-slate-950">S/ 420</div>
                      </div>
                      <div className="border border-slate-200 bg-slate-50 p-3">
                        <div className="text-[11px] text-slate-500">Inversión Año 0</div>
                        <div className="font-display text-base font-bold text-slate-950">S/ 24 000</div>
                      </div>
                      <div className="border border-slate-200 bg-slate-50 p-3">
                        <div className="text-[11px] text-slate-500">VAN Base (12 %)</div>
                        <div className="font-display text-base font-bold text-blue-700">S/ 9 589,89</div>
                      </div>
                      <div className="border border-slate-200 bg-slate-50 p-3">
                        <div className="text-[11px] text-slate-500">TIR Anual</div>
                        <div className="font-display text-base font-bold text-emerald-700">25,16 %</div>
                      </div>
                      <div className="border border-slate-200 bg-slate-50 p-3">
                        <div className="text-[11px] text-slate-500">Relación B/C</div>
                        <div className="font-display text-base font-bold text-slate-950">1,40</div>
                      </div>
                      <div className="border border-slate-200 bg-slate-50 p-3">
                        <div className="text-[11px] text-slate-500">PRI Descontado</div>
                        <div className="font-display text-base font-bold text-slate-950">3,69 años</div>
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-slate-200">
                      <table className="w-full text-right text-xs tabular-nums">
                        <thead className="bg-slate-50 text-slate-600">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold">Periodo</th>
                            <th className="px-3 py-2 font-semibold">Ingresos (S/)</th>
                            <th className="px-3 py-2 font-semibold">Egresos (S/)</th>
                            <th className="px-3 py-2 font-semibold">Flujo Neto (S/)</th>
                            <th className="px-3 py-2 font-semibold">Flujo Desc. (S/)</th>
                            <th className="px-3 py-2 font-semibold">Acumulado Desc. (S/)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {E12_FLUJO_CAJA_WORKBOOK.cashFlowRows.map((row) => (
                            <tr key={row.year}>
                              <td className="px-3 py-2 text-left font-semibold text-slate-900">{row.year}</td>
                              <td className="px-3 py-2 text-slate-700">{row.ingresos.toLocaleString('es-PE')}</td>
                              <td className="px-3 py-2 text-slate-700">{row.egresos.toLocaleString('es-PE')}</td>
                              <td className="px-3 py-2 font-semibold text-slate-900">{row.flujoNeto.toLocaleString('es-PE')}</td>
                              <td className="px-3 py-2 text-slate-700">{row.flujoDescontado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                              <td className={`px-3 py-2 font-semibold ${row.acumuladoDescontado >= 0 ? 'text-emerald-700' : 'text-slate-700'}`}>
                                {row.acumuladoDescontado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* E13 — Análisis de Sensibilidad */}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-900">E13</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{E13_SENSIBILIDAD_WORKBOOK.filename}</span>
                      <span aria-hidden="true">·</span>
                      <span>Escenarios Base, +10 %, −10 % y −20 %</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900">
                      Análisis de Sensibilidad Financiera ante Variación de Flujos
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand('E13')}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {expandedKeys.E13 ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {expandedKeys.E13 ? 'Ocultar tabla' : 'Ver escenarios'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadE13SensibilidadExcel}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-emerald-700 bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5" />
                      Descargar Excel (.xlsx)
                    </button>
                  </div>
                </div>

                {expandedKeys.E13 && (
                  <div className="mt-4 overflow-x-auto border border-slate-200">
                    <table className="w-full text-left text-xs tabular-nums">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Escenario</th>
                          <th className="px-3 py-2 font-semibold">VAN</th>
                          <th className="px-3 py-2 font-semibold">TIR</th>
                          <th className="px-3 py-2 font-semibold">B/C</th>
                          <th className="px-3 py-2 font-semibold">PRI</th>
                          <th className="px-3 py-2 font-semibold">Dictamen</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {E13_SENSIBILIDAD_WORKBOOK.rows.map((s) => (
                          <tr key={s.scenario}>
                            <td className="px-3 py-2 font-medium text-slate-900">{s.scenario}</td>
                            <td className="px-3 py-2 font-semibold text-slate-900">{s.van}</td>
                            <td className="px-3 py-2 font-semibold text-emerald-700">{s.tir}</td>
                            <td className="px-3 py-2 text-slate-700">{s.bc}</td>
                            <td className="px-3 py-2 text-slate-700">{s.pri}</td>
                            <td className="px-3 py-2 text-slate-700">{s.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* E14 — Matriz Impacto ODS */}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-900">E14</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{E14_ODS_MATRIZ.pdfFilename}</span>
                      <span aria-hidden="true">·</span>
                      <span>ODS 3, ODS 9 y ODS 10 con indicadores cuantificables</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900">
                      Matriz de Impacto Social y Objetivos de Desarrollo Sostenible (ODS)
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand('E14')}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {expandedKeys.E14 ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {expandedKeys.E14 ? 'Ocultar matriz' : 'Ver matriz ODS'}
                    </button>
                    <button
                      type="button"
                      onClick={() => void downloadTemplateDocx(E14_ODS_MATRIZ.docxFilename, 'E14 · Matriz de Impacto ODS (3, 9 y 10)', 'Proyecto ALMA · Alineamiento Social y KPIs 2026', buildE14Sections())}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Word (.docx)
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadSimplePdf(E14_ODS_MATRIZ.pdfFilename, 'E14 · Matriz de Impacto ODS (3, 9 y 10)', 'Proyecto ALMA · Alineamiento Social y KPIs 2026', buildE14Sections())}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Descargar PDF
                    </button>
                  </div>
                </div>

                {expandedKeys.E14 && (
                  <div className="mt-4 overflow-x-auto border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="px-3 py-2 font-semibold">ODS y Meta</th>
                          <th className="px-3 py-2 font-semibold">Línea Base</th>
                          <th className="px-3 py-2 font-semibold">KPI y Meta ALMA 2026</th>
                          <th className="px-3 py-2 font-semibold">Evidencia de Verificación</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {E14_ODS_MATRIZ.rows.map((r) => (
                          <tr key={r.ods}>
                            <td className="px-3 py-2 font-semibold text-slate-900">
                              <div>{r.ods}</div>
                              <div className="text-[11px] font-normal text-slate-500">{r.meta}</div>
                            </td>
                            <td className="px-3 py-2 text-slate-700">{r.lineaBase}</td>
                            <td className="px-3 py-2 text-slate-900">{r.meta2026}</td>
                            <td className="px-3 py-2 text-slate-600">{r.verificacion}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================
            CATEGORÍA 04: 04_Integridad_IA_Turnitin (E15 – E18)
            ================================================================ */}
        {showCategory('04_Integridad_IA_Turnitin') && (
          <div className="border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
              <div>
                <div className="font-mono text-xs font-semibold text-blue-700">
                  04_Integridad_IA_Turnitin · E15 – E18
                </div>
                <h2 className="mt-0.5 font-display text-lg font-bold text-slate-950">
                  {DELIVERABLE_CATEGORIES[3].title}
                </h2>
              </div>
              <span className="text-xs text-slate-500">4 entregables de integridad y ética</span>
            </div>

            <div className="divide-y divide-slate-200">
              {/* E15 — Bitácora Prompts IA */}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-900">E15</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{E15_BITACORA_PROMPTS.pdfFilename}</span>
                      <span aria-hidden="true">·</span>
                      <span>Búsqueda bibliográfica + corrección ortográfica y estilo APA 7</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900">
                      Bitácora Trazable de Prompts de Inteligencia Artificial
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand('E15')}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {expandedKeys.E15 ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {expandedKeys.E15 ? 'Ocultar bitácora' : 'Leer bitácora'}
                    </button>
                    <button
                      type="button"
                      onClick={() => void downloadTemplateDocx(E15_BITACORA_PROMPTS.docxFilename, 'E15 · Bitácora de Prompts de Inteligencia Artificial', 'Uso exclusivo en búsqueda de literatura científica y corrección ortográfica APA 7', buildE15Sections())}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Word (.docx)
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadSimplePdf(E15_BITACORA_PROMPTS.pdfFilename, 'E15 · Bitácora de Prompts de Inteligencia Artificial', 'Uso exclusivo en búsqueda de literatura científica y corrección ortográfica APA 7', buildE15Sections())}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Descargar PDF
                    </button>
                  </div>
                </div>

                {expandedKeys.E15 && (
                  <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                    <p className="text-xs leading-relaxed text-slate-700">
                      {E15_BITACORA_PROMPTS.summaryNote}
                    </p>
                    <div className="overflow-x-auto border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600">
                          <tr>
                            <th className="px-3 py-2 font-semibold">ID</th>
                            <th className="px-3 py-2 font-semibold">Categoría</th>
                            <th className="px-3 py-2 font-semibold">Prompt Documentado</th>
                            <th className="px-3 py-2 font-semibold">Validación Humana</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {E15_BITACORA_PROMPTS.prompts.map((p) => (
                            <tr key={p.id}>
                              <td className="px-3 py-2 font-mono font-semibold text-slate-900 whitespace-nowrap">{p.id}</td>
                              <td className="px-3 py-2 font-medium text-slate-800">{p.categoria}</td>
                              <td className="px-3 py-2 text-slate-700">{p.prompt}</td>
                              <td className="px-3 py-2 text-slate-600">{p.validacionHumana}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* E16 — Declaración Uso IA Firmada */}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-900">E16</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{E16_DECLARACION_IA_TEMPLATE.pdfFilename}</span>
                      <span aria-hidden="true">·</span>
                      <span>Plantilla lista para firma física/digital de los 4 coautores</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900">
                      {E16_DECLARACION_IA_TEMPLATE.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand('E16')}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {expandedKeys.E16 ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {expandedKeys.E16 ? 'Ocultar acta' : 'Leer acta'}
                    </button>
                    <button
                      type="button"
                      onClick={() => void downloadTemplateDocx(E16_DECLARACION_IA_TEMPLATE.docxFilename, E16_DECLARACION_IA_TEMPLATE.title, 'Documento oficial de integridad académica — Grupo G01 (UPN)', buildE16Sections())}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Plantilla Word (.docx)
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadSimplePdf(E16_DECLARACION_IA_TEMPLATE.pdfFilename, E16_DECLARACION_IA_TEMPLATE.title, 'Documento oficial de integridad académica — Grupo G01 (UPN)', buildE16Sections())}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Descargar PDF
                    </button>
                  </div>
                </div>

                {expandedKeys.E16 && (
                  <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                    <p className="border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-800">
                      {E16_DECLARACION_IA_TEMPLATE.swornText}
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {E16_DECLARACION_IA_TEMPLATE.members.map((m) => (
                        <div key={m.id} className="border border-slate-200 p-3 text-xs">
                          <div className="font-semibold text-slate-900">{m.fullName}</div>
                          <div className="font-mono text-[11px] text-slate-500">Código UPN: {m.code}</div>
                          <div className="mt-4 border-t border-dashed border-slate-300 pt-1.5 text-[11px] text-slate-500">
                            Firma / V°B° declarante
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* E17 — Reporte Turnitin Similitud e IA */}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-900">E17</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{E17_TURNITIN_AUDIT_TEMPLATE.pdfFilename}</span>
                      <span aria-hidden="true">·</span>
                      <span>Evidencia de Similitud ≤ 15 % e IA ≤ 10 % + Prompt pre-auditoría</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900">
                      Plantilla de Reporte Turnitin (Similitud e IA) y Lista de Control Pre-Envío
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand('E17')}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {expandedKeys.E17 ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {expandedKeys.E17 ? 'Ocultar control' : 'Ver plantilla'}
                    </button>
                    <button
                      type="button"
                      onClick={() => void downloadTemplateDocx(E17_TURNITIN_AUDIT_TEMPLATE.docxFilename, 'E17 · Plantilla Reporte Turnitin y Pre-Auditoría', 'Control de límites institucionales UPN (Similitud <= 15 %, IA <= 10 %)', buildE17Sections())}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Plantilla Word (.docx)
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadSimplePdf(E17_TURNITIN_AUDIT_TEMPLATE.pdfFilename, 'E17 · Plantilla Reporte Turnitin y Pre-Auditoría', 'Control de límites institucionales UPN (Similitud <= 15 %, IA <= 10 %)', buildE17Sections())}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Descargar PDF
                    </button>
                  </div>
                </div>

                {expandedKeys.E17 && (
                  <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                    <div className="overflow-x-auto border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600">
                          <tr>
                            <th className="px-3 py-2 font-semibold">Criterio Turnitin</th>
                            <th className="px-3 py-2 font-semibold">Límite Institucional</th>
                            <th className="px-3 py-2 font-semibold">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {E17_TURNITIN_AUDIT_TEMPLATE.umbrales.map((u) => (
                            <tr key={u.criterio}>
                              <td className="px-3 py-2 font-medium text-slate-900">{u.criterio}</td>
                              <td className="px-3 py-2 font-mono text-slate-900 tabular-nums">{u.limite}</td>
                              <td className="px-3 py-2 text-slate-600">{u.estadoPlantilla}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="border border-slate-200 bg-slate-50 p-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          Prompt de verificación previa de similitud y redacción humana
                        </span>
                        <button
                          type="button"
                          onClick={() => void handleCopyAuditPrompt()}
                          className="inline-flex items-center gap-1 border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                        >
                          {copiedPrompt ? <Check className="h-3 w-3 text-emerald-700" /> : <Copy className="h-3 w-3" />}
                          {copiedPrompt ? 'Prompt copiado' : 'Copiar prompt'}
                        </button>
                      </div>
                      <p className="mt-2 font-mono text-[11px] leading-relaxed text-slate-700">
                        {E17_TURNITIN_AUDIT_TEMPLATE.preAuditPrompt}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* E18 — Consentimientos Entrevistas + Maricielo */}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-900">E18</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{E18_CONSENTIMIENTOS_TEMPLATE.pdfFilename}</span>
                      <span aria-hidden="true">·</span>
                      <span>Autorización de imagen (Maricielo) + Entrevistas DT</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900">
                      Plantillas de Consentimiento Informado y Uso Académico de Imagen
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand('E18')}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {expandedKeys.E18 ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {expandedKeys.E18 ? 'Ocultar formatos' : 'Leer formatos'}
                    </button>
                    <button
                      type="button"
                      onClick={() => void downloadTemplateDocx(E18_CONSENTIMIENTOS_TEMPLATE.docxFilename, 'E18 · Consentimientos Informados y Uso Académico de Imagen', 'Formatos editables para Maricielo (fotos prototipo previo) y entrevistados Design Thinking', buildE18Sections())}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Plantilla Word (.docx)
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadSimplePdf(E18_CONSENTIMIENTOS_TEMPLATE.pdfFilename, 'E18 · Consentimientos Informados y Uso Académico de Imagen', 'Formatos firmables para uso fotográfico de prototipo (Maricielo) y entrevistados DT', buildE18Sections())}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Descargar PDF
                    </button>
                  </div>
                </div>

                {expandedKeys.E18 && (
                  <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 lg:grid-cols-2">
                    <div className="border border-slate-200 bg-slate-50/70 p-4 text-xs">
                      <div className="font-bold text-slate-900">
                        {E18_CONSENTIMIENTOS_TEMPLATE.autorizacionImagenMaricielo.titulo}
                      </div>
                      <p className="mt-1.5 text-slate-600">
                        {E18_CONSENTIMIENTOS_TEMPLATE.autorizacionImagenMaricielo.contexto}
                      </p>
                      <p className="mt-2 border-t border-slate-200 pt-2 leading-relaxed text-slate-800">
                        {E18_CONSENTIMIENTOS_TEMPLATE.autorizacionImagenMaricielo.clausula}
                      </p>
                    </div>
                    <div className="border border-slate-200 bg-slate-50/70 p-4 text-xs">
                      <div className="font-bold text-slate-900">
                        {E18_CONSENTIMIENTOS_TEMPLATE.consentimientoEntrevistasDT.titulo}
                      </div>
                      <p className="mt-1.5 text-slate-600">
                        {E18_CONSENTIMIENTOS_TEMPLATE.consentimientoEntrevistasDT.alcance}
                      </p>
                      <p className="mt-2 border-t border-slate-200 pt-2 leading-relaxed text-slate-800">
                        {E18_CONSENTIMIENTOS_TEMPLATE.consentimientoEntrevistasDT.clausula}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================
            CATEGORÍA 05: 05_Pitch_Coevaluacion (E19 – E21)
            ================================================================ */}
        {showCategory('05_Pitch_Coevaluacion') && (
          <div className="border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
              <div>
                <div className="font-mono text-xs font-semibold text-blue-700">
                  05_Pitch_Coevaluacion · E19 – E21
                </div>
                <h2 className="mt-0.5 font-display text-lg font-bold text-slate-950">
                  {DELIVERABLE_CATEGORIES[4].title}
                </h2>
              </div>
              <span className="text-xs text-slate-500">Integrante activo: {activeMember.fullName}</span>
            </div>

            <div className="divide-y divide-slate-200">
              {/* E19 — SOLO TÍTULO (archivo MP4 ignorado explícitamente por instrucción) */}
              <div className="px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-900">E19</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">E19_{pitchTag}_Pitch_3min.mp4</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900">
                      E19_{pitchTag}_Pitch_3min.mp4 — Video Individual de 3 Minutos (Nomenclatura Drive)
                    </h3>
                  </div>
                </div>
              </div>

              {/* E20 — Diapositivas Pitch PDF */}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-900">E20</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">E20_{pitchTag}_Diapositivas_Pitch.pdf</span>
                      <span aria-hidden="true">·</span>
                      <span>8 diapositivas ejecutivas (16:9 horizontal)</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900">
                      Diapositivas de Pitch Individual — {activeMember.fullName}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand('E20')}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {expandedKeys.E20 ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {expandedKeys.E20 ? 'Ocultar esquema' : 'Ver 8 láminas'}
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadPitchSlidesPdf(`E20_${pitchTag}_Diapositivas_Pitch.pdf`, activePitchDeck)}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Descargar PDF
                    </button>
                  </div>
                </div>

                {expandedKeys.E20 && (
                  <div className="mt-4 overflow-x-auto border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="px-3 py-2 font-semibold">#</th>
                          <th className="px-3 py-2 font-semibold">Tiempo</th>
                          <th className="px-3 py-2 font-semibold">Bloque</th>
                          <th className="px-3 py-2 font-semibold">Título en Diapositiva</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {activePitchDeck.slides.map((s) => (
                          <tr key={s.id}>
                            <td className="px-3 py-1.5 font-mono font-semibold tabular-nums">{s.number}</td>
                            <td className="px-3 py-1.5 font-mono text-slate-600 tabular-nums whitespace-nowrap">{s.timeRange}</td>
                            <td className="px-3 py-1.5 font-medium text-slate-800">{s.blockLabel}</td>
                            <td className="px-3 py-1.5 text-slate-700">{s.title}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* E21 — Matriz Coevaluación */}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-900">E21</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{E21_COEVALUACION_WORKBOOK.filename}</span>
                      <span aria-hidden="true">·</span>
                      <span>Escala 1,00 / 0,90 / 0,80 · 4 coautores</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900">
                      Matriz de Coevaluación del Equipo (Grupo G01)
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand('E21')}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {expandedKeys.E21 ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {expandedKeys.E21 ? 'Ocultar matriz' : 'Ver matriz'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadE21CoevaluacionExcel}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap border border-emerald-700 bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5" />
                      Descargar Excel (.xlsx)
                    </button>
                  </div>
                </div>

                {expandedKeys.E21 && (
                  <div className="mt-4 overflow-x-auto border border-slate-200">
                    <table className="w-full text-left text-xs tabular-nums">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Código</th>
                          <th className="px-3 py-2 font-semibold">Integrante</th>
                          <th className="px-3 py-2 text-right font-semibold">Plazos (20)</th>
                          <th className="px-3 py-2 text-right font-semibold">Evid. (25)</th>
                          <th className="px-3 py-2 text-right font-semibold">PRISMA (20)</th>
                          <th className="px-3 py-2 text-right font-semibold">Par (15)</th>
                          <th className="px-3 py-2 text-right font-semibold">Pitch (20)</th>
                          <th className="px-3 py-2 text-right font-semibold">Total</th>
                          <th className="px-3 py-2 text-right font-semibold">Factor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {E21_COEVALUACION_WORKBOOK.rows.map((r) => (
                          <tr key={r.codigo}>
                            <td className="px-3 py-2 font-mono font-semibold text-slate-900">{r.codigo}</td>
                            <td className="px-3 py-2 font-medium text-slate-900">{r.integrante}</td>
                            <td className="px-3 py-2 text-right">{r.criterio1}</td>
                            <td className="px-3 py-2 text-right">{r.criterio2}</td>
                            <td className="px-3 py-2 text-right">{r.criterio3}</td>
                            <td className="px-3 py-2 text-right">{r.criterio4}</td>
                            <td className="px-3 py-2 text-right">{r.criterio5}</td>
                            <td className="px-3 py-2 text-right font-bold text-slate-950">{r.puntajeTotal}%</td>
                            <td className="px-3 py-2 text-right font-mono font-bold text-emerald-700">
                              {r.factorCorreccion}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
