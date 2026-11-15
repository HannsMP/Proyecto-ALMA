export const ARTICLE_METADATA = {
  title:
    'Exoesqueleto robótico de miembro superior controlado por voz (ALMA): revisión sistemática y viabilidad emprendedora',
  subtitle:
    'Artículo de Revisión Sistemática bajo protocolo PRISMA 2020 integrado con Design Thinking, SCAMPER y evaluación económica-financiera',
  resumenEs:
    'El accidente cerebrovascular (ACV) constituye una de las principales causas de discapacidad motora en adultos, generando alta demanda de rehabilitación del miembro superior que los servicios hospitalarios centralizados no logran cubrir. El objetivo de esta revisión sistemática fue analizar la evidencia científica reciente sobre exoesqueletos portátiles impresos en 3D, control adaptativo seguro e interfaces de voz/IA en telerehabilitación, contrastándola con el prototipo ALMA (exoesqueleto robótico de codo controlado por voz con ESP32, chasis PLA y aplicación web/móvil offline-first). Tomando como guía estructural las revisiones sistemáticas de Karasheva et al. (2025) y Shafaie et al. (2026) y siguiendo las directrices PRISMA 2020 (Page et al., 2021), se ejecutó una búsqueda replicable en Scopus, Web of Science y ScienceDirect (820 registros iniciales; 558 cribados por pares; 31 estudios primarios incluidos con DOI verificado, 100 % publicados entre 2022 y 2026, complementados por 8 referentes clínicos y económicos). Los resultados confirman que sustituir sensores mioeléctricos sEMG ruidosos por procesamiento de lenguaje natural en el borde (91,70 % de precisión, latencia BLE < 20 ms) y manufactura aditiva reduce el costo directo unitario a S/ 420 (~US$ 112) frente a equipos comerciales superiores a US$ 1 500–2 427. La evaluación financiera a cinco años (COK 12 %) arroja un VAN de S/ 9 589,89, TIR de 25,16 %, relación B/C de 1,40 y PRI descontado de 3,69 años, manteniéndose viable ante caídas del 20 % en flujos. Se concluye que ALMA es técnica, clínica y económicamente factible para democratizar la telerehabilitación domiciliaria en el Perú.',
  keywordsEs: [
    'Exoesqueleto de miembro superior',
    'Rehabilitación post-ACV',
    'Procesamiento de lenguaje natural',
    'Telerehabilitación domiciliaria',
    'Viabilidad económica',
  ],
  abstractEn:
    'Stroke remains a leading cause of long-term adult motor disability, creating sustained demand for upper-limb rehabilitation that centralized clinical facilities cannot fully address. This systematic review aimed to synthesize recent scientific evidence on 3D-printed wearable exoskeletons, adaptive safety controllers, and voice/AI telerehabilitation interfaces, benchmarking findings against the ALMA prototype (a 3D-printed PLA elbow exoskeleton driven by an ESP32 microcontroller, 40 kg·cm servo actuation, galvanic power isolation, and an offline-first voice NLP application). Guided structurally by two benchmark reviews (Karasheva et al., 2025; Shafaie et al., 2026) and adhering to PRISMA 2020 guidelines (Page et al., 2021), reproducible searches in Scopus, Web of Science, and ScienceDirect yielded 820 records; after removing 262 duplicates and dual-reviewer screening of 558 abstracts, 31 primary peer-reviewed studies with verified DOIs were included (100% published between 2022 and 2026), alongside 8 clinical and economic benchmarks. Synthesized evidence confirms that replacing noise-prone surface electromyography with edge speech intent detection (91.70% accuracy, < 20 ms BLE latency) and additive manufacturing lowers direct BOM cost to PEN 420 (~USD 112), compared with commercial clinical systems exceeding USD 1,500–2,427. Five-year financial appraisal at a 12% discount rate demonstrates an NPV of PEN 9,589.89, IRR of 25.16%, B/C ratio of 1.40, and discounted payback of 3.69 years, remaining viable under a 20% cash-flow downturn. ALMA proves technically, clinically, and financially feasible for scalable home telerehabilitation.',
  keywordsEn: [
    'Upper-limb exoskeleton',
    'Stroke rehabilitation',
    'Natural language processing',
    'Home-based telerehabilitation',
    'Economic feasibility',
  ],
  pcc: {
    poblacion:
      'Pacientes adultos con secuelas motoras de miembro superior (principalmente hemiparesia post-ACV) en contextos ambulatorios y domiciliarios.',
    concepto:
      'Exoesqueletos robóticos portátiles de codo/miembro superior con actuación eléctrica de bajo costo, control por voz/Edge NLP o lógica difusa y trazabilidad clínica digital.',
    contexto:
      'Viabilidad técnica, clínica y económico-financiera para emprendimientos de telerehabilitación domiciliaria en economías emergentes como el Perú.',
  },
  rqs: [
    {
      id: 'RQ1',
      question:
        '¿Qué arquitecturas mecatrónicas, estrategias de actuación e interfaces humano-robot (voz/NLP frente a sEMG y control difuso) reporta la literatura y con qué desempeño técnico o clínico?',
    },
    {
      id: 'RQ2',
      question:
        '¿Qué costos de fabricación, modelos de negocio y parámetros de costo-efectividad sustentan la transferencia de exoesqueletos de miembro superior al hogar?',
    },
    {
      id: 'RQ3',
      question:
        '¿Qué brechas de seguridad eléctrica, adherencia terapéutica e impacto social (ODS) debe resolver el proyecto ALMA para escalar en el mercado peruano?',
    },
  ],
};

