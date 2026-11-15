import { useState } from 'react';
import { CheckSquare, Download, ExternalLink, List } from 'lucide-react';
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

interface InformeViewProps {
  activeMember: TeamMember;
  onSelectMember: (id: TeamMember['id']) => void;
  onExportWord: () => Promise<void>;
  exportingWord: boolean;
}

const QUICK_SECTIONS = [
  { id: 'sec-portada', label: 'Portada' },
  { id: 'sec-resumen', label: 'Resumen' },
  { id: 'sec-intro', label: '1. Intro' },
  { id: 'sec-contexto', label: '2. Contexto' },
  { id: 'sec-prisma', label: '3. PRISMA' },
  { id: 'sec-resultados', label: '4. Resultados' },
  { id: 'sec-discusion', label: '5. Finanzas' },
  { id: 'sec-conclusiones', label: '6. Conclusiones' },
  { id: 'sec-declaracion-ia', label: 'Decl. Jurada IA' },
  { id: 'sec-referencias', label: 'Referencias' },
  { id: 'sec-anexos', label: 'Anexos A–F' },
];

const RUBRIC_CRITERIA = [
  { code: 'C1', max: '2,0', desc: 'Brecha clínica, marco PCC, RQ1–RQ3 y Design Thinking (5 fases con entrevistas).' },
  { code: 'C2', max: '3,0', desc: 'SCAMPER con indicadores cuantitativos y trazabilidad hacia los 4 subsistemas.' },
  { code: 'C3', max: '2,0', desc: 'Impacto social cuantificado y alineamiento con ODS 3, 9 y 10.' },
  { code: 'C4', max: '3,0', desc: 'Pitch individual de 3 minutos (evaluado por separado mediante Anexo D + E20).' },
  { code: 'C5', max: '4,0', desc: 'Protocolo PRISMA 2020 completo (820 → 558 → 90 → 85 → 31), cribado doble y 100 % 2022–2026.' },
  { code: 'C6', max: '2,0', desc: 'Matriz de extracción de 31 estudios primarios (P01–P31) + 2 guías + 8 referentes y bibliometría.' },
  { code: 'C7', max: '3,0', desc: 'Canvas, Cadena de Valor, Flujo de Caja 0–5 años, VAN/TIR/B-C/PRI y sensibilidad ±10 %/−20 %.' },
  { code: 'C8', max: '1,0', desc: 'Integridad académica (Declaración Jurada IA, Turnitin IA ≤ 10 %, Sim. ≤ 15 %, APA 7 con 41 DOIs).' },
];

