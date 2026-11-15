import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { Express, Request, Response } from 'express';

export interface Repeticion {
  id: string;
  numero: number;
  timestamp: string;
  angle: number;
  velocidad: number;
  duracion: number;
  esfuerzo: string;
}

export interface DolorEvento {
  id: string;
  timestamp: string;
  intensidad: number;
  ubicacion: string;
  repeticionActual: number | null;
  anguloEnMomento: number | null;
}

export interface Sesion {
  id: string;
  pacienteId: string;
  fecha: string;
  horaInicio: number;
  horaFin: number | null;
  duracion: number;
  repeticiones: number;
  objetivoReps: number;
  velocidadPromed: number;
  repeticionesArray: Repeticion[];
  dolorEventos: DolorEvento[];
  estado: 'activa' | 'completada';
  feedback: string[];
  notas: string;
}

export interface Paciente {
  id: string;
  nombre: string;
  edad: number | null;
  diagnostico: string;
  objetivoRepeticiones: number;
  fechaRegistro: string;
  sesiones: string[];
}

export interface Alerta {
  id: string;
  pacienteId: string;
  tipo: string;
  mensaje: string;
  timestamp: string;
  estado: 'no_leida' | 'leida';
}

interface AlmaStore {
  pacientes: Record<string, Paciente>;
  sesiones: Record<string, Sesion>;
  alertas: Alerta[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'alma-store.json');

function loadStore(): AlmaStore {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<AlmaStore>;
      return {
        pacientes: parsed.pacientes ?? {},
        sesiones: parsed.sesiones ?? {},
        alertas: Array.isArray(parsed.alertas) ? parsed.alertas : [],
      };
    }
  } catch {
    // Fallback to clean empty store if corrupted
  }
  return { pacientes: {}, sesiones: {}, alertas: [] };
}