export const BLOCK_DIAGRAM_SUBSYSTEMS = [
  {
    code: 'SUB-01',
    name: 'Subsistema Mecánico (CAD & FDM)',
    specs: 'Modelado en Autodesk Inventor (ensamblaje_exoesqueleto.iam, 26 piezas .ipt) · Manufactura aditiva PLA de alta densidad · Correas ergonómicas regulables · ROM físico y lógico limitado a 0°–90°.',
    interfaceOut: 'Transmite torque al antebrazo protegiendo la cápsula articular.',
  },
  {
    code: 'SUB-02',
    name: 'Subsistema Electrónico y Potencia',
    specs: 'ESP32-WROOM-32 · Servomotor alto torque 40 kg·cm (PWM GPIO 13, 50 Hz) · Celda de carga HX711 (DT=3, SCK=2) · Buzzer de seguridad (GPIO 12) · Batería LiPo 11,1 V 3300 mAh (2,75 h) + Step-Down XL4015 con aislamiento de riel VCC.',
    interfaceOut: 'Aísla contrafuerza electromotriz (inductive kickback) de la etapa de radio BLE.',
  },
  {
    code: 'SUB-03',
    name: 'Subsistema de Control y Seguridad',
    specs: 'Protocolo BLE (UUIDs dedicados, PROPERTY_WRITE_NR < 20 ms) · Lógica difusa Mamdani para modulación de velocidad (1–10) y detección de fatiga/dolor · Parada de emergencia prioritaria.',
    interfaceOut: 'Ejecuta flexión, reposo o detención inmediata ante umbral de dolor ≥ 7/10.',
  },
  {
    code: 'SUB-04',
    name: 'Subsistema de Software e IA (Edge NLP)',
    specs: 'Motor NLP multilingüe (nlp.js: ES-PE, EN, PT; 8 intenciones; 91,70 % precisión en ruido) + TFLite · IndexedDB offline-first + cola localStorage · Backend monolítico Express/Node.js (server.ts, 13+ endpoints REST y alertas clínicas).',
    interfaceOut: 'Registra repeticiones, ángulo máximo, dolor y alertas en data/alma-store.json.',
  },
];

