import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Maximize2,
  Minimize2,
  Mic,
} from 'lucide-react';
import { ROLE_PRESENTATIONS, SLIDE_KIND_LABELS } from '../data/presentationsData';
import type { TeamMember } from '../data/teamMembers';

interface PresentacionViewProps {
  activeMemberId: TeamMember['id'];
  onSelectMember: (id: TeamMember['id']) => void;
  onExportPpt: () => Promise<void>;
  exportingPpt: boolean;
}

export function PresentacionView({
  activeMemberId,
  onSelectMember,
  onExportPpt,
  exportingPpt,
}: PresentacionViewProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [captureMode, setCaptureMode] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const deck = useMemo(
    () => ROLE_PRESENTATIONS.find((d) => d.memberId === activeMemberId) ?? ROLE_PRESENTATIONS[0],
    [activeMemberId],
  );

  const slide = deck.slides[slideIndex] ?? deck.slides[0];

  useEffect(() => {
    setSlideIndex(0);
    setCopiedScript(false);
  }, [activeMemberId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') {
        setSlideIndex((i) => Math.min(deck.slides.length - 1, i + 1));
      } else if (e.key === 'ArrowLeft') {
        setSlideIndex((i) => Math.max(0, i - 1));
      } else if (e.key === 'Escape' && captureMode) {
        setCaptureMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deck.slides.length, captureMode]);

  const wordCount = useMemo(
    () => slide.speechScript.trim().split(/\s+/).filter(Boolean).length,
    [slide.speechScript],
  );

  const totalDeckWords = useMemo(
    () => deck.slides.reduce((sum, s) => sum + s.speechScript.trim().split(/\s+/).filter(Boolean).length, 0),
    [deck.slides],
  );

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(slide.speechScript);
      setCopiedScript(true);
      window.setTimeout(() => setCopiedScript(false), 1800);
    } catch {
      setCopiedScript(false);
    }
  };

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6">
      {/* Selector de integrante y modo captura */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border border-slate-200 bg-white px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium text-slate-500">Expositor (Pitch 3 min):</span>
          {ROLE_PRESENTATIONS.map((roleDeck) => {
            const active = roleDeck.memberId === activeMemberId;
            return (
              <button
                key={roleDeck.memberId}
                type="button"
                onClick={() => onSelectMember(roleDeck.memberId)}
                className={`whitespace-nowrap shrink-0 border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {roleDeck.memberName.split(' ').slice(0, 2).join(' ')} · {roleDeck.memberCode}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs text-slate-500 tabular-nums">
            Guion completo: {totalDeckWords} palabras (~3 min)
          </span>
          <button
            type="button"
            onClick={() => setCaptureMode((v) => !v)}
            className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {captureMode ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            {captureMode ? 'Mostrar guion lateral' : 'Modo captura PPT'}
          </button>
          <button
            type="button"
            onClick={() => void onExportPpt()}
            disabled={exportingPpt}
            className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 border border-blue-700 bg-blue-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            {exportingPpt ? 'Generando .pptx...' : 'Exportar PPT (.pptx)'}
          </button>
        </div>
      </div>

      {/* Área principal dividida: Lienzo 16:9 a la izquierda + Guion de Oratoria a la derecha */}
      <div className={`grid grid-cols-1 gap-5 ${captureMode ? '' : 'lg:grid-cols-12 items-stretch'}`}>
        {/* Lienzo 16:9 listo para captura a PPT */}
        <div className={captureMode ? 'mx-auto w-full max-w-[1160px]' : 'lg:col-span-8 flex flex-col'}>
          <div className="relative aspect-video w-full overflow-hidden border border-slate-300 bg-white text-slate-900 shadow-sm">
            {/* Barra superior editorial de la diapositiva */}
            <div className="flex h-full flex-col justify-between p-6 sm:p-8 md:p-10">
              <div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  <span>
                    Diapositiva {slide.number} / {deck.slides.length} · {SLIDE_KIND_LABELS[slide.kind]}
                  </span>
                  <span className="font-mono text-slate-600 tabular-nums">
                    {slide.timeRange} · {deck.memberName}
                  </span>
                </div>

                {/* Título y subtítulo */}
                <div className="mt-5">
                  <h2
                    className={`font-display font-bold tracking-tight text-slate-950 ${
                      slide.kind === 'cover'
                        ? 'text-xl sm:text-2xl md:text-[28px] leading-tight'
                        : 'text-lg sm:text-xl md:text-2xl leading-snug'
                    }`}
                  >
                    {slide.title}
                  </h2>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-600">{slide.subtitle}</p>
                </div>

                {/* Franja KPI numérica limpia */}
                {slide.kpis && slide.kpis.length > 0 && (
                  <div
                    className={`mt-5 grid gap-3 ${
                      slide.kpis.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                    }`}
                  >
                    {slide.kpis.map((kpi) => (
                      <div key={kpi.label} className="bg-slate-50 px-3.5 py-3">
                        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                          {kpi.label}
                        </div>
                        <div className="mt-1 font-display text-lg sm:text-xl md:text-2xl font-bold text-blue-800 tabular-nums">
                          {kpi.value}
                        </div>
                        {kpi.note && <div className="mt-0.5 text-[11px] text-slate-600">{kpi.note}</div>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Puntos clave visuales */}
                <ul className="mt-5 space-y-2">
                  {slide.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-slate-800">
                      <span className="mt-1 font-mono text-xs font-semibold text-blue-700 tabular-nums">
                        0{idx + 1}
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {slide.highlightNote && (
                  <p className="mt-4 bg-blue-50 px-3.5 py-2 text-xs font-medium text-blue-950">
                    {slide.highlightNote}
                  </p>
                )}

                {slide.referenceTags && slide.referenceTags.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 pt-2.5 text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-700">Fuentes citadas:</span>
                    {slide.referenceTags.map((tag) => (
                      <span key={tag} className="font-mono text-slate-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Pie fijo de la diapositiva */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-2.5 text-[11px] text-slate-500">
                <span>ALMA · Exoesqueleto Mecatrónico UPN (Grupo G02) · Revisión Sistemática PRISMA 2020</span>
                <span className="font-mono">{deck.memberCode} · Examen por Competencias T3</span>
              </div>
            </div>
          </div>

          {/* Controles de navegación debajo de la lámina */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-white px-4 py-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSlideIndex((i) => Math.max(0, i - 1))}
                disabled={slideIndex === 0}
                className="inline-flex items-center gap-1 whitespace-nowrap shrink-0 border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Anterior
              </button>
              <button
                type="button"
                onClick={() => setSlideIndex((i) => Math.min(deck.slides.length - 1, i + 1))}
                disabled={slideIndex === deck.slides.length - 1}
                className="inline-flex items-center gap-1 whitespace-nowrap shrink-0 border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                Siguiente
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {deck.slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSlideIndex(idx)}
                  title={`${s.number}. ${s.blockLabel} (${s.timeRange})`}
                  className={`whitespace-nowrap shrink-0 border px-2.5 py-1 text-xs font-mono tabular-nums ${
                    idx === slideIndex
                      ? 'border-blue-700 bg-blue-700 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {s.number}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-slate-500">Flechas ← / → para cambiar</span>
          </div>
        </div>

        {/* Panel lateral derecho: Guion de Oratoria */}
        {!captureMode && (
          <aside className="lg:col-span-4 flex flex-col justify-between border border-slate-200 bg-white p-5">
            <div>
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-800">
                    <Mic className="h-3.5 w-3.5" />
                    Guion de Oratoria
                  </div>
                  <h3 className="mt-1 font-display text-base font-semibold text-slate-900">
                    Bloque {slide.number}: {slide.blockLabel}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="inline-flex items-center gap-1 whitespace-nowrap shrink-0 border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  {copiedScript ? <Check className="h-3.5 w-3.5 text-emerald-700" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedScript ? 'Copiado' : 'Copiar'}
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 tabular-nums">
                <span className="inline-flex items-center gap-1 font-medium text-slate-800">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  {slide.timeRange}
                </span>
                <span>·</span>
                <span>{wordCount} palabras en esta lámina</span>
              </div>

              <div className="mt-4 bg-slate-50 p-4">
                <p className="text-sm leading-relaxed text-slate-800">{slide.speechScript}</p>
              </div>

              <div className="mt-4 border-t border-slate-200 pt-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Indicaciones de puesta en escena
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-700">{slide.deliveryCue}</p>
              </div>
            </div>

            <div className="mt-5 border-t border-slate-200 pt-3 text-xs text-slate-500">
              <div className="font-medium text-slate-700">{deck.roleTitle}</div>
              <div className="mt-0.5">
                Tip: activa <strong className="text-slate-700">Modo captura PPT</strong> para tomar capturas limpias en 16:9 sin distracciones.
              </div>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