function persistStore(store: AlmaStore) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmpFile = `${STORE_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(store, null, 2), 'utf-8');
  fs.renameSync(tmpFile, STORE_FILE);
}

export function registerAlmaRoutes(
  app: Express,
  getBackupsStats: () => { totalFiles: number; totalBytes: number },
) {
  const store = loadStore();

  // ===== PACIENTES =====
  app.get('/api/pacientes', (_req: Request, res: Response) => {
    const list = Object.values(store.pacientes).sort((a, b) =>
      b.fechaRegistro.localeCompare(a.fechaRegistro),
    );
    res.json(list);
  });

  app.get('/api/pacientes/:id', (req: Request, res: Response) => {
    const paciente = store.pacientes[String(req.params.id)];
    if (!paciente) {
      res.status(404).json({ error: 'Paciente no encontrado' });
      return;
    }
    res.json(paciente);
  });

  app.post('/api/pacientes', (req: Request, res: Response) => {
    const { id, nombre, edad, diagnostico, objetivoRepeticiones } = req.body ?? {};
    const cleanName = typeof nombre === 'string' ? nombre.trim() : '';
    if (!cleanName) {
      res.status(400).json({ error: 'El campo nombre es obligatorio.' });
      return;
    }

    const patientId =
      typeof id === 'string' && id.trim().length > 0
        ? id.trim()
        : `pac_${crypto.randomUUID().slice(0, 8)}`;

    if (store.pacientes[patientId]) {
      res.status(409).json({ error: `Ya existe un paciente con id "${patientId}".` });
      return;
    }

    const parsedAge = Number.isFinite(Number(edad)) && Number(edad) > 0 ? Number(edad) : null;
    const parsedTarget =
      Number.isFinite(Number(objetivoRepeticiones)) && Number(objetivoRepeticiones) > 0
        ? Number(objetivoRepeticiones)
        : 10;

    const paciente: Paciente = {
      id: patientId,
      nombre: cleanName,
      edad: parsedAge,
      diagnostico: typeof diagnostico === 'string' ? diagnostico.trim() : '',
      objetivoRepeticiones: parsedTarget,
      fechaRegistro: new Date().toISOString(),
      sesiones: [],
    };

    store.pacientes[patientId] = paciente;
    persistStore(store);
    res.status(201).json(paciente);
  });

  // ===== SESIONES =====
  app.get('/api/sesiones', (req: Request, res: Response) => {
    const pacienteId = req.query.pacienteId ? String(req.query.pacienteId) : null;
    let list = Object.values(store.sesiones);
    if (pacienteId) {
      list = list.filter((s) => s.pacienteId === pacienteId);
    }
    list.sort((a, b) => b.horaInicio - a.horaInicio);
    res.json(list);
  });

  app.post('/api/sesiones', (req: Request, res: Response) => {
    const { pacienteId, fecha, objetivoReps, velocidad } = req.body ?? {};
    if (!pacienteId || typeof pacienteId !== 'string') {
      res.status(400).json({ error: 'Se requiere pacienteId válido.' });
      return;
    }
    if (!store.pacientes[pacienteId]) {
      res.status(404).json({ error: 'Paciente no encontrado para iniciar sesión.' });
      return;
    }

    const sesionId = `sesion_${Date.now()}_${crypto.randomUUID().slice(0, 4)}`;
    const sesion: Sesion = {
      id: sesionId,
      pacienteId,
      fecha: typeof fecha === 'string' && fecha ? fecha : new Date().toISOString(),
      horaInicio: Date.now(),
      horaFin: null,
      duracion: 0,
      repeticiones: 0,
      objetivoReps:
        Number.isFinite(Number(objetivoReps)) && Number(objetivoReps) > 0
          ? Number(objetivoReps)
          : store.pacientes[pacienteId].objetivoRepeticiones || 10,
      velocidadPromed:
        Number.isFinite(Number(velocidad)) && Number(velocidad) >= 1 && Number(velocidad) <= 10
          ? Number(velocidad)
          : 5,
      repeticionesArray: [],
      dolorEventos: [],
      estado: 'activa',
      feedback: [],
      notas: '',
    };

    store.sesiones[sesionId] = sesion;
    store.pacientes[pacienteId].sesiones.push(sesionId);
    persistStore(store);
    res.status(201).json(sesion);
  });

  app.get('/api/sesiones/:id', (req: Request, res: Response) => {
    const sesion = store.sesiones[String(req.params.id)];
    if (!sesion) {
      res.status(404).json({ error: 'Sesión no encontrada' });
      return;
    }
    res.json(sesion);
  });

  app.put('/api/sesiones/:id/finalizar', (req: Request, res: Response) => {
    const sesion = store.sesiones[String(req.params.id)];
    if (!sesion) {
      res.status(404).json({ error: 'Sesión no encontrada' });
      return;
    }

    sesion.horaFin = Date.now();
    sesion.duracion = Math.max(0, Math.round((sesion.horaFin - sesion.horaInicio) / 60000));
    sesion.estado = 'completada';
    sesion.feedback = Array.isArray(req.body?.feedback) ? req.body.feedback.map(String) : [];
    sesion.notas = typeof req.body?.notas === 'string' ? req.body.notas : '';

    persistStore(store);
    res.json(sesion);
  });

  // ===== REPETICIONES =====
  app.post('/api/sesiones/:sesionId/repeticiones', (req: Request, res: Response) => {
    const sesion = store.sesiones[String(req.params.sesionId)];
    if (!sesion) {
      res.status(404).json({ error: 'Sesión no encontrada' });
      return;
    }

    const { numero, angle, velocidad, duracion, esfuerzo } = req.body ?? {};
    const repeticion: Repeticion = {
      id: `rep_${Date.now()}_${crypto.randomUUID().slice(0, 4)}`,
      numero: Number.isFinite(Number(numero)) ? Number(numero) : sesion.repeticionesArray.length + 1,
      timestamp: new Date().toISOString(),
      angle: Number.isFinite(Number(angle)) ? Number(angle) : 0,
      velocidad: Number.isFinite(Number(velocidad)) ? Number(velocidad) : sesion.velocidadPromed,
      duracion: Number.isFinite(Number(duracion)) ? Number(duracion) : 0,
      esfuerzo: typeof esfuerzo === 'string' && esfuerzo ? esfuerzo : 'normal',
    };

    sesion.repeticionesArray.push(repeticion);
    sesion.repeticiones = sesion.repeticionesArray.length;
    if (sesion.repeticionesArray.length > 0) {
      const avgSpeed =
        sesion.repeticionesArray.reduce((acc, r) => acc + r.velocidad, 0) /
        sesion.repeticionesArray.length;
      sesion.velocidadPromed = Number(avgSpeed.toFixed(1));
    }

    persistStore(store);
    res.status(201).json(repeticion);
  });

  // ===== EVENTOS DE DOLOR =====
  app.post('/api/sesiones/:sesionId/dolor', (req: Request, res: Response) => {
    const sesion = store.sesiones[String(req.params.sesionId)];
    if (!sesion) {
      res.status(404).json({ error: 'Sesión no encontrada' });
      return;
    }

    const { intensidad, ubicacion, repeticionActual, anguloEnMomento } = req.body ?? {};
    const rawIntensity = Number(intensidad);
    if (!Number.isFinite(rawIntensity)) {
      res.status(400).json({ error: 'La intensidad del dolor (0-10) es obligatoria.' });
      return;
    }
    const clampedIntensity = Math.min(10, Math.max(0, rawIntensity));

    const evento: DolorEvento = {
      id: `dolor_${Date.now()}_${crypto.randomUUID().slice(0, 4)}`,
      timestamp: new Date().toISOString(),
      intensidad: clampedIntensity,
      ubicacion: typeof ubicacion === 'string' && ubicacion.trim() ? ubicacion.trim() : 'brazo',
      repeticionActual: Number.isFinite(Number(repeticionActual)) ? Number(repeticionActual) : null,
      anguloEnMomento: Number.isFinite(Number(anguloEnMomento)) ? Number(anguloEnMomento) : null,
    };

    sesion.dolorEventos.push(evento);

    // Auto-generación de alerta terapéutica si dolor >= 7/10
    if (clampedIntensity >= 7) {
      store.alertas.push({
        id: `alert_${Date.now()}_${crypto.randomUUID().slice(0, 4)}`,
        pacienteId: sesion.pacienteId,
        tipo: 'riesgo_alto_dolor',
        mensaje: `Dolor intenso (${clampedIntensity}/10) reportado en ${evento.ubicacion} durante sesión ${sesion.id}.`,
        timestamp: new Date().toISOString(),
        estado: 'no_leida',
      });
    }

    persistStore(store);
    res.status(201).json(evento);
  });

  // ===== ESTADÍSTICAS Y EXPORTACIÓN =====
  app.get('/api/pacientes/:id/estadisticas', (req: Request, res: Response) => {
    const id = String(req.params.id);
    const paciente = store.pacientes[id];
    if (!paciente) {
      res.status(404).json({ error: 'Paciente no encontrado' });
      return;
    }

    const dias = Math.max(1, Number(req.query.dias) || 30);
    const cutoffMs = Date.now() - dias * 24 * 60 * 60 * 1000;

    const sesiones = paciente.sesiones
      .map((sid) => store.sesiones[sid])
      .filter((s): s is Sesion => Boolean(s && s.estado === 'completada' && s.horaInicio >= cutoffMs));

    const totalSesiones = sesiones.length;
    const totalRepeticiones = sesiones.reduce((sum, s) => sum + s.repeticiones, 0);
    const velocidadPromedio =
      totalSesiones > 0
        ? Number(
            (sesiones.reduce((sum, s) => sum + s.velocidadPromed, 0) / totalSesiones).toFixed(1),
          )
        : 0;

    const dolorEventos = sesiones.flatMap((s) => s.dolorEventos);
    const intensidadMaxDolor =
      dolorEventos.length > 0 ? Math.max(...dolorEventos.map((d) => d.intensidad)) : 0;

    res.json({
      pacienteId: id,
      ventanaDias: dias,
      totalSesiones,
      totalRepeticiones,
      promRepeticiones: totalSesiones > 0 ? Number((totalRepeticiones / totalSesiones).toFixed(1)) : 0,
      velocidadPromedio,
      dolorEventos: dolorEventos.length,
      intensidadMaxDolor,
      lastUpdated: new Date().toISOString(),
    });
  });

  app.get('/api/pacientes/:id/export', (req: Request, res: Response) => {
    const id = String(req.params.id);
    const paciente = store.pacientes[id];
    if (!paciente) {
      res.status(404).json({ error: 'Paciente no encontrado' });
      return;
    }

    const sesiones = paciente.sesiones
      .map((sid) => store.sesiones[sid])
      .filter((s): s is Sesion => Boolean(s));

    res.json({
      exportDate: new Date().toISOString(),
      paciente,
      sesiones,
      totalSesiones: sesiones.length,
    });
  });

  // ===== ALERTAS =====
  app.get('/api/alertas', (_req: Request, res: Response) => {
    res.json(store.alertas.slice().reverse());
  });

  app.get('/api/alertas/:pacienteId', (req: Request, res: Response) => {
    const pacienteId = String(req.params.pacienteId);
    res.json(store.alertas.filter((a) => a.pacienteId === pacienteId).reverse());
  });

  app.post('/api/alertas', (req: Request, res: Response) => {
    const { pacienteId, tipo, mensaje } = req.body ?? {};
    if (!pacienteId || !mensaje) {
      res.status(400).json({ error: 'Se requiere pacienteId y mensaje.' });
      return;
    }

    const alerta: Alerta = {
      id: `alert_${Date.now()}_${crypto.randomUUID().slice(0, 4)}`,
      pacienteId: String(pacienteId),
      tipo: typeof tipo === 'string' && tipo ? tipo : 'alerta_general',
      mensaje: String(mensaje),
      timestamp: new Date().toISOString(),
      estado: 'no_leida',
    };

    store.alertas.push(alerta);
    persistStore(store);
    res.status(201).json(alerta);
  });

  app.put('/api/alertas/:id/leer', (req: Request, res: Response) => {
    const alerta = store.alertas.find((a) => a.id === String(req.params.id));
    if (!alerta) {
      res.status(404).json({ error: 'Alerta no encontrada' });
      return;
    }
    alerta.estado = 'leida';
    persistStore(store);
    res.json(alerta);
  });

  // ===== SALUD MONOLÍTICA =====
  app.get('/api/health', (_req: Request, res: Response) => {
    const backupsStats = getBackupsStats();
    res.json({
      status: 'ok',
      service: 'monolito-alma-backups',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      alma: {
        pacientesTotal: Object.keys(store.pacientes).length,
        sesionesTotal: Object.keys(store.sesiones).length,
        alertasNoLeidas: store.alertas.filter((a) => a.estado === 'no_leida').length,
        persistencia: 'data/alma-store.json',
      },
      backups: backupsStats,
    });
  });
}