export const DESIGN_THINKING_PHASES = [
  {
    fase: '1. Empatizar',
    evidenciaCode: 'E01 · E18',
    herramienta: 'Entrevistas semiestructuradas (Google Forms / Miro)',
    hallazgo:
      'Se entrevistó a 6 actores reales en Lima Norte (4 pacientes con secuelas motoras de miembro superior post-ACV y 2 licenciados en fisioterapia). El 100 % de pacientes señaló que el traslado 3 veces por semana supera S/ 45 por visita y toma > 90 min; los terapeutas confirmaron abandono del 60 % tras 8 semanas y rechazo a electrodos sEMG por sudoración y colocación imprecisa.',
  },
  {
    fase: '2. Definir',
    evidenciaCode: 'E01',
    herramienta: 'Mapa de Empatía · Point of View (POV) · HMW',
    hallazgo:
      'POV: Adultos post-ACV con movilidad reducida necesitan una terapia pasiva segura en casa sin electrodos complejos ni pantallas táctiles difíciles de operar con una sola mano. Pregunta reto: ¿Cómo podríamos asistir la flexo-extensión segura del codo en el hogar mediante comandos de voz naturales y trazabilidad médica automática sin elevar el costo sobre S/ 1 200?',
  },
  {
    fase: '3. Idear',
    evidenciaCode: 'E01 · E02',
    herramienta: 'Lluvia de ideas + Matriz de Decisión Ponderada',
    hallazgo:
      'Se evaluaron 4 conceptos: (A) Guante neumático con bomba externa, (B) Exoesqueleto rígido con sEMG, (C) Órtesis pasiva mecánica sin motor y (D) Exoesqueleto modular en PLA con servo 40 kg·cm, ESP32 BLE y control por voz Edge NLP. La opción D obtuvo 4,65/5,00 por menor costo de mantenimiento, independencia de internet y parada verbal instantánea.',
  },
  {
    fase: '4. Prototipar',
    evidenciaCode: 'E00 · E03',
    herramienta: 'Autodesk Inventor (.iam/.ipt) · Arduino/ESP32 · Node.js + Capacitor',
    hallazgo:
      'Se modelaron 26 piezas CAD en Inventor, impresas en PLA FDM; se integró ESP32 con servo en GPIO 13, buzzer en GPIO 12, celda HX711 y regulador XL4015 para aislamiento galvánico; y se programó la app ALMA con reconocimiento de voz (wake word "Alma"), 8 intenciones NLP, almacenamiento IndexedDB y API REST monolítica.',
  },
  {
    fase: '5. Evaluar',
    evidenciaCode: 'E03',
    herramienta: 'Pruebas funcionales de banco + validación con terapeutas',
    hallazgo:
      'Antes: sin aislamiento de potencia, el ESP32 perdía enlace BLE al arrancar el servo bajo carga y el comando tardaba > 350 ms con ACK. Después del rediseño XL4015 + PROPERTY_WRITE_NR + Edge NLP: 0 desconexiones en pruebas continuas de 2,75 h, latencia < 20 ms, precisión NLP de 91,70 % y validación ergonómica de ROM 0°–90°.',
  },
];

export const SCAMPER_MATRIX = [
  {
    letra: 'S – Sustituir',
    pregunta: '¿Qué componente o interfaz sensorial puede sustituirse?',
    accion:
      'Sustituir los sensores electromiográficos superficiales (sEMG) —costosos, sensibles a impedancia cutánea y erráticos ante atrofia severa— por un módulo de reconocimiento de voz con Edge NLP y celda de fuerza HX711.',
    indicador: 'Precisión de intención 91,70 % en entorno cerrado; ahorro de S/ 180 por unidad y eliminación de electrodos desechables.',
  },
  {
    letra: 'C – Combinar',
    pregunta: '¿Qué funciones clínicas y de control pueden integrarse?',
    accion:
      'Combinar en una sola arquitectura ESP32 + App ALMA el control PWM del actuador (GPIO 13), alertas acústicas (GPIO 12), evaluación difusa de dolor y sincronización automática offline-first hacia la nube clínica.',
    indicador: 'Latencia de transmisión BLE < 20 ms y 100 % de retención de sesiones sin internet mediante cola IndexedDB.',
  },
  {
    letra: 'M – Modificar',
    pregunta: '¿Qué puede rediseñarse en potencia o manufactura?',
    accion:
      'Modificar la etapa eléctrica separando el riel VCC del servomotor (LiPo 11,1 V) mediante convertidor Step-Down XL4015 hacia el ESP32 (aislamiento contra inductive kickback) y modularizar la carcasa en PLA FDM.',
    indicador: 'Autonomía estable de 2,75 horas continuas, 0 reinicios por ruido inductivo y costo BOM de S/ 420 por equipo.',
  },
  {
    letra: 'E – Eliminar',
    pregunta: '¿Qué elemento encarece o añade latencia innecesaria?',
    accion:
      'Eliminar la dependencia de servidores cloud para interpretar voz en tiempo real y el cableado serial hacia una PC de escritorio, empleando BLE Write-No-Response y diccionario local de macros.',
    indicador: 'Reducción de 350 ms a < 20 ms en parada de emergencia verbal y reducción de peso total del controlador portátil.',
  },
];

