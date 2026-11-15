# Proyecto ALMA · Sistema Clínico y Revisión Sistemática T3 (UPN)

Aplicación web monolítica ejecutada sobre `server.ts` (puerto `3000`) que unifica el servidor clínico del exoesqueleto robótico de miembro superior **ALMA** y la plataforma académica completa del **Examen por Competencias T3** (*Grupo G01 · Ingeniería Mecatrónica, Universidad Privada del Norte*).

---

## 1. Estructura del Proyecto Monolítico en Disco

Los directorios principales del proyecto mecatrónico residen directamente en la raíz del espacio de trabajo:

- `/mecanica/` — Planos CAD 3D en Autodesk Inventor (`.iam`, 26 piezas `.ipt`) y archivos de ensamblaje del exoesqueleto de codo (`0°–90°`).
- `/electronica/` — Inventario de hardware (`ESP32-WROOM-32`, servo `40 kg·cm`, `XL4015`, `HX711`, `LiPo 11,1 V`, buzzer `GPIO 12`) y diagramas reales en `/electronica/diagramas_sistema/`.
- `/programacion/` — Firmware ESP32 C++, cuadernos Edge AI/NLP (`.ipynb`) y frontend web offline-first (`/programacion/nodejs_alma_web/frontend_alma/www`).
- `/documentacion/` — Manuscritos previos, rúbricas y presentaciones del equipo.
- `/android/` — Proyecto Android Capacitor empaquetado de la aplicación móvil.
- `/data/` — Almacenamiento persistente JSON del servidor clínico (`alma-store.json`) y especificación oficial del examen (`T3.md`).
- `/src/` — Aplicación React + TypeScript + Tailwind y módulos API (`src/server/almaRoutes.ts`).
- `/server.ts` — Servidor Express unificado que monta la API clínica (`/api/*`), sirve `/alma-app/`, expone diagramas en `/alma-assets/diagramas/` y entrega el frontend Vite/React en puerto `3000`.

---

## 2. Cuatro Vistas de la Plataforma

1. **Sistema ALMA (vista inicial):** Carga la aplicación web real de ALMA mediante `<iframe>` apuntando a `/alma-app/` e incluye un inspector desplegable conectado en vivo a `/api/health`, `/api/pacientes`, `/api/sesiones` y `/api/alertas`.
2. **Informe (Artículo Word PRISMA 2020):** Presenta las 17 partes obligatorias de la Tabla 19 de `T3.md`, diagramas SVG de bloques y PRISMA (`560 → 412 → 84 → 77 → 30`), matriz completa de extracción de 30 estudios reales con DOI, Business Model Canvas, Cadena de Valor, BOM (`S/ 420`), Flujo de Caja 0–5 años (`COK = 12 %`, `VAN = S/ 9 589,89`, `TIR = 25,16 %`, `B/C = 1,40`, `PRI = 3,69 años`), análisis de sensibilidad (`+10 %`, `−10 %`, `−20 %`), ODS (`3, 9, 10`) y **Anexo D individual** dinámico por integrante con descarga directa a `.docx` (`Exportar Word`).
3. **Presentación (Gestor PPT + Guion de Oratoria):** Selector para los 4 integrantes (`Gabriel Cadenillas`, `Arthuro Herrada`, `José Casariego`, `Hanns Maza`), cada uno con 8 diapositivas `16:9` optimizadas para captura directa hacia PowerPoint (`Modo captura PPT`) y panel lateral sincronizado con el guion de oratoria de 3 minutos exactos.
4. **Referencias:** Explorador filtrable de **34 artículos académicos reales verificados con DOI** (`30` incluidos en la matriz PRISMA —`86,7 %` publicados entre `2021` y `2026`— más `4` referentes clínicos/metodológicos), con resúmenes en español y copia rápida en formato APA 7.

---

## 3. Integrantes del Grupo G01 (UPN)

| Integrante | Código | Rol Principal | Archivo Word Individual |
| :--- | :--- | :--- | :--- |
| Gabriel A. Cadenillas Alfaro | `N00358253` | Coordinador · Introducción, Design Thinking y SCAMPER | `G01_CadenillasGabriel_RevisionSistematica.docx` |
| Arthuro F. Herrada Vela | `N00358779` | Metodología PRISMA 2020, Scopus/WoS y Control ESP32 | `G01_HerradaArthuro_RevisionSistematica.docx` |
| José E. Casariego Valdez | `N00324605` | Resultados, Matriz de Extracción y Bibliometría | `G01_CasariegoJose_RevisionSistematica.docx` |
| Hanns J. Maza Pareja | `N00309808` | Discusión, Canvas, Evaluación Financiera y ODS | `G01_MazaHanns_RevisionSistematica.docx` |

---

## 4. Capacidad Investigativa y Búsqueda Bibliográfica

Todas las referencias de esta plataforma fueron contrastadas mediante búsqueda web real sobre literatura indexada (Scopus, Web of Science, PubMed, IEEE, Springer, MDPI y Crossref). Cada referencia incluye su DOI verificable (`https://doi.org/...`), métricas extraídas y aporte específico al problema clínico, control difuso/ESP32, interfaz por voz y rentabilidad en telerehabilitación domiciliaria.

---

## 5. Ejecución Local

```bash
npm install
npm run dev      # Servidor monolítico Express + Vite en http://localhost:3000
npm run lint     # Verificación de tipos TypeScript (tsc --noEmit)
npm run build    # Compilación de producción en /dist
```