export function InformeView({
  activeMember,
  onSelectMember,
  onExportWord,
  exportingWord,
}: InformeViewProps) {
  const [showRubric, setShowRubric] = useState(false);
  const [diagramFallback, setDiagramFallback] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      {/* Barra superior de selección de coautor, salto de secciones y exportación Word */}
      <div className="mb-5 border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-medium text-slate-500">Coautor de entrega (Anexo D):</span>
            {TEAM_MEMBERS.map((member) => {
              const active = member.id === activeMember.id;
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => onSelectMember(member.id)}
                  className={`whitespace-nowrap shrink-0 border px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {member.shortName} · {member.code}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowRubric((v) => !v)}
              className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <CheckSquare className="h-3.5 w-3.5" />
              Rúbrica T3 (C1–C8)
            </button>

            <button
              type="button"
              onClick={() => void onExportWord()}
              disabled={exportingWord}
              className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 border border-blue-700 bg-blue-700 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-blue-800 disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              {exportingWord ? 'Generando Word...' : `Descargar ${activeMember.fileTag}`}
            </button>
          </div>
        </div>

        {/* Navegación rápida de las 17 partes */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-200 pt-3">
          <List className="mr-1 h-3.5 w-3.5 text-slate-400" />
          {QUICK_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => scrollToSection(sec.id)}
              className="whitespace-nowrap shrink-0 border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
            >
              {sec.label}
            </button>
          ))}
        </div>

        {showRubric && (
          <div className="mt-4 border-t border-slate-200 pt-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900">
                Verificación de Rúbrica T3 (17 pts artículo grupal + 3 pts pitch individual = 20 pts)
              </span>
              <span className="font-mono text-slate-600">Archivo: {activeMember.fileTag}</span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {RUBRIC_CRITERIA.map((c) => (
                <div key={c.code} className="bg-slate-50 p-2.5 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-900 tabular-nums">
                    <span>{c.code}</span>
                    <span>Máx. {c.max} pts</span>
                  </div>
                  <p className="mt-1 text-slate-600">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lienzo del Artículo Científico (17 partes obligatorias en orden Tabla 19) */}
      <article className="mx-auto max-w-[980px] border border-slate-200 bg-white px-6 py-8 text-slate-800 sm:px-12 sm:py-10">
        {/* 1. PORTADA */}
        <header id="sec-portada" className="scroll-mt-20 border-b border-slate-200 pb-8">
          <div className="text-center">
            <div className="font-display text-sm font-bold uppercase tracking-wider text-slate-900">
              {COURSE_METADATA.university}
            </div>
            <div className="mt-0.5 text-xs text-slate-600">{COURSE_METADATA.faculty}</div>
            <div className="mt-4 font-mono text-xs font-semibold uppercase tracking-wide text-blue-800">
              Examen por Competencias T3 · Revisión Sistemática PRISMA 2020
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold leading-snug text-slate-950 sm:text-3xl">
              {ARTICLE_METADATA.title}
            </h1>
            <p className="mt-2 text-sm text-slate-600">{ARTICLE_METADATA.subtitle}</p>
          </div>

          <div className="mt-6 overflow-x-auto border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2 font-semibold">Coautor(a)</th>
                  <th className="px-3 py-2 font-semibold">Código UPN</th>
                  <th className="px-3 py-2 font-semibold">Correo</th>
                  <th className="px-3 py-2 font-semibold">ORCID</th>
                  <th className="px-3 py-2 font-semibold">Contribución principal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {TEAM_MEMBERS.map((m) => {
                  const isCurrent = m.id === activeMember.id;
                  return (
                    <tr key={m.id} className={isCurrent ? 'bg-blue-50/70' : ''}>
                      <td className={`px-3 py-2 ${isCurrent ? 'font-bold text-slate-950' : 'text-slate-800'}`}>
                        {m.fullName}
                        {isCurrent ? ' (Entrega actual)' : ''}
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-700 tabular-nums">{m.code}</td>
                      <td className="px-3 py-2 font-mono text-slate-600">{m.email}</td>
                      <td className="px-3 py-2 font-mono text-slate-600">{m.orcidPlaceholder}</td>
                      <td className="px-3 py-2 text-slate-700">{m.roleTitle}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 bg-slate-50 p-4 text-xs text-slate-700 sm:grid-cols-2">
            <div>
              <span className="font-semibold text-slate-900">Curso y Grupo: </span>
              {COURSE_METADATA.course} · {COURSE_METADATA.groupCode}
            </div>
            <div>
              <span className="font-semibold text-slate-900">Docente: </span>
              {COURSE_METADATA.docente}
            </div>
            <div>
              <span className="font-semibold text-slate-900">Periodo y sede: </span>
              {COURSE_METADATA.period} · {COURSE_METADATA.city}
            </div>
            <div>
              <span className="font-semibold text-slate-900">Archivo individual: </span>
              <span className="font-mono text-slate-900">{activeMember.fileTag}</span>
            </div>
            <div className="sm:col-span-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>
                <strong className="text-slate-900">Carpeta Drive E00: </strong>
                <a
                  href={COURSE_METADATA.driveRootPlaceholder}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-blue-800 underline"
                >
                  {COURSE_METADATA.driveRootPlaceholder}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </span>
              <span>
                <strong className="text-slate-900">Pitch E20 ({activeMember.shortName}): </strong>
                <a
                  href={activeMember.drivePitchPlaceholder}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-blue-800 underline"
                >
                  {activeMember.drivePitchFile}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </span>
            </div>
          </div>
        </header>

        {/* 2. ÍNDICE */}
        <section className="border-b border-slate-200 py-6">
          <h2 className="font-display text-lg font-bold text-slate-950">Índice del Manuscrito</h2>
          <ol className="mt-3 grid grid-cols-1 gap-1.5 text-xs text-slate-700 sm:grid-cols-2">
            <li>1. Resumen y Palabras Clave / Abstract y Keywords</li>
            <li>2. Introducción (Brecha clínica, revisiones guía y marco PCC)</li>
            <li>3. Contexto Mecatrónico ALMA (Bloques, DT y SCAMPER)</li>
            <li>4. Metodología PRISMA 2020 (Scopus, WoS, ScienceDirect → n = 31)</li>
            <li>5. Resultados (Bibliometría, Matriz P01–P31 y RQ1–RQ3)</li>
            <li>6. Discusión (Canvas, Cadena, Flujo 0–5, VAN/TIR/B-C y ODS)</li>
            <li>7. Conclusiones y Declaración CRediT</li>
            <li>8. Declaración Jurada de Uso Responsable de IA (E15–E16)</li>
            <li>9. Referencias Bibliográficas APA 7 (41 DOIs verificados)</li>
            <li>10. Anexos A–F (IA, Turnitin, Evidencias E00–E21 y Coevaluación)</li>
          </ol>
        </section>

        {/* 3. RESUMEN Y ABSTRACT */}
        <section id="sec-resumen" className="scroll-mt-20 border-b border-slate-200 py-6">
          <h2 className="font-display text-lg font-bold text-slate-950">Resumen</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-800">{ARTICLE_METADATA.resumenEs}</p>
          <p className="mt-2 text-xs font-medium text-slate-700">
            <span className="font-semibold text-slate-950">Palabras clave: </span>
            {ARTICLE_METADATA.keywordsEs.join(' · ')}
          </p>

          <h2 className="mt-6 font-display text-lg font-bold text-slate-950">Abstract</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-800">{ARTICLE_METADATA.abstractEn}</p>
          <p className="mt-2 text-xs font-medium text-slate-700">
            <span className="font-semibold text-slate-950">Keywords: </span>
            {ARTICLE_METADATA.keywordsEn.join(' · ')}
          </p>
        </section>

        {/* 4. INTRODUCCIÓN */}
        <section id="sec-intro" className="scroll-mt-20 border-b border-slate-200 py-6">
          <h2 className="font-display text-xl font-bold text-slate-950">1. Introducción</h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-800">
            <p>
              El accidente cerebrovascular (ACV) permanece como una de las primeras causas de discapacidad motora prolongada en adultos a nivel mundial, con crecimiento sostenido en países de ingresos medios y bajos (Feigin et al., 2024). En el contexto peruano, más del 65 % de pacientes con hemiparesia de miembro superior interrumpe su rehabilitación ambulatoria antes del tercer mes debido a cupos hospitalarios limitados y costos de traslado recurrentes.
            </p>
            <p>
              Revisiones sistemáticas recientes tomadas como guía metodológica demuestran dos vacíos críticos: por un lado, el control basado en electromiografía superficial (sEMG) sufre alta variabilidad ante espasticidad post-ACV y la mayoría de prototipos solo se valida en sujetos sanos (Karasheva et al., 2025); por otro, la interacción humano-robot asistida por IA en salud requiere interfaces más naturales, centradas en confianza y acompañadas de modelos económicos sostenibles (Shafaie et al., 2026). Aunque existen experiencias clínicas alentadoras con robots gamificados (Zheng et al., 2025) y guantes activados por voz (Guo et al., 2022), los sistemas comerciales superan US$ 1 500–2 427 (Kansal et al., 2023). El proyecto ALMA (UPN) responde a esta brecha integrando un exoesqueleto portátil de codo impreso en PLA, controlado por voz en el borde (Edge NLP), actuador de 40 kg·cm y aislamiento galvánico en ESP32.
            </p>
          </div>

          <div className="mt-4 bg-slate-50 p-4">
            <h3 className="font-display text-sm font-bold text-slate-900">1.1 Marco PCC y Preguntas de Revisión</h3>
            <dl className="mt-2 space-y-1.5 text-xs text-slate-700">
              <div>
                <dt className="inline font-semibold text-slate-950">Población (P): </dt>
                <dd className="inline">{ARTICLE_METADATA.pcc.poblacion}</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-slate-950">Concepto (C): </dt>
                <dd className="inline">{ARTICLE_METADATA.pcc.concepto}</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-slate-950">Contexto (C): </dt>
                <dd className="inline">{ARTICLE_METADATA.pcc.contexto}</dd>
              </div>
            </dl>
            <ul className="mt-3 space-y-1.5 border-t border-slate-200 pt-3 text-xs text-slate-800">
              {ARTICLE_METADATA.rqs.map((rq) => (
                <li key={rq.id}>
                  <span className="font-mono font-bold text-blue-800">{rq.id}: </span>
                  {rq.question}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5. CONTEXTO DEL PROYECTO ALMA (DIAGRAMA + DT + SCAMPER) */}
        <section id="sec-contexto" className="scroll-mt-20 border-b border-slate-200 py-6">
          <h2 className="font-display text-xl font-bold text-slate-950">
            2. Contexto Mecatrónico ALMA: Arquitectura, Design Thinking y SCAMPER
          </h2>

          {/* Diagrama de Bloques SVG + Imagen real del repositorio */}
          <h3 className="mt-4 font-display text-sm font-bold text-slate-900">
            2.1 Diagrama de Bloques en Cuatro Subsistemas Acoplados
          </h3>

          <div className="mt-3 border border-slate-200 bg-slate-50 p-4">
            <svg
              viewBox="0 0 880 185"
              className="h-auto w-full"
              role="img"
              aria-label="Diagrama de bloques mecatrónico del exoesqueleto ALMA"
            >
              {/* Bloque 1 */}
              <rect x="10" y="25" width="190" height="120" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="24" y="48" fontSize="11" fontWeight="700" fill="#1d4ed8">SUB-04 · SOFTWARE / IA</text>
              <text x="24" y="68" fontSize="12" fontWeight="700" fill="#0f172a">App ALMA + Edge NLP</text>
              <text x="24" y="88" fontSize="10" fill="#475569">Voz ES-PE (91,70 %)</text>
              <text x="24" y="104" fontSize="10" fill="#475569">IndexedDB Offline-First</text>
              <text x="24" y="120" fontSize="10" fill="#475569">Express API /api/sesiones</text>

              {/* Flecha 1 -> 2 */}
              <line x1="200" y1="85" x2="235" y2="85" stroke="#1e293b" strokeWidth="1.5" />
              <polygon points="235,80 245,85 235,90" fill="#1e293b" />
              <text x="204" y="74" fontSize="9" fill="#475569">BLE &lt;20ms</text>

              {/* Bloque 2 */}
              <rect x="245" y="25" width="190" height="120" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="259" y="48" fontSize="11" fontWeight="700" fill="#1d4ed8">SUB-03 · CONTROL</text>
              <text x="259" y="68" fontSize="12" fontWeight="700" fill="#0f172a">ESP32 + Lógica Difusa</text>
              <text x="259" y="88" fontSize="10" fill="#475569">Mamdani Velocidad 1–10</text>
              <text x="259" y="104" fontSize="10" fill="#475569">Parada Dolor ≥ 7/10</text>
              <text x="259" y="120" fontSize="10" fill="#475569">Buzzer Alerta GPIO 12</text>

              {/* Flecha 2 -> 3 */}
              <line x1="435" y1="85" x2="470" y2="85" stroke="#1e293b" strokeWidth="1.5" />
              <polygon points="470,80 480,85 470,90" fill="#1e293b" />
              <text x="441" y="74" fontSize="9" fill="#475569">PWM 50Hz</text>

              {/* Bloque 3 */}
              <rect x="480" y="25" width="190" height="120" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="494" y="48" fontSize="11" fontWeight="700" fill="#1d4ed8">SUB-02 · POTENCIA</text>
              <text x="494" y="68" fontSize="12" fontWeight="700" fill="#0f172a">XL4015 + Servo 40kg</text>
              <text x="494" y="88" fontSize="10" fill="#475569">LiPo 11,1V 3300mAh</text>
              <text x="494" y="104" fontSize="10" fill="#475569">Aislamiento VCC/ESP32</text>
              <text x="494" y="120" fontSize="10" fill="#475569">Celda Carga HX711</text>

              {/* Flecha 3 -> 4 */}
              <line x1="670" y1="85" x2="705" y2="85" stroke="#1e293b" strokeWidth="1.5" />
              <polygon points="705,80 715,85 705,90" fill="#1e293b" />
              <text x="675" y="74" fontSize="9" fill="#475569">Torque</text>

              {/* Bloque 4 */}
              <rect x="715" y="25" width="155" height="120" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="728" y="48" fontSize="11" fontWeight="700" fill="#1d4ed8">SUB-01 · MECÁNICA</text>
              <text x="728" y="68" fontSize="12" fontWeight="700" fill="#0f172a">Chasis PLA 3D</text>
              <text x="728" y="88" fontSize="10" fill="#475569">26 piezas Inventor</text>
              <text x="728" y="104" fontSize="10" fill="#475569">ROM seguro 0°–90°</text>
              <text x="728" y="120" fontSize="10" fill="#475569">Correas ergonómicas</text>

              {/* Lazo de realimentación HX711 */}
              <path d="M 575 145 L 575 168 L 340 168 L 340 145" fill="none" stroke="#64748b" strokeWidth="1.2" strokeDasharray="4 3" />
              <polygon points="336,151 340,145 344,151" fill="#64748b" />
              <text x="395" y="164" fontSize="9.5" fill="#475569">Realimentación de esfuerzo HX711 y ángulo articular</text>
            </svg>
          </div>

          <div className="mt-3 overflow-x-auto border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2 font-semibold">Código</th>
                  <th className="px-3 py-2 font-semibold">Subsistema</th>
                  <th className="px-3 py-2 font-semibold">Especificaciones técnicas</th>
                  <th className="px-3 py-2 font-semibold">Salida e interfaz</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {BLOCK_DIAGRAM_SUBSYSTEMS.map((s) => (
                  <tr key={s.code}>
                    <td className="px-3 py-2 font-mono font-semibold text-blue-800">{s.code}</td>
                    <td className="px-3 py-2 font-semibold text-slate-900">{s.name}</td>
                    <td className="px-3 py-2 text-slate-700">{s.specs}</td>
                    <td className="px-3 py-2 text-slate-700">{s.interfaceOut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!diagramFallback && (
            <figure className="mt-4 border border-slate-200 bg-slate-50 p-3">
              <img
                src="/alma-assets/diagramas/flujograma_sistema_hardware.png"
                alt="Flujograma del sistema hardware ALMA"
                referrerPolicy="no-referrer"
                onError={() => setDiagramFallback(true)}
                className="mx-auto max-h-72 w-auto object-contain"
              />
              <figcaption className="mt-2 text-center text-[11px] text-slate-500">
                Figura 1. Flujograma real de hardware y señales del repositorio ALMA (electronica/diagramas_sistema).
              </figcaption>
            </figure>
          )}

          {/* Design Thinking */}
          <h3 className="mt-6 font-display text-sm font-bold text-slate-900">
            2.2 Design Thinking Aplicado en Cinco Fases (Evidencias E01–E03)
          </h3>
          <div className="mt-2 overflow-x-auto border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2 font-semibold">Fase</th>
                  <th className="px-3 py-2 font-semibold">Evidencia</th>
                  <th className="px-3 py-2 font-semibold">Herramienta</th>
                  <th className="px-3 py-2 font-semibold">Hallazgos de campo y validación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {DESIGN_THINKING_PHASES.map((d) => (
                  <tr key={d.fase}>
                    <td className="px-3 py-2 font-semibold text-slate-900">{d.fase}</td>
                    <td className="px-3 py-2 font-mono text-blue-800">{d.evidenciaCode}</td>
                    <td className="px-3 py-2 text-slate-700">{d.herramienta}</td>
                    <td className="px-3 py-2 text-slate-700">{d.hallazgo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SCAMPER */}
          <h3 className="mt-6 font-display text-sm font-bold text-slate-900">
            2.3 Matriz SCAMPER con Indicadores Cuantitativos (E02)
          </h3>
          <div className="mt-2 overflow-x-auto border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2 font-semibold">Letra</th>
                  <th className="px-3 py-2 font-semibold">Pregunta guía</th>
                  <th className="px-3 py-2 font-semibold">Mejora implementada en ALMA</th>
                  <th className="px-3 py-2 font-semibold">Indicador verificado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {SCAMPER_MATRIX.map((s) => (
                  <tr key={s.letra}>
                    <td className="px-3 py-2 font-semibold text-blue-800">{s.letra}</td>
                    <td className="px-3 py-2 text-slate-600">{s.pregunta}</td>
                    <td className="px-3 py-2 text-slate-800">{s.accion}</td>
                    <td className="px-3 py-2 font-medium text-slate-900">{s.indicador}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. METODOLOGÍA PRISMA 2020 */}
        <section id="sec-prisma" className="scroll-mt-20 border-b border-slate-200 py-6">
          <h2 className="font-display text-xl font-bold text-slate-950">3. Metodología (Protocolo PRISMA 2020)</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-800">
            La revisión siguió íntegramente las directrices PRISMA 2020 (Page et al., 2021) tomando como referencia estructural las revisiones sistemáticas de Karasheva et al. (2025) y Shafaie et al. (2026), con trazabilidad auditable en las evidencias E04–E09. La búsqueda sistemática final se ejecutó el {PRISMA_PROTOCOL.searchDate} en Scopus, Web of Science Core Collection y ScienceDirect, verificando cada DOI en Crossref.
          </p>

          <div className="mt-4 space-y-2 bg-slate-50 p-4 text-xs">
            <div>
              <div className="font-semibold text-slate-900">Ecuación Scopus (n = 385 registros):</div>
              <code className="mt-1 block break-words font-mono text-[11px] text-slate-700">
                {PRISMA_PROTOCOL.scopusQuery}
              </code>
            </div>
            <div className="border-t border-slate-200 pt-2">
              <div className="font-semibold text-slate-900">Ecuación Web of Science (n = 245 registros):</div>
              <code className="mt-1 block break-words font-mono text-[11px] text-slate-700">
                {PRISMA_PROTOCOL.wosQuery}
              </code>
            </div>
            <div className="border-t border-slate-200 pt-2">
              <div className="font-semibold text-slate-900">Ecuación ScienceDirect (n = 190 registros):</div>
              <code className="mt-1 block break-words font-mono text-[11px] text-slate-700">
                {PRISMA_PROTOCOL.scienceDirectQuery}
              </code>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="border border-slate-200 p-4 text-xs">
              <h3 className="font-display font-bold text-slate-900">Criterios de Inclusión</h3>
              <ul className="mt-2 space-y-1.5 text-slate-700">
                {PRISMA_PROTOCOL.inclusionCriteria.map((c, idx) => (
                  <li key={idx}>
                    <span className="font-mono font-semibold text-blue-800">I{idx + 1}. </span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-slate-200 p-4 text-xs">
              <h3 className="font-display font-bold text-slate-900">Criterios de Exclusión</h3>
              <ul className="mt-2 space-y-1.5 text-slate-700">
                {PRISMA_PROTOCOL.exclusionCriteria.map((c, idx) => (
                  <li key={idx}>
                    <span className="font-mono font-semibold text-slate-900">E{idx + 1}. </span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Diagrama de Flujo PRISMA SVG con conteos exactos */}
          <h3 className="mt-6 font-display text-sm font-bold text-slate-900">
            3.1 Diagrama de Flujo PRISMA 2020 (Conteos Auditados 820 → 31)
          </h3>
          <div className="mt-2 border border-slate-200 bg-slate-50 p-4">
            <svg viewBox="0 0 820 346" className="h-auto w-full" role="img" aria-label="Diagrama de flujo PRISMA 2020">
              {/* Identificación */}
              <rect x="35" y="15" width="390" height="52" fill="#ffffff" stroke="#1d4ed8" strokeWidth="1.5" />
              <text x="50" y="36" fontSize="11" fontWeight="700" fill="#1d4ed8">IDENTIFICACIÓN</text>
              <text x="50" y="54" fontSize="11" fill="#0f172a">Scopus (385) + WoS (245) + ScienceDirect (190) → Total: 820</text>

              <line x1="425" y1="41" x2="480" y2="41" stroke="#64748b" strokeWidth="1.3" />
              <polygon points="480,37 488,41 480,45" fill="#64748b" />
              <rect x="490" y="15" width="295" height="52" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.3" />
              <text x="505" y="36" fontSize="11" fontWeight="700" fill="#334155">Duplicados eliminados</text>
              <text x="505" y="54" fontSize="11" fill="#475569">Registros duplicados removidos: n = 262</text>

              <line x1="230" y1="67" x2="230" y2="95" stroke="#1e293b" strokeWidth="1.3" />
              <polygon points="226,95 230,103 234,95" fill="#1e293b" />

              {/* Cribado */}
              <rect x="35" y="103" width="390" height="52" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
              <text x="50" y="124" fontSize="11" fontWeight="700" fill="#0f172a">CRIBADO (Título y resumen)</text>
              <text x="50" y="142" fontSize="11" fill="#334155">Cribado doble ciego (Lote 1: 279 · Lote 2: 279) → n = 558</text>

              <line x1="425" y1="129" x2="480" y2="129" stroke="#64748b" strokeWidth="1.3" />
              <polygon points="480,125 488,129 480,133" fill="#64748b" />
              <rect x="490" y="103" width="295" height="52" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.3" />
              <text x="505" y="124" fontSize="11" fontWeight="700" fill="#334155">Excluidos en cribado</text>
              <text x="505" y="142" fontSize="11" fill="#475569">Fuera de criterio PCC (234 + 234): n = 468</text>

              <line x1="230" y1="155" x2="230" y2="183" stroke="#1e293b" strokeWidth="1.3" />
              <polygon points="226,183 230,191 234,183" fill="#1e293b" />

              {/* Elegibilidad */}
              <rect x="35" y="191" width="390" height="58" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
              <text x="50" y="212" fontSize="11" fontWeight="700" fill="#0f172a">ELEGIBILIDAD (Texto completo)</text>
              <text x="50" y="229" fontSize="11" fill="#334155">Buscados: 90 · No recuperados: 5</text>
              <text x="50" y="243" fontSize="11" fill="#334155">Evaluados a texto completo: n = 85</text>

              <line x1="425" y1="220" x2="480" y2="220" stroke="#64748b" strokeWidth="1.3" />
              <polygon points="480,216 488,220 480,224" fill="#64748b" />
              <rect x="490" y="183" width="295" height="74" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.3" />
              <text x="505" y="201" fontSize="11" fontWeight="700" fill="#334155">Excluidos a texto completo: n = 54</text>
              <text x="505" y="217" fontSize="10" fill="#475569">• Sin métricas cuantitativas/costo: 21</text>
              <text x="505" y="231" fontSize="10" fill="#475569">• Simulación o miembro inferior/prótesis: 18</text>
              <text x="505" y="245" fontSize="10" fill="#475569">• Rev. secundarias (incl. guías G01–G02): 15</text>

              <line x1="230" y1="249" x2="230" y2="278" stroke="#1d4ed8" strokeWidth="1.5" />
              <polygon points="226,278 230,286 234,278" fill="#1d4ed8" />

              {/* Incluidos */}
              <rect x="35" y="286" width="390" height="48" fill="#eff6ff" stroke="#1d4ed8" strokeWidth="1.8" />
              <text x="50" y="306" fontSize="11.5" fontWeight="700" fill="#1e3a8a">ESTUDIOS PRIMARIOS INCLUIDOS EN SÍNTESIS</text>
              <text x="50" y="323" fontSize="11" fontWeight="600" fill="#1e40af">n = 31 estudios P01–P31 (100 % 2022–2026) · +2 guías +8 ref.</text>
            </svg>
          </div>
        </section>

        {/* 7. RESULTADOS */}
        <section id="sec-resultados" className="scroll-mt-20 border-b border-slate-200 py-6">
          <h2 className="font-display text-xl font-bold text-slate-950">4. Resultados</h2>

          <h3 className="mt-4 font-display text-sm font-bold text-slate-900">
            4.1 Resumen Bibliométrico (n = 31 Estudios Primarios + 2 Revisiones Guía + 8 Referentes)
          </h3>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BIBLIOMETRIC_STATS.map((b) => (
              <div key={b.label} className="bg-slate-50 p-3.5">
                <div className="text-xs text-slate-500">{b.label}</div>
                <div className="mt-1 font-display text-lg font-bold text-slate-950 tabular-nums">{b.value}</div>
                <div className="mt-0.5 text-[11px] text-slate-600">{b.detail}</div>
              </div>
            ))}
          </div>

          <h3 className="mt-6 font-display text-sm font-bold text-slate-900">
            4.2 Matriz Completa de Extracción de Datos (31 Estudios Primarios P01–P31)
          </h3>
          <div className="mt-2 overflow-x-auto border border-slate-200">
            <table className="w-full text-left text-[11px]">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-2.5 py-2 font-semibold">ID</th>
                  <th className="px-2.5 py-2 font-semibold">Año / País</th>
                  <th className="px-2.5 py-2 font-semibold">Autor y DOI</th>
                  <th className="px-2.5 py-2 font-semibold">Arquitectura mecatrónica</th>
                  <th className="px-2.5 py-2 font-semibold">Control / IA</th>
                  <th className="px-2.5 py-2 font-semibold">Métrica / Desempeño</th>
                  <th className="px-2.5 py-2 font-semibold">Costo / Impacto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 tabular-nums">
                {PRISMA_INCLUDED_STUDIES.map((study) => (
                  <tr key={study.id}>
                    <td className="px-2.5 py-2 font-mono font-semibold text-blue-800 whitespace-nowrap">
                      {study.id}
                    </td>
                    <td className="px-2.5 py-2 text-slate-700">
                      {study.year} · {study.country}
                    </td>
                    <td className="px-2.5 py-2">
                      <div className="font-medium text-slate-900">{study.authors.split(',')[0]} et al.</div>
                      <a
                        href={study.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] text-blue-800 underline"
                      >
                        {study.doi}
                      </a>
                    </td>
                    <td className="px-2.5 py-2 text-slate-700">{study.prismaExtraction.architecture}</td>
                    <td className="px-2.5 py-2 text-slate-700">{study.prismaExtraction.controlOrAi}</td>
                    <td className="px-2.5 py-2 text-slate-700">{study.prismaExtraction.performanceMetric}</td>
                    <td className="px-2.5 py-2 text-slate-700">{study.prismaExtraction.costOrImpact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-6 font-display text-sm font-bold text-slate-900">
            4.3 Síntesis Temática en Respuesta a RQ1–RQ3
          </h3>
          <div className="mt-2 space-y-2 text-xs leading-relaxed text-slate-800">
            <p>
              <strong>RQ1 (Arquitecturas, control seguro e interfaces por voz/IA):</strong> El clúster de diseño mecánico evidencia el auge de soportes impresos en 3D FDM optimizados con DoE/FEA (Ly et al., 2026), actuadores modulares hueso-músculo (Zhang et al., 2026), sensores de presión EIT en interfaces personalizadas (Chen et al., 2026) y estructuras en PLA con Arduino/ESP32 (Kansal et al., 2023; Toro-Ossaba et al., 2024; Triwiyanto et al., 2025). En control adaptativo predominan las estrategias Assist-As-Needed por campo de velocidad con detección de espasticidad (Li et al., 2026; Chia et al., 2024), aprendizaje por refuerzo PPO/Actor-Critic (Shah, 2026; Yin et al., 2026) y control de desempeño prescrito tolerante a fallos (Zhang et al., 2025; Li et al., 2025). Respecto a la interfaz humano-robot, Guo et al. (2022) validan el control por voz personalizado con MobileNetV1 (−89,6 % parámetros, lazo de ~2 ms), superando las limitaciones clínicas del sEMG ante espasticidad señaladas por Karasheva et al. (2025), mientras Zheng et al. (2025) reportan mejora de +13,34 puntos en FMA-UE (p = 0,039).
            </p>
            <p>
              <strong>RQ2 (Costos de fabricación y modelos de telerehabilitación):</strong> Frente a dispositivos comerciales superiores a US$ 2 427 (Kansal et al., 2023), el diseño PLA 3D de Kansal et al. (2023) logra un BOM de US$ 107 y el referente abierto Triwiyanto et al. (2025) se mantiene bajo US$ 100. Estas cifras sitúan el BOM de ALMA (S/ 420 ≈ US$ 112) muy por debajo del umbral de costo-efectividad (&lt; US$ 500–1 000) demostrado en revisiones económicas de telerehabilitación (Syukriyah et al., 2026; Samkharadze et al., 2026; Candio et al., 2022), respondiendo al llamado de Shafaie et al. (2026) por modelos económicos sostenibles. Además, plataformas multisensor en el hogar como Li et al. (2026b) y Ventura et al. (2026) confirman que el seguimiento remoto prescinde de cámaras costosas.
            </p>
            <p>
              <strong>RQ3 (Seguridad eléctrica, adherencia e impacto ODS):</strong> La adherencia domiciliaria exige montaje inferior a 3 minutos y alta autonomía de uso (Spits et al., 2022), así como cotas fisiológicas estrictas (Zhang et al., 2025; Kim et al., 2022) y modulación segura ante dolor articular (Abdallah &amp; Boutera, 2024). ALMA responde limitando el codo a 0°–90°, aislando el riel de potencia del ESP32 con regulador XL4015, reduciendo latencia BLE por debajo de 20 ms (crítico según Kang et al., 2026) y emitiendo alertas clínicas automáticas cuando el dolor alcanza ≥ 7/10.
            </p>
          </div>
        </section>

        {/* 8. DISCUSIÓN, CANVAS, FINANZAS Y ODS */}
        <section id="sec-discusion" className="scroll-mt-20 border-b border-slate-200 py-6">
          <h2 className="font-display text-xl font-bold text-slate-950">
            5. Discusión: Business Model Canvas, Evaluación Financiera y ODS
          </h2>

          <h3 className="mt-4 font-display text-sm font-bold text-slate-900">
            5.1 Business Model Canvas (9 Bloques)
          </h3>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {CANVAS_BLOCKS.map((c) => (
              <div key={c.block} className="border border-slate-200 bg-slate-50 p-3 text-xs">
                <div className="font-semibold text-slate-950">{c.block}</div>
                <p className="mt-1 leading-relaxed text-slate-700">{c.detail}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-5 font-display text-sm font-bold text-slate-900">5.2 Cadena de Valor de ALMA</h3>
          <div className="mt-2 overflow-x-auto border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2 font-semibold">Eslabón</th>
                  <th className="px-3 py-2 font-semibold">Operación y respaldo en ALMA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {VALUE_CHAIN.map((v) => (
                  <tr key={v.stage}>
                    <td className="px-3 py-2 font-semibold text-slate-900">{v.stage}</td>
                    <td className="px-3 py-2 text-slate-700">{v.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* BOM e Inversión Inicial */}
          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900">
                5.3 Costo Directo Unitario (BOM = S/ 420,00)
              </h3>
              <div className="mt-2 overflow-x-auto border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Componente</th>
                      <th className="px-3 py-2 text-right font-semibold">Costo (S/)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 tabular-nums">
                    {BOM_UNIT_COSTS.map((item) => (
                      <tr key={item.item}>
                        <td className="px-3 py-2 text-slate-700">{item.item}</td>
                        <td className="px-3 py-2 text-right font-medium text-slate-900">
                          {item.costSoles.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold text-slate-950">
                      <td className="px-3 py-2">TOTAL BOM POR UNIDAD (~US$ 112)</td>
                      <td className="px-3 py-2 text-right">420,00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="font-display text-sm font-bold text-slate-900">
                5.4 Inversión Inicial del Emprendimiento (S/ 24 000)
              </h3>
              <div className="mt-2 overflow-x-auto border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Rubro de inversión (Año 0)</th>
                      <th className="px-3 py-2 text-right font-semibold">Monto (S/)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 tabular-nums">
                    {INITIAL_INVESTMENT_BREAKDOWN.map((item) => (
                      <tr key={item.concept}>
                        <td className="px-3 py-2 text-slate-700">{item.concept}</td>
                        <td className="px-3 py-2 text-right font-medium text-slate-900">
                          {item.amount.toLocaleString('es-PE')}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold text-slate-950">
                      <td className="px-3 py-2">TOTAL INVERSIÓN INICIAL</td>
                      <td className="px-3 py-2 text-right">24 000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Flujo de caja 0–5 */}
          <h3 className="mt-6 font-display text-sm font-bold text-slate-900">
            5.5 Flujo de Caja Proyectado a 5 Años (COK = 12 % Anual)
          </h3>
          <div className="mt-2 overflow-x-auto border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2 font-semibold">Periodo</th>
                  <th className="px-3 py-2 text-right font-semibold">Ingresos (S/)</th>
                  <th className="px-3 py-2 text-right font-semibold">Egresos (S/)</th>
                  <th className="px-3 py-2 text-right font-semibold">Flujo Neto (S/)</th>
                  <th className="px-3 py-2 text-right font-semibold">Factor (12 %)</th>
                  <th className="px-3 py-2 text-right font-semibold">Flujo Desc. (S/)</th>
                  <th className="px-3 py-2 text-right font-semibold">Acum. Desc. (S/)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 tabular-nums">
                {FINANCIAL_CASH_FLOW.map((row) => (
                  <tr key={row.year}>
                    <td className="px-3 py-2 font-semibold text-slate-900">{row.year}</td>
                    <td className="px-3 py-2 text-right text-slate-700">{row.ingresos.toLocaleString('es-PE')}</td>
                    <td className="px-3 py-2 text-right text-slate-700">{row.egresos.toLocaleString('es-PE')}</td>
                    <td className="px-3 py-2 text-right font-semibold text-slate-900">
                      {row.flujoNeto.toLocaleString('es-PE')}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-slate-600">{row.factorDescuento.toFixed(4)}</td>
                    <td className="px-3 py-2 text-right text-slate-800">
                      {row.flujoDescontado.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-blue-900">
                      {row.acumuladoDescontado.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sensibilidad */}
          <h3 className="mt-5 font-display text-sm font-bold text-slate-900">
            5.6 Indicadores Financieros y Análisis de Sensibilidad
          </h3>
          <div className="mt-2 overflow-x-auto border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2 font-semibold">Escenario</th>
                  <th className="px-3 py-2 text-right font-semibold">VAN</th>
                  <th className="px-3 py-2 text-right font-semibold">TIR</th>
                  <th className="px-3 py-2 text-right font-semibold">B/C</th>
                  <th className="px-3 py-2 text-right font-semibold">PRI descontado</th>
                  <th className="px-3 py-2 font-semibold">Conclusión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 tabular-nums">
                {SENSITIVITY_SCENARIOS.map((sc) => (
                  <tr key={sc.scenario}>
                    <td className="px-3 py-2 font-semibold text-slate-900">{sc.scenario}</td>
                    <td className="px-3 py-2 text-right font-bold text-blue-900">{sc.van}</td>
                    <td className="px-3 py-2 text-right font-semibold text-slate-900">{sc.tir}</td>
                    <td className="px-3 py-2 text-right text-slate-800">{sc.bc}</td>
                    <td className="px-3 py-2 text-right text-slate-800">{sc.pri}</td>
                    <td className="px-3 py-2 text-slate-700">{sc.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ODS */}
          <h3 className="mt-5 font-display text-sm font-bold text-slate-900">
            5.7 Impacto Social y Alineamiento ODS (3, 9 y 10)
          </h3>
          <div className="mt-2 overflow-x-auto border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2 font-semibold">ODS</th>
                  <th className="px-3 py-2 font-semibold">Meta</th>
                  <th className="px-3 py-2 font-semibold">Aporte medible de ALMA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {ODS_ALIGNMENT.map((o) => (
                  <tr key={o.ods}>
                    <td className="px-3 py-2 font-semibold text-slate-900">{o.ods}</td>
                    <td className="px-3 py-2 text-slate-700">{o.meta}</td>
                    <td className="px-3 py-2 text-slate-700">{o.contribution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 9. CONCLUSIONES Y CRÉDIT */}
        <section id="sec-conclusiones" className="scroll-mt-20 border-b border-slate-200 py-6">
          <h2 className="font-display text-xl font-bold text-slate-950">6. Conclusiones y Declaración CRediT</h2>
          <div className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-800">
            <p>
              La revisión sistemática bajo PRISMA 2020 (31 estudios primarios incluidos con DOI verificado, 100 % publicados entre 2022 y 2026; guiados por 2 revisiones clave y complementados por 8 referentes clínicos y económicos) demuestra que combinar manufactura aditiva en PLA, microcontroladores ESP32, control adaptativo seguro y reconocimiento vocal en el borde supera tanto las limitaciones clínicas del sEMG ante espasticidad como el obstáculo económico de equipos importados superiores a US$ 1 500–2 427.
            </p>
            <p>
              El modelo de negocio B2B2C de ALMA alcanza un VAN de S/ 9 589,89, TIR de 25,16 %, relación B/C de 1,40 y PRI descontado de 3,69 años con tasa de descuento del 12 %, conservando viabilidad aun bajo estrés severo de −20 % en flujos (VAN S/ 2 871,91; TIR 16,16 %). Como paso futuro inmediato se proyecta el ensayo piloto con 20 pacientes en Lima Norte para validar longitudinalmente ganancia motora en escala FMA-UE.
            </p>
          </div>

          <h3 className="mt-5 font-display text-sm font-bold text-slate-900">Contribución Grupal (Taxonomía CRediT)</h3>
          <div className="mt-2 overflow-x-auto border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2 font-semibold">Integrante</th>
                  <th className="px-3 py-2 font-semibold">Código</th>
                  <th className="px-3 py-2 font-semibold">Roles CRediT verificados</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {TEAM_MEMBERS.map((m) => (
                  <tr key={m.id}>
                    <td className="px-3 py-2 font-semibold text-slate-900">{m.fullName}</td>
                    <td className="px-3 py-2 font-mono text-slate-700">{m.code}</td>
                    <td className="px-3 py-2 text-slate-700">
                      {m.creditRoles.map((r) => `${r.rol} (${r.detalle})`).join(' · ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 9B. DECLARACIÓN JURADA DE USO DE IA PROMINENTE */}
        <section id="sec-declaracion-ia" className="scroll-mt-20 border-b border-slate-200 py-6">
          <div className="border border-slate-300 bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <div className="font-mono text-[11px] font-semibold uppercase tracking-wide text-blue-800">
                  Integridad Académica · Evidencias E15 – E17
                </div>
                <h2 className="font-display text-xl font-bold text-slate-950">
                  {AI_SWORN_DECLARATION.title}
                </h2>
              </div>
              <span className="font-mono text-xs text-slate-600">Similitud ≤ 15 % · IA ≤ 10 %</span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-800">{AI_SWORN_DECLARATION.swornText}</p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {TEAM_MEMBERS.map((m) => (
                <div key={m.id} className="border border-slate-200 bg-white p-3 text-xs">
                  <div className="mt-4 border-t border-dashed border-slate-400 pt-2 font-semibold text-slate-900">
                    {m.fullName}
                  </div>
                  <div className="font-mono text-[11px] text-slate-600">{m.code} · Coautor(a) declarante</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. REFERENCIAS APA 7 */}
        <section id="sec-referencias" className="scroll-mt-20 border-b border-slate-200 py-6">
          <h2 className="font-display text-xl font-bold text-slate-950">
            Referencias Bibliográficas (APA 7.ª Edición · {REFERENCES_DATA.length} Fuentes Verificadas)
          </h2>
          <ol className="mt-4 space-y-2 text-xs leading-relaxed text-slate-800">
            {REFERENCES_DATA.map((ref) => (
              <li key={ref.id} className="pl-7 -indent-7">
                <span className="font-mono font-semibold text-slate-900">[{ref.id}] </span>
                {ref.apa7.replace(ref.url, '')}
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-blue-800 underline"
                >
                  {ref.url}
                </a>
              </li>
            ))}
          </ol>
        </section>

        {/* 11. ANEXOS A–F */}
        <section id="sec-anexos" className="scroll-mt-20 pt-6">
          <h2 className="font-display text-xl font-bold text-slate-950">Anexos del Informe T3</h2>

          <h3 className="mt-4 font-display text-sm font-bold text-slate-900">
            Anexo A. Registro Detallado de Uso Responsable de Inteligencia Artificial (E15 – E16)
          </h3>
          <div className="mt-2 overflow-x-auto border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2 font-semibold">Herramienta</th>
                  <th className="px-3 py-2 font-semibold">Sección</th>
                  <th className="px-3 py-2 font-semibold">Propósito (Búsqueda y ortografía)</th>
                  <th className="px-3 py-2 font-semibold">Verificación humana</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {AI_DECLARATION_TABLE.map((a) => (
                  <tr key={a.herramienta}>
                    <td className="px-3 py-2 font-semibold text-slate-900">{a.herramienta}</td>
                    <td className="px-3 py-2 text-slate-700">{a.parte}</td>
                    <td className="px-3 py-2 text-slate-700">{a.proposito}</td>
                    <td className="px-3 py-2 text-slate-700">{a.verificacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-5 font-display text-sm font-bold text-slate-900">
            Anexo B. Reporte de Integridad Turnitin (E17)
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-700">
            Umbrales máximos exigidos: <strong>Similitud ≤ 15 %</strong> e <strong>IA ≤ 10 %</strong>. El coordinador genera un único reporte oficial para evitar auto-coincidencias entre los 4 entregables del mismo artículo grupal.
          </p>

          <h3 className="mt-5 font-display text-sm font-bold text-slate-900">
            Anexo C. Matriz Maestra de Evidencias Auditables (E00–E21)
          </h3>
          <div className="mt-2 overflow-x-auto border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2 font-semibold">Código</th>
                  <th className="px-3 py-2 font-semibold">Evidencia</th>
                  <th className="px-3 py-2 font-semibold">Sección</th>
                  <th className="px-3 py-2 font-semibold">Ruta estandarizada Drive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {EVIDENCE_MASTER_TABLE.map((e) => (
                  <tr key={e.code}>
                    <td className="px-3 py-2 font-mono font-semibold text-blue-800">{e.code}</td>
                    <td className="px-3 py-2 text-slate-800">{e.name}</td>
                    <td className="px-3 py-2 text-slate-600">{e.section}</td>
                    <td className="px-3 py-2 font-mono text-slate-700">{e.file}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ANEXO D INDIVIDUAL DINÁMICO */}
          <div className="mt-6 border border-blue-200 bg-blue-50/40 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-200 pb-3">
              <div>
                <div className="font-mono text-xs font-semibold uppercase text-blue-800">
                  Anexo D · Entrega Individual Personalizada
                </div>
                <h3 className="font-display text-base font-bold text-slate-950">
                  {activeMember.fullName} ({activeMember.code})
                </h3>
              </div>
              <span className="font-mono text-xs text-slate-700">{activeMember.fileTag}</span>
            </div>

            <div className="mt-3 space-y-3 text-xs text-slate-800">
              <div>
                <strong>Secciones redactadas: </strong>
                {activeMember.sectionsAuthored.join(' · ')}
              </div>
              <div>
                <strong>Registro personal de cribado doble: </strong>
                {activeMember.screeningBatch.lote} — {activeMember.screeningBatch.revisados} registros evaluados en paralelo con{' '}
                {activeMember.screeningBatch.companeroPar}; {activeMember.screeningBatch.excluidosTituloResumen} excluidos en título/resumen;{' '}
                {activeMember.screeningBatch.conflictosResueltos} conflictos resueltos por consenso.
              </div>

              <div className="overflow-x-auto border border-slate-200 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Rol CRediT</th>
                      <th className="px-3 py-2 font-semibold">Aporte individual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activeMember.creditRoles.map((r) => (
                      <tr key={r.rol}>
                        <td className="px-3 py-2 font-semibold text-slate-900">{r.rol}</td>
                        <td className="px-3 py-2 text-slate-700">{r.detalle}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white p-4">
                <h4 className="font-display font-bold text-slate-900">
                  Reflexión Individual · Competencia Inteligencia Social (IS)
                </h4>
                <p className="mt-1.5 leading-relaxed text-slate-700">{activeMember.reflexionIS}</p>
              </div>

              <div className="bg-white p-4">
                <h4 className="font-display font-bold text-slate-900">
                  Reflexión Individual · Competencia Mentalidad Sistémico Digital (MSD)
                </h4>
                <p className="mt-1.5 leading-relaxed text-slate-700">{activeMember.reflexionMSD}</p>
              </div>

              <div>
                <strong>Enlace al Pitch individual de 3 minutos (E19–E20): </strong>
                <a
                  href={activeMember.drivePitchPlaceholder}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-blue-800 underline"
                >
                  {activeMember.drivePitchFile} → {activeMember.drivePitchPlaceholder}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
            <div className="border border-slate-200 p-4">
              <h3 className="font-display font-bold text-slate-900">Anexo E. Coevaluación del Grupo (E21)</h3>
              <p className="mt-1.5 leading-relaxed text-slate-700">
                Cada integrante evalúa confidencialmente la puntualidad, rigor en cribado y colaboración técnica de sus tres compañeros para calcular el factor individual (1,00 / 0,90 / 0,80).
              </p>
            </div>
            <div className="border border-slate-200 p-4">
              <h3 className="font-display font-bold text-slate-900">Anexo F. Ficha de Verificación Previa</h3>
              <p className="mt-1.5 leading-relaxed text-slate-700">
                Verificado: cuerpo grupal idéntico en los 4 archivos, 41 DOIs activos (31 estudios primarios P01–P31 + 2 guías + 8 referentes), flujo PRISMA 820→31 sin inconsistencias, VAN/TIR/B-C exactos, Declaración Jurada de IA firmada y evidencias E00–E21 completas.
              </p>
            </div>
          </div>
        </section>
      </article>
    </section>
  );
}