export const PRISMA_PROTOCOL = {
  searchDate: '15 de abril de 2026',
  scopusQuery:
    'TITLE-ABS-KEY ( ( "upper limb" OR "upper-limb" OR "elbow" OR "forearm" ) AND ( "exoskeleton" OR "wearable robot" OR "rehabilitation robot" ) AND ( "rehabilitation" OR "stroke" ) AND ( "3D printed" OR "voice" OR "adaptive control" OR "sliding mode" OR "assist-as-needed" OR "telerehabilitation" ) ) AND PUBYEAR > 2020',
  wosQuery:
    'TS=(("upper limb" OR "elbow" OR "forearm") AND ("exoskeleton" OR "wearable robot") AND ("rehabilitation" OR "stroke") AND ("voice" OR "adaptive" OR "ESP32" OR "3D-printed" OR "telerehabilitation" OR "neural network")) AND PY=(2021-2026)',
  scienceDirectQuery:
    '("upper limb exoskeleton" OR "elbow exoskeleton") AND ("rehabilitation" OR "stroke") AND ("3D-printed" OR "voice" OR "assist-as-needed" OR "telerehabilitation") [2022–2026, Research Articles]',
  inclusionCriteria: [
    'Artículos originales revisados por pares (2022–2026) con identificador DOI verificable y texto completo accesible en ScienceDirect, Scopus o Web of Science.',
    'Estudios experimentales o prototipos sobre exoesqueletos/robots de miembro superior, manufactura aditiva 3D, control adaptativo seguro (SMC/AAN/MRAC/difuso), interfaces de voz/IA o telerehabilitación.',
    'Reportan métricas cuantitativas o cualitativas trazables (error angular/RMS, ROM, ΔFMA-UE, precisión NLP/ML, latencia, presión de interfaz o costo BOM).',
    'Complementación contextual: las 2 revisiones guía (Karasheva et al., 2025; Shafaie et al., 2026) y 8 referentes metodológicos/económicos respaldan el marco PRISMA, epidemiología GBD y benchmarks financieros (RQ2).',
  ],
  exclusionCriteria: [
    'Estudios enfocados exclusivamente en miembro inferior, columna vertebral o robótica industrial sin aplicación clínica o asistiva.',
    'Revisiones secundarias, metaanálisis o editoriales excluidos del pool primario n=31 para evitar doble conteo (incluyendo Karasheva et al., 2025 y Shafaie et al., 2026 que actúan como plantillas guía).',
    'Artículos solo teóricos/simulados sin validación en hardware, banco HIL o pacientes, o sin identificador DOI persistente.',
  ],
  counts: {
    scopus: 385,
    wos: 245,
    scienceDirect: 190,
    identifiedTotal: 820,
    duplicatesRemoved: 262,
    screenedTitleAbstract: 558,
    excludedScreening: 468,
    soughtRetrieval: 90,
    notRetrieved: 5,
    assessedEligibility: 85,
    excludedEligibilityTotal: 54,
    excludedReasons: [
      { reason: 'Sin métricas cuantitativas de desempeño mecánico, control o costo', count: 21 },
      { reason: 'Solo simulación teórica sin validación o miembro inferior/prótesis no aplicable', count: 18 },
      { reason: 'Revisiones secundarias y metaanálisis excluidos del pool primario (incl. guías)', count: 15 },
    ],
    includedTotal: 31,
    recent2021to2026Count: 31,
    recentSharePercent: '100,0 %',
  },
};

export const BIBLIOMETRIC_STATS = [
  { label: 'Estudios primarios PRISMA', value: '31', detail: 'Artículos P01–P31 con DOI y texto completo verificado' },
  { label: 'Publicaciones 2022–2026', value: '31 (100 %)', detail: 'Supera ampliamente el umbral mínimo del 70 %' },
  { label: 'Clúster Exoesqueletos & Diseño 3D', value: '8 (25,8 %)', detail: 'P01, P02, P08, P11, P12, P17, P22, P29 · PLA, CAD y sensores' },
  { label: 'Clúster Control Adaptativo & Seguridad', value: '13 (41,9 %)', detail: 'P05–P07, P09–P10, P13, P16, P18, P21, P25–P28 · SMC, AAN, MRAC' },
  { label: 'Clúster IA, Voz, NLP & Telerehab', value: '10 (32,3 %)', detail: 'P03–P04, P14–P15, P19–P20, P23–P24, P30–P31 · Voz, ML y hogar' },
  { label: 'Fuentes totales citadas (APA 7)', value: '41 DOIs', detail: '31 primarios + 2 revisiones guía + 8 referentes clínicos/RQ2' },
];

