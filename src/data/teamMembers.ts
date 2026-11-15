export interface CreditContribution {
  rol: string;
  detalle: string;
}

export interface TeamMember {
  id: 'gabriel' | 'arthuro' | 'jose' | 'hanns';
  fullName: string;
  shortName: string;
  fileTag: string;
  code: string;
  email: string;
  orcidPlaceholder: string;
  roleTitle: string;
  pitchDuration: string;
  drivePitchFile: string;
  drivePitchPlaceholder: string;
  sectionsAuthored: string[];
  sharedTasks: string;
  screeningBatch: {
    lote: string;
    revisados: number;
    excluidosTituloResumen: number;
    conflictosResueltos: number;
    companeroPar: string;
  };
  creditRoles: CreditContribution[];
  reflexionIS: string;
  reflexionMSD: string;
}

export const COURSE_METADATA = {
  university: 'Universidad Privada del Norte (UPN)',
  faculty: 'Facultad de Ingeniería – Carrera de Ingeniería Mecatrónica',
  course: 'Emprendimiento y Evaluación de Proyectos',
  section: 'Sección por confirmar',
  groupCode: 'G01',
  docente: 'Joel Diógenes Zambrano Falcón',
  period: '2026-1',
  city: 'Lima, Perú',
  driveRootPlaceholder: 'https://drive.google.com/drive/folders/ENLACE_CARPETA_G01_ALMA',
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'gabriel',
    fullName: 'Gabriel A. Cadenillas Alfaro',
    shortName: 'Gabriel Cadenillas',
    fileTag: 'G01_CadenillasGabriel_RevisionSistematica.docx',
    code: 'N00358253',
    email: 'n00358253@upn.pe',
    orcidPlaceholder: '0009-0000-0000-0001',
    roleTitle: 'Coordinador · Introducción, Design Thinking y SCAMPER',
    pitchDuration: '3 min 00 s',
    drivePitchFile: 'G01_Cadenillas_Pitch.mp4',
    drivePitchPlaceholder: 'https://drive.google.com/file/d/ENLACE_PITCH_CADENILLAS/view?usp=sharing',
    sectionsAuthored: [
      '1. Introducción (brecha clínica, guías Karasheva 2025 / Shafaie 2026 y marco PCC)',
      '2. Contexto del proyecto ALMA (Design Thinking 5 fases y SCAMPER)',
      'Integración final del manuscrito y consistencia de evidencias E00–E03',
    ],
    sharedTasks: 'Cribado doble del Lote 1 (279 registros con José Casariego); revisión de estilo y coherencia.',
    screeningBatch: {
      lote: 'Lote 1 (Registros 1–279)',
      revisados: 279,
      excluidosTituloResumen: 234,
      conflictosResueltos: 11,
      companeroPar: 'José E. Casariego Valdez',
    },
    creditRoles: [
      { rol: 'Conceptualización', detalle: 'Definición de la brecha post-ACV y pregunta PCC del estudio.' },
      { rol: 'Administración del proyecto', detalle: 'Coordinación de cronograma S1–S6 y carpeta compartida Drive (E00).' },
      { rol: 'Investigación', detalle: 'Cribado independiente Lote 1 (279 registros) y síntesis de entrevistas.' },
      { rol: 'Redacción – borrador original', detalle: 'Secciones 1 (Introducción) y 2 (Contexto, DT y SCAMPER).' },
      { rol: 'Redacción – revisión y edición', detalle: 'Integración final del artículo grupal y control de límites Turnitin.' },
    ],
    reflexionIS:
      'La aplicación de Design Thinking nos obligó a abandonar la visión puramente centrada en el actuador y escuchar directamente las barreras reales de pacientes post-ACV y fisioterapeutas en Lima. Al analizar los testimonios de la fase de empatía, comprendimos que el traslado hospitalario y la frustración con interfaces táctiles o electrodos sEMG provocan abandono terapéutico antes del tercer mes. Como coordinador, también aprendí a gestionar desacuerdos técnicos durante el cribado del Lote 1 junto a José: cuando diferíamos sobre incluir prototipos industriales o clínicos, volvimos siempre al criterio PCC y al usuario final con hemiparesia. Finalmente, estructurar el pitch de tres minutos exigió traducir especificaciones como torque de 40 kg·cm o aislamiento galvánico en beneficios humanos comprensibles: seguridad en casa, autonomía por voz y alivio económico para las familias.',
    reflexionMSD:
      'El desarrollo de la revisión sistemática bajo el estándar PRISMA 2020 consolidó mi capacidad para conectar el hardware mecatrónico con evidencia científica y herramientas digitales trazables. Mediante gestores bibliográficos, Rayyan para el cribado ciego y la arquitectura documental vinculada por códigos E00–E21, integré los planos de Autodesk Inventor, el firmware ESP32 y el motor NLP en un sistema único y auditable. Asimismo, emplear SCAMPER con indicadores cuantitativos —como reducir la latencia de respuesta BLE bajo 20 ms o sustituir electrodos sEMG por comandos vocales con 91,70 % de precisión, alineado con referentes como Guo et al. (2022)— demostró cómo cada decisión de ingeniería impacta directamente en el Canvas y en los flujos de caja. Ver el proyecto como un sistema acoplado, desde la bibliografía ScienceDirect/Scopus/WoS hasta el modelo financiero a cinco años, transformó un prototipo universitario en una propuesta tecnológica viable.',
  },
  {
    id: 'arthuro',
    fullName: 'Arthuro F. Herrada Vela',
    shortName: 'Arthuro Herrada',
    fileTag: 'G01_HerradaArthuro_RevisionSistematica.docx',
    code: 'N00358779',
    email: 'n00358779@upn.pe',
    orcidPlaceholder: '0009-0000-0000-0002',
    roleTitle: 'Metodología PRISMA 2020, Búsqueda ScienceDirect/Scopus/WoS y Cribado',
    pitchDuration: '3 min 00 s',
    drivePitchFile: 'G01_Herrada_Pitch.mp4',
    drivePitchPlaceholder: 'https://drive.google.com/file/d/ENLACE_PITCH_HERRADA/view?usp=sharing',
    sectionsAuthored: [
      '3. Metodología PRISMA 2020 (ecuaciones Scopus, WoS, ScienceDirect y criterios I/E)',
      'Registro de protocolo, deduplicación y diagrama de flujo PRISMA (n=31 estudios primarios)',
      'Validación técnica de control difuso y aislamiento galvánico ESP32',
    ],
    sharedTasks: 'Cribado doble del Lote 2 (279 registros con Hanns Maza); exportación .ris/.csv y resolución de conflictos.',
    screeningBatch: {
      lote: 'Lote 2 (Registros 280–558)',
      revisados: 279,
      excluidosTituloResumen: 234,
      conflictosResueltos: 12,
      companeroPar: 'Hanns J. Maza Pareja',
    },
    creditRoles: [
      { rol: 'Metodología', detalle: 'Diseño de ecuaciones booleanas en Scopus, Web of Science y ScienceDirect.' },
      { rol: 'Curación de datos', detalle: 'Exportación de 820 registros, eliminación de 262 duplicados y trazado PRISMA.' },
      { rol: 'Software', detalle: 'Validación del controlador difuso Mamdani, firmware ESP32 y módulo BLE.' },
      { rol: 'Investigación', detalle: 'Cribado ciego Lote 2 (279 registros) y evaluación de 85 textos completos.' },
      { rol: 'Redacción – borrador original', detalle: 'Sección 3 (Metodología) y verificación cruzada de 41 DOIs.' },
    ],
    reflexionIS:
      'Mi participación en la revisión sistemática y en el diseño electrónico me enseñó que la rigurosidad técnica carece de impacto si no resuelve una vulnerabilidad real del usuario. Durante el cribado por pares del Lote 2 junto a Hanns, surgieron discrepancias sobre artículos con interfaces sEMG complejas frente a sistemas orientados al hogar; resolver esos conflictos mediante diálogo argumentado fortaleció la cohesión del equipo. Al conectar los hallazgos sobre espasticidad y fatiga muscular con nuestro prototipo ALMA, priorizamos la seguridad empática del paciente: limitación estricta a 90° de flexión, buzzer de alerta y detención instantánea por comando verbal de dolor. En el pitch de tres minutos aprendí a comunicar decisiones técnicas complejas —como evitar fallos por ruido electromagnético del motor— desde la tranquilidad y confianza del paciente.',
    reflexionMSD:
      'Construir una revisión bajo protocolo PRISMA 2020 me exigió tratar la búsqueda científica con la misma precisión determinista que un algoritmo de control. A partir de ecuaciones replicables en Scopus, Web of Science y ScienceDirect, gestioné 820 registros iniciales, ejecuté la deduplicación sistemática de 262 entradas y audité el cribado ciego de 558 resúmenes hasta consolidar 31 estudios primarios incluidos (100 % publicados entre 2022 y 2026), más 2 revisiones guía y 8 referentes de respaldo con 41 DOIs verificados. Esta mentalidad sistémico digital se reflejó también en el desarrollo de ALMA: al integrar el firmware C++ del ESP32, la lógica difusa tipo Mamdani y la sincronización con el servidor Node.js, entendí que la trazabilidad de datos es indispensable para validar tanto un protocolo académico como la viabilidad operativa de un emprendimiento mecatrónico.',
  },
  {
    id: 'jose',
    fullName: 'José E. Casariego Valdez',
    shortName: 'José Casariego',
    fileTag: 'G01_CasariegoJose_RevisionSistematica.docx',
    code: 'N00324605',
    email: 'n00324605@upn.pe',
    orcidPlaceholder: '0009-0000-0000-0003',
    roleTitle: 'Resultados, Matriz de Extracción (31 estudios) y Bibliometría',
    pitchDuration: '3 min 00 s',
    drivePitchFile: 'G01_Casariego_Pitch.mp4',
    drivePitchPlaceholder: 'https://drive.google.com/file/d/ENLACE_PITCH_CASARIEGO/view?usp=sharing',
    sectionsAuthored: [
      '4. Resultados (matriz de extracción de los 31 estudios primarios P01–P31)',
      'Análisis bibliométrico por año (100 % 2022–2026), país y 3 clústeres VOSviewer',
      'Síntesis temática para RQ1, RQ2 y RQ3',
    ],
    sharedTasks: 'Cribado doble del Lote 1 (279 registros con Gabriel Cadenillas); verificación de métricas clínicas y costos.',
    screeningBatch: {
      lote: 'Lote 1 (Registros 1–279)',
      revisados: 279,
      excluidosTituloResumen: 234,
      conflictosResueltos: 11,
      companeroPar: 'Gabriel A. Cadenillas Alfaro',
    },
    creditRoles: [
      { rol: 'Análisis formal', detalle: 'Extracción estructurada de 31 estudios primarios (P01–P31) y bibliometría 2022–2026.' },
      { rol: 'Visualización', detalle: 'Tablas comparativas, mapa de co-ocurrencia en 3 clústeres VOSviewer y trazabilidad.' },
      { rol: 'Investigación', detalle: 'Cribado paralelo Lote 1 (279 registros) y lectura a texto completo.' },
      { rol: 'Validación', detalle: 'Contrastación de métricas de precisión (NLP/EEG/sEMG), FMA-UE y costos BOM.' },
      { rol: 'Redacción – borrador original', detalle: 'Sección 4 (Resultados) y síntesis por preguntas RQ1–RQ3.' },
    ],
    reflexionIS:
      'Sistematizar treinta y un estudios primarios internacionales junto con dos revisiones guía me permitió observar con empatía una brecha crítica: gran parte de los exoesqueletos publicados se diseñan en laboratorios de alto presupuesto sin considerar la realidad física ni económica de pacientes en países como el Perú. Al analizar la evidencia sobre telerehabilitación domiciliaria, confirmé que la adherencia depende de la simplicidad de uso y del acompañamiento percibido por el usuario y su cuidador. En el trabajo en equipo con Gabriel durante el cribado del Lote 1, aprendí a escuchar criterios divergentes antes de descartar un estudio, manteniendo siempre respeto y rigor compartido. Preparar el pitch individual me ayudó a condensar decenas de métricas clínicas y bibliométricas en un mensaje directo que muestra cómo ALMA devuelve dignidad y continuidad terapéutica en el hogar.',
    reflexionMSD:
      'La elaboración de la matriz de extracción y del análisis bibliométrico fortaleció directamente mi pensamiento sistémico digital. Organizar 31 publicaciones primarias verificadas (P01–P31) en tres clústeres —Exoesqueletos y Diseño 3D (25,8 %), Control Adaptativo y Seguridad (41,9 %) e IA, Voz, NLP y Telerehabilitación (32,3 %)— más el respaldo económico y metodológico complementario, permitió convertir información dispersa en indicadores comparables para responder las tres preguntas de revisión (RQ1–RQ3). Descubrimos que el 100 % de la evidencia primaria incluida se concentra entre 2022 y 2026, con una tendencia clara hacia manufactura aditiva, microcontroladores como ESP32 (Toro-Ossaba et al., 2024) y control por voz ligero (Guo et al., 2022). Al cruzar estos datos con el diseño CAD en Autodesk Inventor y las pruebas de ALMA, comprobé cómo la analítica científica orienta decisiones concretas de ingeniería.',
  },
  {
    id: 'hanns',
    fullName: 'Hanns J. Maza Pareja',
    shortName: 'Hanns Maza',
    fileTag: 'G01_MazaHanns_RevisionSistematica.docx',
    code: 'N00309808',
    email: 'n00309808@upn.pe',
    orcidPlaceholder: '0009-0000-0000-0004',
    roleTitle: 'Discusión, Business Model Canvas, Evaluación Financiera y ODS',
    pitchDuration: '3 min 00 s',
    drivePitchFile: 'G01_Maza_Pitch.mp4',
    drivePitchPlaceholder: 'https://drive.google.com/file/d/ENLACE_PITCH_MAZA/view?usp=sharing',
    sectionsAuthored: [
      '5. Discusión (contraste literatura vs ALMA, Canvas, Cadena de Valor)',
      'Evaluación económica y financiera (Flujo 0–5 años, VAN, TIR, B/C, PRI, Sensibilidad)',
      'Impacto social, ODS (3, 9, 10) y 6. Conclusiones',
    ],
    sharedTasks: 'Cribado doble del Lote 2 (279 registros con Arthuro Herrada); modelado Excel financiero E12–E13 y verificación de supuestos.',
    screeningBatch: {
      lote: 'Lote 2 (Registros 280–558)',
      revisados: 279,
      excluidosTituloResumen: 234,
      conflictosResueltos: 12,
      companeroPar: 'Arthuro F. Herrada Vela',
    },
    creditRoles: [
      { rol: 'Análisis formal', detalle: 'Cálculo financiero (VAN, TIR, B/C, PRI descontado y sensibilidad ±10 %/−20 %).' },
      { rol: 'Metodología', detalle: 'Estructuración del Business Model Canvas, cadena de valor y alineamiento ODS.' },
      { rol: 'Investigación', detalle: 'Cribado paralelo Lote 2 (279 registros) y extracción económica (RQ2).' },
      { rol: 'Redacción – borrador original', detalle: 'Secciones 5 (Discusión) y 6 (Conclusiones y limitaciones).' },
      { rol: 'Redacción – revisión y edición', detalle: 'Auditoría de consistencia entre el BOM mecatrónico y el flujo de caja.' },
    ],
    reflexionIS:
      'Evaluar la dimensión económica y social de ALMA me demostró que la ingeniería mecatrónica alcanza su verdadero propósito cuando se vuelve accesible para quienes más la necesitan. Al contrastar el costo de equipos clínicos tradicionales frente a las posibilidades reales de familias peruanas afectadas por un ACV, comprendí que un modelo de negocio empático —combinando venta directa a clínicas locales y alquiler domiciliario accesible— puede reducir drásticamente el abandono terapéutico. Durante el trabajo colaborativo con Arthuro en el Lote 2 y en la validación de supuestos con el equipo, aprendí a negociar prioridades entre prestaciones técnicas y viabilidad financiera. Presentar estos resultados en el pitch de tres minutos reforzó mi capacidad de persuadir a posibles aliados clínicos con evidencia social y cifras reales alineadas a los ODS 3, 9 y 10.',
    reflexionMSD:
      'Integrar el proyecto mecatrónico en un modelo financiero riguroso exigió analizar ALMA como un sistema socio-técnico completo. Partiendo del desglose real de materiales (S/ 420 por unidad con ESP32, servomotor de 40 kg·cm, XL4015, LiPo, HX711 y PLA), construí el Business Model Canvas, la cadena de valor y el flujo de caja descontado a cinco años con tasa de costo de oportunidad del 12 %. Los indicadores obtenidos —VAN de S/ 9 589,89, TIR de 25,16 %, relación B/C de 1,40 y PRI descontado de 3,69 años, manteniendo VAN positivo aun ante una caída del 20 % en flujos— conectan directamente los referentes de costo bajo como Kansal et al. (2023) y la evidencia económica de telerehabilitación (Syukriyah et al., 2026; Candio et al., 2022) con decisiones gerenciales sustentadas en datos.',
  },
];
