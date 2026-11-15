import { useMemo, useState } from 'react';
import { Check, Copy, ExternalLink, Search } from 'lucide-react';
import {
  DATA_MD_REFERENCES,
  GUIDE_REVIEWS,
  PREVIO_REFERENCES,
  PRISMA_INCLUDED_STUDIES,
  RECENT_PRISMA_COUNT,
  RECENT_STUDIES_COUNT,
  REFERENCES_DATA,
  SOURCE_ORIGIN_LEGEND,
  type ReferenceCluster,
} from '../data/references30';

type ScopeFilter = 'all' | 'data_md' | 'previo' | 'prisma';

const CLUSTER_OPTIONS: Array<'Todas' | ReferenceCluster> = [
  'Todas',
  'Exoesqueletos y Diseño 3D',
  'Control Adaptativo y Seguridad',
  'IA, Voz, NLP y Telerehabilitación',
  'Revisiones Guía (Plantilla)',
  'Marco Clínico, Metodológico y Económico',
];

export function ReferenciasView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<'Todas' | ReferenceCluster>('Todas');
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredRefs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return REFERENCES_DATA.filter((ref) => {
      if (scopeFilter === 'data_md' && ref.sourceOrigin !== 'data_md') return false;
      if (scopeFilter === 'previo' && ref.sourceOrigin !== 'previo') return false;
      if (scopeFilter === 'prisma' && !ref.prismaIncluded) return false;
      if (selectedCluster !== 'Todas' && ref.cluster !== selectedCluster) return false;
      if (!q) return true;
      return (
        ref.id.toLowerCase().includes(q) ||
        ref.title.toLowerCase().includes(q) ||
        ref.authors.toLowerCase().includes(q) ||
        ref.doi.toLowerCase().includes(q) ||
        ref.journal.toLowerCase().includes(q) ||
        ref.summaryEs.toLowerCase().includes(q) ||
        ref.country.toLowerCase().includes(q) ||
        String(ref.year).includes(q)
      );
    });
  }, [searchTerm, selectedCluster, scopeFilter]);

  const handleCopyApa = async (id: string, apa7: string) => {
    try {
      await navigator.clipboard.writeText(apa7);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((curr) => (curr === id ? null : curr)), 1600);
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      {/* Encabezado y resumen bibliométrico */}
      <div className="mb-5 border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-bold text-slate-900">
              Explorador Bibliográfico Verificado (★ data.md + ↺ Informe Previo)
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">
              Base completa de {REFERENCES_DATA.length} fuentes académicas con DOI verificado: prioridad 1 asignada a las {DATA_MD_REFERENCES.length} fuentes de <code className="bg-slate-100 px-1 font-mono text-xs">data.md / ref / example</code> ({GUIDE_REVIEWS.length} revisiones guía + {PRISMA_INCLUDED_STUDIES.length} estudios primarios PRISMA), complementadas por {PREVIO_REFERENCES.length} referentes clínicos, metodológicos y económicos prevalecientes del informe anterior.
            </p>
          </div>
        </div>

        {/* Leyenda de simbología de origen */}
        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-200 pt-4 md:grid-cols-2">
          <div className="bg-amber-50/70 px-3.5 py-2.5 text-xs text-slate-700">
            <span className="font-semibold text-amber-800">
              {SOURCE_ORIGIN_LEGEND.data_md.symbol} {SOURCE_ORIGIN_LEGEND.data_md.label} ({DATA_MD_REFERENCES.length}):
            </span>{' '}
            {SOURCE_ORIGIN_LEGEND.data_md.description}
          </div>
          <div className="bg-slate-100 px-3.5 py-2.5 text-xs text-slate-700">
            <span className="font-semibold text-slate-800">
              {SOURCE_ORIGIN_LEGEND.previo.symbol} {SOURCE_ORIGIN_LEGEND.previo.label} ({PREVIO_REFERENCES.length}):
            </span>{' '}
            {SOURCE_ORIGIN_LEGEND.previo.description}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-200 pt-4 sm:grid-cols-4 tabular-nums">
          <div>
            <div className="text-xs text-slate-500">Total verificadas</div>
            <div className="font-display text-xl font-bold text-slate-900">{REFERENCES_DATA.length} DOIs</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Prioridad 1 (★ data.md)</div>
            <div className="font-display text-xl font-bold text-amber-700">
              {DATA_MD_REFERENCES.length} fuentes ({GUIDE_REVIEWS.length} guía + {PRISMA_INCLUDED_STUDIES.length} PRISMA)
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Prioridad 2 (↺ previo)</div>
            <div className="font-display text-xl font-bold text-slate-800">
              {PREVIO_REFERENCES.length} referentes
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">PRISMA 2022–2026</div>
            <div className="font-display text-xl font-bold text-blue-800">
              {RECENT_PRISMA_COUNT}/{PRISMA_INCLUDED_STUDIES.length} (100,0 %) · {RECENT_STUDIES_COUNT}/{REFERENCES_DATA.length} total
            </div>
          </div>
        </div>
      </div>

      {/* Buscador y filtros por origen / clúster */}
      <div className="mb-5 border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative min-w-[260px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código (P01, G01, R27), autor, país, revista, DOI o resumen..."
              className="w-full border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all', label: `Todas (${REFERENCES_DATA.length})` },
                { id: 'data_md', label: `★ De data.md (${DATA_MD_REFERENCES.length})` },
                { id: 'prisma', label: `Matriz PRISMA (${PRISMA_INCLUDED_STUDIES.length})` },
                { id: 'previo', label: `↺ Informe previo (${PREVIO_REFERENCES.length})` },
              ] as const
            ).map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setScopeFilter(btn.id)}
                className={`whitespace-nowrap shrink-0 border px-3 py-2 text-xs font-medium ${
                  scopeFilter === btn.id
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-200 pt-3">
          {CLUSTER_OPTIONS.map((cluster) => {
            const active = selectedCluster === cluster;
            return (
              <button
                key={cluster}
                type="button"
                onClick={() => setSelectedCluster(cluster)}
                className={`whitespace-nowrap shrink-0 border px-2.5 py-1 text-xs font-medium ${
                  active
                    ? 'border-blue-700 bg-blue-700 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cluster}
              </button>
            );
          })}
        </div>
      </div>

      {/* Listado de artículos */}
      <div className="mb-3 text-xs text-slate-600 tabular-nums">
        Mostrando {filteredRefs.length} de {REFERENCES_DATA.length} fuentes bibliográficas
      </div>

      <div className="divide-y divide-slate-200 border border-slate-200 bg-white">
        {filteredRefs.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-slate-500">
            No se encontraron referencias que coincidan con el filtro aplicado.
          </div>
        ) : (
          filteredRefs.map((ref) => (
            <article key={ref.id} className="p-5">
              {/* Metadatos tipográficos sin pills */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span
                    className={`font-semibold ${
                      ref.sourceOrigin === 'data_md' ? 'text-amber-700' : 'text-slate-700'
                    }`}
                    title={ref.sourceLabel}
                  >
                    {ref.sourceSymbol} {ref.sourceLabel}
                  </span>
                  <span>·</span>
                  <span className="font-mono font-semibold text-slate-900">{ref.id}</span>
                  <span>·</span>
                  <span className="font-semibold text-slate-800 tabular-nums">{ref.year}</span>
                  <span>·</span>
                  <span>{ref.country}</span>
                  <span>·</span>
                  <span className="text-blue-800">{ref.cluster}</span>
                  <span>·</span>
                  <span>{ref.prismaIncluded ? 'Incluida en matriz PRISMA (n=31)' : 'Guía / Respaldo contextual'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyApa(ref.id, ref.apa7)}
                    className="inline-flex items-center gap-1 whitespace-nowrap shrink-0 border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {copiedId === ref.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-700" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copiedId === ref.id ? 'APA copiada' : 'Copiar APA 7'}
                  </button>

                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 whitespace-nowrap shrink-0 border border-blue-700 bg-white px-2.5 py-1 text-xs font-medium text-blue-800 hover:bg-blue-50"
                  >
                    DOI: {ref.doi}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <h2 className="mt-2 font-display text-base font-semibold leading-snug text-slate-950">
                {ref.title}
              </h2>
              <p className="mt-0.5 text-xs font-medium text-slate-600">
                {ref.authors} — <span className="italic">{ref.journal}</span>
              </p>

              <p className="mt-2.5 text-sm leading-relaxed text-slate-700">{ref.summaryEs}</p>

              <div className="mt-3 grid grid-cols-1 gap-2 bg-slate-50 p-3 text-xs text-slate-700 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <span className="font-semibold text-slate-900">Arquitectura: </span>
                  {ref.prismaExtraction.architecture}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Control / IA: </span>
                  {ref.prismaExtraction.controlOrAi}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Desempeño: </span>
                  {ref.prismaExtraction.performanceMetric}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Costo / Impacto: </span>
                  {ref.prismaExtraction.costOrImpact}
                </div>
              </div>

              <p className="mt-2.5 font-mono text-[11px] leading-relaxed text-slate-500">
                {ref.sourceSymbol} APA 7: {ref.apa7}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