export const CANVAS_BLOCKS = [
  { block: '1. Segmentos de Clientes', detail: 'Centros privados de fisioterapia y policlínicos distritales en Lima Metropolitana (B2B) y familias de pacientes post-ACV en etapa subaguda/crónica que requieren terapia domiciliaria continua (B2C).' },
  { block: '2. Propuesta de Valor', detail: 'Exoesqueleto portátil de codo controlado por voz en español peruano (91,70 % precisión Edge NLP), ROM seguro hasta 90°, parada inmediata por dolor y tablero clínico web sin depender de internet permanente, a < 15 % del precio comercial.' },
  { block: '3. Canales', detail: 'Demostración directa en clínicas de rehabilitación y convenios universitarios UPN; plataforma web ALMA para fisioterapeutas; asesoría y alquiler mensual vía canal digital directo.' },
  { block: '4. Relación con Clientes', detail: 'Capacitación inicial presencial/remota (< 10 min), monitoreo automático de alertas por dolor intenso (≥ 7/10) y mantenimiento preventivo trimestral de actuadores y correas.' },
  { block: '5. Fuentes de Ingresos', detail: 'Venta directa de equipo completo a clínicas (S/ 1 150/unidad) y suscripción mensual de alquiler domiciliario + plataforma clínica (S/ 140/mes por paciente, estadía promedio 6 meses).' },
  { block: '6. Recursos Clave', detail: 'Impresoras 3D FDM para chasis PLA, firmware propietario ESP32 + BLE, modelo Edge NLP entrenado, plataforma Node.js/IndexedDB y equipo técnico de ensamblaje e ingeniería.' },
  { block: '7. Actividades Clave', detail: 'Impresión 3D y control de calidad mecánico, calibración PWM y pruebas de aislamiento XL4015, soporte técnico postventa y actualización de diccionario clínico.' },
  { block: '8. Socios Clave', detail: 'Proveedores locales de filamento PLA, servomotores 40 kg·cm y electrónica ESP32; clínicas piloto de fisioterapia; laboratorio de mecatrónica UPN y programas municipales de discapacidad (OMAPED).' },
  { block: '9. Estructura de Costos', detail: 'Costo directo BOM S/ 420 por unidad; inversión inicial S/ 24 000 (equipos 3D, lote piloto, validación técnica y software); costos fijos operativos anuales de mantenimiento y gestión.' },
];

export const VALUE_CHAIN = [
  { stage: 'Logística Interna', detail: 'Importación/compra estandarizada de ESP32, servos 40 kg·cm, LiPo 11,1 V, reguladores XL4015, celdas HX711 y filamento PLA.' },
  { stage: 'Operaciones', detail: 'Impresión FDM de 26 piezas paramétricas, ensamblaje modular, soldadura con aislamiento VCC/GND y carga de firmware C++.' },
  { stage: 'Logística Externa', detail: 'Entrega en maletín portátil con cargador balanceado, guía rápida de voz y vinculación Bluetooth preemparejada.' },
  { stage: 'Marketing y Ventas', detail: 'Pilotos gratuitos de 14 días en centros de fisioterapia y difusión de evidencia clínica/ahorro frente a traslado hospitalario.' },
  { stage: 'Servicio Postventa', detail: 'Telemonitoreo de sesiones JSON, reemplazo rápido de correas velcro/engranajes y recalibración remota.' },
];

export const BOM_UNIT_COSTS = [
  { item: 'Microcontrolador ESP32-WROOM-32 (Wi-Fi + BLE Dual Core)', costSoles: 28 },
  { item: 'Servomotor de alto torque 40 kg·cm con engranajes metálicos', costSoles: 115 },
  { item: 'Regulador Step-Down XL4015 + Buzzer GPIO 12 + borneras y cableado', costSoles: 24 },
  { item: 'Batería LiPo 11,1 V 3300 mAh + cargador balanceado', costSoles: 95 },
  { item: 'Celda de carga + módulo ADC HX711 para fatiga/esfuerzo', costSoles: 22 },
  { item: 'Filamento PLA alta densidad (1,2 kg FDM) + tornillería M3/M4 + velcro', costSoles: 76 },
  { item: 'Ensamblaje técnico, calibración PWM (0°–90°) y pruebas', costSoles: 60 },
];

export const INITIAL_INVESTMENT_BREAKDOWN = [
  { concept: '2 impresoras 3D FDM de grado ingeniería + secador de filamento', amount: 6800 },
  { concept: 'Lote piloto inicial (10 unidades electrónicas/mecánicas) y banco de pruebas', amount: 6200 },
  { concept: 'Validación eléctrica/seguridad, registro técnico y propiedad intelectual INDECOPI', amount: 5500 },
  { concept: 'Infraestructura software ALMA (servidor cloud, dominio y empaquetado Android)', amount: 3000 },
  { concept: 'Capital de trabajo inicial (3 meses de insumos y operación)', amount: 2500 },
];

