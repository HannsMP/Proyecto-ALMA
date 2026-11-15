import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { registerAlmaRoutes } from './src/server/almaRoutes.ts';
import { registerEntregablesRoutes } from './src/server/entregablesRoutes.ts';

const PORT = Number(process.env.PORT) || 3000;
const SKIPPED_DIRS = new Set(['node_modules', '.git', '.ipynb_checkpoints', '.gradle', 'build', 'dist']);
const PROJECT_DIRS = ['mecanica', 'electronica', 'documentacion', 'programacion', 'android'];

function getProjectStats(): { totalFiles: number; totalBytes: number } {
  let totalFiles = 0;
  let totalBytes = 0;

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (SKIPPED_DIRS.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        totalFiles++;
        totalBytes += fs.statSync(fullPath).size;
      }
    }
  }

  for (const folder of PROJECT_DIRS) {
    walk(path.resolve(process.cwd(), folder));
  }
  return { totalFiles, totalBytes };
}

async function startServer() {
  const app = express();
  app.set('trust proxy', true);

  // Deshabilitar restricciones CORS para túneles Cloudflare (alma/alama.dark-cry.com), apps móviles y pruebas externas
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
    res.setHeader(
      'Access-Control-Allow-Headers',
      req.headers['access-control-request-headers'] || 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );
    res.setHeader('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  app.use(express.json({ limit: '10mb' }));

  // Registrar el servidor backend robusto de ALMA (Pacientes, Sesiones, Repeticiones, Dolor, Alertas, Health)
  registerAlmaRoutes(app, getProjectStats);
  // Registrar rutas de entregables locales (manifiesto y paquete ZIP de 33 PDFs E07)
  registerEntregablesRoutes(app);

  // Servir la app web de ALMA desde el directorio raíz del proyecto (o respaldo en backups/)
  const rootAlmaDir = path.resolve(process.cwd(), 'programacion/nodejs_alma_web/frontend_alma/www');
  const backupAlmaDir = path.resolve(process.cwd(), 'backups/programacion/nodejs_alma_web/frontend_alma/www');
  const almaWebDir = fs.existsSync(rootAlmaDir) ? rootAlmaDir : backupAlmaDir;

  if (fs.existsSync(almaWebDir)) {
    app.use('/alma-app', express.static(almaWebDir));
  }

  // Servir diagramas e imágenes técnicas reales del proyecto ALMA
  const diagramsDir = path.resolve(process.cwd(), 'electronica/diagramas_sistema');
  if (fs.existsSync(diagramsDir)) {
    app.use('/alma-assets/diagramas', express.static(diagramsDir));
  }
  const docsArtDir = path.resolve(process.cwd(), 'documentacion/articulos_y_propuestas');
  if (fs.existsSync(docsArtDir)) {
    app.use('/alma-assets/docs', express.static(docsArtDir));
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        cors: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor monolítico ALMA + T3 activo en http://localhost:${PORT}`);
  });
}

startServer();
