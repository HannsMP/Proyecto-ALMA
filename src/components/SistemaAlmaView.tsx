import { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RefreshCw,
  UserPlus,
} from 'lucide-react';

interface HealthPayload {
  status: string;
  service: string;
  uptimeSeconds: number;
  alma: {
    pacientesTotal: number;
    sesionesTotal: number;
    alertasNoLeidas: number;
    persistencia: string;
  };
  backups: {
    totalFiles: number;
    totalBytes: number;
  };
}

interface PacienteItem {
  id: string;
  nombre: string;
  edad: number | null;
  diagnostico: string;
  objetivoRepeticiones: number;
  fechaRegistro: string;
  sesiones: string[];
}

interface AlertaItem {
  id: string;
  pacienteId: string;
  tipo: string;
  mensaje: string;
  timestamp: string;
  estado: string;
}

export function SistemaAlmaView() {
  const [iframeKey, setIframeKey] = useState(0);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [health, setHealth] = useState<HealthPayload | null>(null);
  const [pacientes, setPacientes] = useState<PacienteItem[]>([]);
  const [alertas, setAlertas] = useState<AlertaItem[]>([]);
  const [loadingApi, setLoadingApi] = useState(false);
  const [apiFeedback, setApiFeedback] = useState<string | null>(null);

  const loadBackendSnapshot = useCallback(async () => {
    setLoadingApi(true);
    try {
      const [hRes, pRes, aRes] = await Promise.all([
        fetch('/api/health'),
        fetch('/api/pacientes'),
        fetch('/api/alertas'),
      ]);
      if (hRes.ok) setHealth(await hRes.json());
      if (pRes.ok) setPacientes(await pRes.json());
      if (aRes.ok) setAlertas(await aRes.json());
    } catch {
      setApiFeedback('No se pudo consultar la API monolítica.');
    } finally {
      setLoadingApi(false);
    }
  }, []);

  useEffect(() => {
    void loadBackendSnapshot();
  }, [loadBackendSnapshot]);

  const handleSeedDemoPatient = async () => {
    setApiFeedback(null);
    try {
      const res = await fetch('/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: `Paciente Piloto ${pacientes.length + 1}`,
          edad: 58,
          diagnostico: 'Hemiparesia miembro superior post-ACV subagudo',
          objetivoRepeticiones: 12,
        }),
      });
      if (res.ok) {
        const created = (await res.json()) as PacienteItem;
        setApiFeedback(`Paciente "${created.nombre}" registrado en data/alma-store.json.`);
        await loadBackendSnapshot();
        setIframeKey((k) => k + 1);
      } else {
        setApiFeedback('Error al registrar paciente de prueba.');
      }
    } catch {
      setApiFeedback('Error de conexión con /api/pacientes.');
    }
  };

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border border-slate-200 bg-white px-4 py-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <h1 className="font-display text-base font-semibold text-slate-900">
              Sistema ALMA · Interfaz Web Embe­bida
            </h1>
            <span className="font-mono text-xs text-slate-500">/alma-app/</span>
          </div>
          <p className="mt-0.5 text-xs text-slate-600">
            Exoesqueleto robótico de miembro superior controlado por voz, lógica difusa ESP32 y sincronización offline-first con el servidor Express.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIframeKey((k) => k + 1)}
            className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Recargar vista
          </button>

          <a
            href="/alma-app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Abrir pantalla completa
          </a>

          <button
            type="button"
            onClick={() => {
              const next = !inspectorOpen;
              setInspectorOpen(next);
              if (next) void loadBackendSnapshot();
            }}
            className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 border border-slate-300 bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
          >
            <Activity className="h-3.5 w-3.5" />
            API Clínica ({health ? `${health.alma.pacientesTotal} pac. · ${health.alma.sesionesTotal} ses.` : '…'})
            {inspectorOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {inspectorOpen && (
        <div className="mb-4 border border-slate-200 bg-white p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="text-xs text-slate-600">
              Persistencia local en <span className="font-mono text-slate-900">data/alma-store.json</span>
              {health ? (
                <span>
                  {' '}
                  · {health.alma.pacientesTotal} pacientes · {health.alma.sesionesTotal} sesiones · {health.alma.alertasNoLeidas} alertas sin leer · {health.backups.totalFiles} archivos en proyecto
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSeedDemoPatient}
                className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 border border-blue-700 bg-blue-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-800"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Registrar paciente piloto
              </button>
              <button
                type="button"
                onClick={() => void loadBackendSnapshot()}
                disabled={loadingApi}
                className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingApi ? 'animate-spin' : ''}`} />
                Actualizar JSON
              </button>
            </div>
          </div>

          {apiFeedback && (
            <p className="mb-3 border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-900">
              {apiFeedback}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <h2 className="mb-2 font-display text-xs font-semibold uppercase tracking-wide text-slate-700">
                Pacientes sincronizados (/api/pacientes)
              </h2>
              {pacientes.length === 0 ? (
                <p className="border border-dashed border-slate-200 px-3 py-4 text-xs text-slate-500">
                  Aún no hay pacientes registrados en el servidor. Cree uno desde el perfil dentro de ALMA o usando el botón «Registrar paciente piloto».
                </p>
              ) : (
                <div className="overflow-x-auto border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-3 py-2 font-medium">Nombre</th>
                        <th className="px-3 py-2 font-medium">Diagnóstico</th>
                        <th className="px-3 py-2 text-right font-medium">Meta reps</th>
                        <th className="px-3 py-2 text-right font-medium">Sesiones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 tabular-nums">
                      {pacientes.map((p) => (
                        <tr key={p.id}>
                          <td className="px-3 py-2 font-medium text-slate-900">{p.nombre}</td>
                          <td className="px-3 py-2 text-slate-600">{p.diagnostico || 'Sin diagnóstico'}</td>
                          <td className="px-3 py-2 text-right text-slate-800">{p.objetivoRepeticiones}</td>
                          <td className="px-3 py-2 text-right text-slate-800">{p.sesiones.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div>
              <h2 className="mb-2 font-display text-xs font-semibold uppercase tracking-wide text-slate-700">
                Alertas clínicas recientes (/api/alertas)
              </h2>
              {alertas.length === 0 ? (
                <p className="border border-dashed border-slate-200 px-3 py-4 text-xs text-slate-500">
                  Sin alertas de dolor intenso (≥ 7/10) registradas hasta el momento.
                </p>
              ) : (
                <div className="divide-y divide-slate-200 border border-slate-200">
                  {alertas.slice(0, 5).map((a) => (
                    <div key={a.id} className="px-3 py-2 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-slate-900">{a.tipo}</span>
                        <span className="font-mono text-[11px] text-slate-500">{a.estado}</span>
                      </div>
                      <p className="mt-0.5 text-slate-600">{a.mensaje}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden border border-slate-300 bg-white">
        <iframe
          key={iframeKey}
          src="/alma-app/"
          title="Sistema ALMA - Exoesqueleto de Rehabilitación"
          allow="microphone; bluetooth"
          className="block h-[calc(100vh-175px)] min-h-[640px] w-full border-0 bg-white"
        />
      </div>
    </section>
  );
}