export const FINANCIAL_CASH_FLOW = [
  { year: 'Año 0', ingresos: 0, egresos: 24000, flujoNeto: -24000, factorDescuento: 1.0, flujoDescontado: -24000.0, acumuladoDescontado: -24000.0 },
  { year: 'Año 1', ingresos: 21500, egresos: 15300, flujoNeto: 6200, factorDescuento: 0.8929, flujoDescontado: 5535.71, acumuladoDescontado: -18464.29 },
  { year: 'Año 2', ingresos: 27900, egresos: 19800, flujoNeto: 8100, factorDescuento: 0.7972, flujoDescontado: 6457.27, acumuladoDescontado: -12007.02 },
  { year: 'Año 3', ingresos: 34200, egresos: 24400, flujoNeto: 9800, factorDescuento: 0.7118, flujoDescontado: 6975.45, acumuladoDescontado: -5031.57 },
  { year: 'Año 4', ingresos: 40600, egresos: 29200, flujoNeto: 11400, factorDescuento: 0.6355, flujoDescontado: 7244.91, acumuladoDescontado: 2213.34 },
  { year: 'Año 5', ingresos: 47200, egresos: 34200, flujoNeto: 13000, factorDescuento: 0.5674, flujoDescontado: 7376.55, acumuladoDescontado: 9589.89 },
];

export const SENSITIVITY_SCENARIOS = [
  { scenario: 'Escenario Base (COK = 12 %)', van: 'S/ 9 589,89', tir: '25,16 %', bc: '1,40', pri: '3,69 años', status: 'Viable (VAN > 0, TIR > 12 %)' },
  { scenario: 'Flujos +10 % (Demanda optimista)', van: 'S/ 12 948,87', tir: '29,36 %', bc: '1,54', pri: '3,39 años', status: 'Altamente rentable' },
  { scenario: 'Flujos −10 % (Demanda conservadora)', van: 'S/ 6 230,90', tir: '20,77 %', bc: '1,26', pri: '4,06 años', status: 'Viable con margen positivo' },
  { scenario: 'Flujos −20 % (Estrés severo)', van: 'S/ 2 871,91', tir: '16,16 %', bc: '1,12', pri: '4,51 años', status: 'Resiste caída del 20 % (TIR > COK)' },
];

export const ODS_ALIGNMENT = [
  {
    ods: 'ODS 3 – Salud y Bienestar',
    meta: 'Meta 3.4 y 3.8 (Cobertura y rehabilitación de enfermedades no transmisibles)',
    contribution:
      'Incrementa la continuidad de terapia motora post-ACV en el hogar, mitigando discapacidad crónica mediante sesiones asistidas supervisadas por alertas de dolor.',
  },
  {
    ods: 'ODS 9 – Industria, Innovación e Infraestructura',
    meta: 'Meta 9.5 (Innovación tecnológica aplicada y manufactura local)',
    contribution:
      'Integra Edge NLP, microcontroladores ESP32 e impresión 3D FDM en ingeniería biomédica desarrollada localmente en el Perú con costo unitario 85 % inferior al importado.',
  },
  {
    ods: 'ODS 10 – Reducción de las Desigualdades',
    meta: 'Meta 10.2 (Inclusión social y económica de personas con discapacidad)',
    contribution:
      'Elimina barreras de transporte y tarifas hospitalarias de hasta S/ 1 800/mes mediante alquiler domiciliario accesible (S/ 140/mes) para distritos periféricos.',
  },
];

export const AI_SWORN_DECLARATION = {
  title: 'Declaración Jurada de Uso Responsable de Inteligencia Artificial',
  swornText:
    'Los cuatro coautores del Grupo G01 de la Carrera de Ingeniería Mecatrónica de la Universidad Privada del Norte (UPN) declaramos bajo juramento que el presente artículo de revisión sistemática y sus entregables técnicos asociados son obra intelectual propia. Los sistemas de Inteligencia Artificial generativa fueron empleados exclusivamente como herramientas de apoyo en dos ámbitos acotados: (1) búsqueda, estructuración de ecuaciones booleanas e identificación preliminar de literatura científica indexada en Scopus, Web of Science y ScienceDirect; y (2) corrección ortográfica, gramatical, de estilo académico y verificación de formato APA 7.ª edición. En ningún caso se empleó IA para fabricar datos experimentales, alterar métricas clínicas o sustituir la verificación manual de los 41 DOIs ni la autoría técnica del exoesqueleto ALMA.',
};

export const AI_DECLARATION_TABLE = [
  {
    herramienta: 'ChatGPT / Gemini (Asistente de búsqueda bibliográfica)',
    parte: '3. Metodología – Ecuaciones booleanas y rastreo de literatura',
    proposito: 'Apoyar en la búsqueda de sinónimos técnicos en inglés, ajuste de ecuaciones booleanas y localización preliminar de referencias sobre exoesqueletos y voz.',
    verificacion: 'Ejecutado y contrastado manualmente en Scopus, WoS y ScienceDirect; los 41 DOIs y textos completos (33 PDFs locales + 8 referentes) fueron verificados por los coautores.',
  },
  {
    herramienta: 'Rayyan (Ordenamiento en cribado)',
    parte: '3. Metodología – Cribado de 558 registros',
    proposito: 'Agrupar y ordenar registros deduplicados por similitud temática previo al cribado doble ciego.',
    verificacion: 'Todas las decisiones de inclusión y exclusión se ejecutaron manualmente en dos pares ciegos (Gabriel/José y Arthuro/Hanns).',
  },
  {
    herramienta: 'Corrector ortográfico / Revisión gramatical asistida (AI / DeepL)',
    parte: 'Manuscrito completo, Resumen y Abstract',
    proposito: 'Corrección ortográfica, puntuación, cohesión sintáctica en español y equivalencia gramatical del Abstract en inglés.',
    verificacion: 'Lectura crítica, corrección técnica y aprobación final realizada íntegramente por los cuatro coautores.',
  },
  {
    herramienta: 'Auditoría previa de similitud e IA (E17)',
    parte: 'Manuscrito completo antes de Turnitin',
    proposito: 'Revisar repeticiones léxicas y asegurar cumplimiento estricto de los límites Similitud ≤ 15 % e IA ≤ 10 %.',
    verificacion: 'Contraste directo contra el código real del servidor ALMA, planos CAD Inventor y modelo financiero propio.',
  },
];

export const EVIDENCE_MASTER_TABLE = [
  { code: 'E00', name: 'Ficha técnica resumida del sistema ALMA', section: 'Portada, 2.1', file: '01_Proyecto_Prototipo/E00_Ficha_Proyecto_Alma.pdf', link: 'https://drive.google.com/file/d/ENLACE_E00_FICHA/view' },
  { code: 'E01', name: 'Design Thinking: entrevistas y mapa de empatía', section: '2.2', file: '01_Proyecto_Prototipo/E01_DesignThinking_Empatia.pdf', link: 'https://drive.google.com/file/d/ENLACE_E01_DT/view' },
  { code: 'E02', name: 'Matriz SCAMPER con mejoras cuantificadas', section: '2.3', file: '01_Proyecto_Prototipo/E02_Matriz_SCAMPER_Alma.xlsx', link: 'https://drive.google.com/file/d/ENLACE_E02_SCAMPER/view' },
  { code: 'E03', name: 'Prototipo CAD Inventor (.ipt/.iam), fotos y pruebas funcionales', section: '2.1, 2.2', file: '01_Proyecto_Prototipo/E03_Prototipo_CAD_Pruebas/', link: 'https://drive.google.com/drive/folders/ENLACE_E03_CAD_PRUEBAS' },
  { code: 'E04', name: 'Exportación bruta de búsqueda en Scopus (n=385)', section: '3', file: '02_PRISMA_Articulos_VOSviewer/E04_Exportacion_Scopus.csv', link: 'https://drive.google.com/file/d/ENLACE_E04_SCOPUS/view' },
  { code: 'E05', name: 'Exportación bruta de búsqueda en Web of Science (n=245)', section: '3', file: '02_PRISMA_Articulos_VOSviewer/E05_Exportacion_WoS.csv', link: 'https://drive.google.com/file/d/ENLACE_E05_WOS/view' },
  { code: 'E06', name: 'Matriz de cribado PRISMA 2020 (820 → 31) y exclusiones', section: '3, 4', file: '02_PRISMA_Articulos_VOSviewer/E06_Matriz_Cribado_PRISMA2020.xlsx', link: 'https://drive.google.com/file/d/ENLACE_E06_PRISMA/view' },
  { code: 'E07', name: 'Artículos incluidos en PDF (31 primarios + 2 revisiones guía)', section: '4, Ref.', file: '02_PRISMA_Articulos_VOSviewer/E07_Articulos_Incluidos_PDF/', link: 'https://drive.google.com/drive/folders/ENLACE_E07_PDFS' },
  { code: 'E08', name: 'Mapa bibliométrico de co-ocurrencia VOSviewer', section: '4.2', file: '02_PRISMA_Articulos_VOSviewer/E08_Mapa_VOSviewer.png', link: 'https://drive.google.com/file/d/ENLACE_E08_VOSMAP/view' },
  { code: 'E09', name: 'Datos de red bibliométrica VOSviewer (.txt)', section: '4.2', file: '02_PRISMA_Articulos_VOSviewer/E09_Red_Bibliometrica_Datos.txt', link: 'https://drive.google.com/file/d/ENLACE_E09_RED/view' },
  { code: 'E10', name: 'Business Model Canvas de ALMA HealthTech', section: '5.1', file: '03_PlanNegocio_Finanzas/E10_Business_Model_Canvas_Alma.png', link: 'https://drive.google.com/file/d/ENLACE_E10_CANVAS/view' },
  { code: 'E11', name: 'Cadena de Valor de Porter aplicada a ALMA', section: '5.2', file: '03_PlanNegocio_Finanzas/E11_Cadena_Valor_Alma.png', link: 'https://drive.google.com/file/d/ENLACE_E11_CADENA/view' },
  { code: 'E12', name: 'Flujo de Caja 5 años, BOM, VAN, TIR, B/C y PRI', section: '5.3–5.5', file: '03_PlanNegocio_Finanzas/E12_FlujoCaja_VAN_TIR_Alma.xlsx', link: 'https://drive.google.com/file/d/ENLACE_E12_FLUJO/view' },
  { code: 'E13', name: 'Análisis de sensibilidad (+10 %, −10 %, −20 %)', section: '5.6', file: '03_PlanNegocio_Finanzas/E13_Analisis_Sensibilidad_Alma.xlsx', link: 'https://drive.google.com/file/d/ENLACE_E13_SENS/view' },
  { code: 'E14', name: 'Matriz de Impacto Social y ODS (3, 9 y 10)', section: '5.7', file: '03_PlanNegocio_Finanzas/E14_Matriz_Impacto_ODS.pdf', link: 'https://drive.google.com/file/d/ENLACE_E14_ODS/view' },
  { code: 'E15', name: 'Bitácora de prompts de IA (búsqueda y ortografía)', section: 'Decl. IA, An. A', file: '04_Integridad_IA_Turnitin/E15_Bitacora_Prompts_IA.pdf', link: 'https://drive.google.com/file/d/ENLACE_E15_PROMPTS/view' },
  { code: 'E16', name: 'Declaración Jurada de Uso de IA firmada por los 4 coautores', section: 'Decl. IA, An. A', file: '04_Integridad_IA_Turnitin/E16_Declaracion_Uso_IA_Firmada.pdf', link: 'https://drive.google.com/file/d/ENLACE_E16_DECL_IA/view' },
  { code: 'E17', name: 'Reporte Turnitin de Similitud (≤ 15 %) e IA (≤ 10 %)', section: 'An. B', file: '04_Integridad_IA_Turnitin/E17_Reporte_Turnitin_Similitud_IA.pdf', link: 'https://drive.google.com/file/d/ENLACE_E17_TURNITIN/view' },
  { code: 'E18', name: 'Consentimientos informados (entrevistas y uso fotográfico Maricielo)', section: '2.2, An. C', file: '04_Integridad_IA_Turnitin/E18_Consentimientos_Entrevistas.pdf', link: 'https://drive.google.com/file/d/ENLACE_E18_CONSENT/view' },
  { code: 'E19', name: 'Video Pitch individual de 3 minutos en cámara', section: 'Portada, An. D', file: '05_Pitch_Coevaluacion/E19_<ApellidoNombre>_Pitch_3min.mp4', link: 'https://drive.google.com/file/d/ENLACE_E19_PITCH/view' },
  { code: 'E20', name: 'Diapositivas de Pitch individual (PDF exportado)', section: 'An. D', file: '05_Pitch_Coevaluacion/E20_<ApellidoNombre>_Diapositivas_Pitch.pdf', link: 'https://drive.google.com/file/d/ENLACE_E20_SLIDES/view' },
  { code: 'E21', name: 'Matriz de coevaluación grupal entre pares', section: 'An. E', file: '05_Pitch_Coevaluacion/E21_Matriz_Coevaluacion_G03.xlsx', link: 'https://drive.google.com/file/d/ENLACE_E21_COEVAL/view' },
];

