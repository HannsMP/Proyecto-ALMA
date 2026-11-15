import type { TeamMember } from './teamMembers';

export type SlideVisualKind =
  | 'cover'
  | 'problem'
  | 'architecture'
  | 'scamper'
  | 'roleFocus'
  | 'finance'
  | 'impact'
  | 'closing';

export interface PresentationSlide {
  id: string;
  number: number;
  timeRange: string;
  blockLabel: string;
  title: string;
  subtitle: string;
  kind: SlideVisualKind;
  kpis?: Array<{ label: string; value: string; note?: string }>;
  bullets: string[];
  highlightNote?: string;
  referenceTags?: string[];
  speechScript: string;
  deliveryCue: string;
}

export interface RolePresentationDeck {
  memberId: TeamMember['id'];
  memberName: string;
  memberCode: string;
  roleTitle: string;
  slides: PresentationSlide[];
}

export const ROLE_PRESENTATIONS: RolePresentationDeck[] = [
  // =========================================================================
  // 1. GABRIEL A. CADENILLAS ALFARO (Coordinador · DT & SCAMPER)
  // =========================================================================
  {
    memberId: 'gabriel',
    memberName: 'Gabriel A. Cadenillas Alfaro',
    memberCode: 'N00358253',
    roleTitle: 'Coordinador · Introducción, Design Thinking y SCAMPER',
    slides: [
      {
        id: 'g-1',
        number: 1,
        timeRange: '0:00 – 0:20',
        blockLabel: 'Gancho y Presentación',
        title: '¿Qué pasa cuando un sobreviviente de ACV regresa a casa y no puede mover el brazo ni costear su terapia?',
        subtitle: 'Proyecto ALMA · Exoesqueleto robótico de miembro superior controlado por voz',
        kind: 'cover',
        kpis: [
          { label: 'Sin terapia continua', value: '65 %', note: 'Pacientes post-ACV regionales' },
          { label: 'Traslado semanal', value: '> S/ 135', note: 'Barrera logística y económica' },
          { label: 'Rol en T3', value: 'Coordinador', note: 'DT, SCAMPER e integración' },
        ],
        bullets: [
          'El daño neurológico y el ACV son la principal causa de discapacidad motora en adultos.',
          'ALMA traslada la rehabilitación pasiva del codo desde el hospital saturado hacia el hogar.',
        ],
        deliveryCue: 'Mirar fijo a cámara, tono cercano y pausado en la pregunta inicial. Mostrar el prototipo físico brevemente si se graba en vivo.',
        speechScript:
          'Imaginen sobrevivir a un accidente cerebrovascular y escuchar que recuperarán la movilidad de su brazo, pero solo si asisten tres veces por semana a rehabilitación durante meses. En el Perú, más del sesenta y cinco por ciento de pacientes abandona o no accede a esa continuidad por falta de cupos hospitalarios y altos costos de traslado. Soy Gabriel Cadenillas, coordinador del proyecto ALMA en la UPN, y hoy les presento cómo convertimos nuestro exoesqueleto robótico controlado por voz en una solución viable y respaldada por evidencia científica.',
      },
      {
        id: 'g-2',
        number: 2,
        timeRange: '0:20 – 0:50',
        blockLabel: 'Problema Real y Empatía (DT)',
        title: 'Evidencia de Design Thinking con 6 actores reales',
        subtitle: 'Fases Empatizar, Definir e Idear centradas en el paciente con hemiparesia',
        kind: 'problem',
        kpis: [
          { label: 'Actores entrevistados', value: '6', note: '4 pacientes ACV + 2 fisioterapeutas' },
          { label: 'Abandono antes de mes 3', value: '60 %', note: 'Reportado en entrevistas' },
          { label: 'Matriz de Ideación', value: '4,65 / 5', note: 'Mejor puntaje frente a sEMG/neumático' },
        ],
        bullets: [
          'Electrodos sEMG fallan por atrofia muscular severa, sudoración y colocación compleja.',
          'Pantallas táctiles exigen usar la mano sana o asistencia constante de un cuidador.',
          'Pregunta reto (HMW): asistir flexo-extensión segura en casa por voz y bajo S/ 1 200.',
        ],
        deliveryCue: 'Señalar las barras comparativas de la matriz de decisión.',
        speechScript:
          'Al aplicar las cinco fases de Design Thinking entrevistamos a cuatro pacientes post-ACV y dos fisioterapeutas en Lima Norte. Descubrimos dos barreras concretas: primero, los pacientes rechazan los electrodos mioeléctricos porque requieren calibración precisa y fallan cuando el músculo está atrofiado; segundo, operar una pantalla pequeña con una sola mano resulta frustrante. Por eso definimos nuestro reto: crear un dispositivo domiciliario operable totalmente por voz natural, seguro y por debajo de mil doscientos soles.',
      },
      {
        id: 'g-3',
        number: 3,
        timeRange: '0:50 – 1:15',
        blockLabel: 'Solución Mecatrónica ALMA',
        title: 'Arquitectura acoplada en 4 subsistemas',
        subtitle: 'Integración física de Inventor CAD, ESP32, lógica difusa y software Edge NLP',
        kind: 'architecture',
        kpis: [
          { label: 'Actuador de codo', value: '40 kg·cm', note: 'Limitado a ROM 0°–90°' },
          { label: 'Chasis FDM', value: '26 piezas', note: 'PLA alta densidad (Inventor)' },
          { label: 'Autonomía LiPo', value: '2,75 h', note: 'Aislamiento VCC con XL4015' },
        ],
        bullets: [
          'Mecánica: estructura modular en PLA impreso en 3D con ajuste antropométrico por velcro.',
          'Electrónica: ESP32-WROOM-32, servo en GPIO 13, buzzer de alerta en GPIO 12 y celda HX711.',
          'Software: aplicación ALMA con reconocimiento de voz (es-PE), IndexedDB offline y API Node.js.',
        ],
        deliveryCue: 'Mostrar el diagrama de bloques o el prototipo funcionando en flexión de 0° a 90°.',
        speechScript:
          'Nuestra solución integra cuatro subsistemas mecatrónicos. En la parte mecánica, modelamos veintiséis piezas en Autodesk Inventor impresas en filamento PLA ligero, con rango físico y lógico limitado a noventa grados. En electrónica, un ESP32 controla un servomotor de cuarenta kilogramos por centímetro, un buzzer preventivo y una celda de carga HX711, protegidos con aislamiento galvánico mediante regulador XL4015. Y en software, la app ALMA interpreta comandos de voz localmente sin requerir internet permanente.',
      },
      {
        id: 'g-4',
        number: 4,
        timeRange: '1:15 – 1:40',
        blockLabel: 'Innovación SCAMPER',
        title: 'Cuatro mejoras SCAMPER con indicadores medidos',
        subtitle: 'De un prototipo cableado a un sistema clínico autónomo por voz',
        kind: 'scamper',
        kpis: [
          { label: 'Precisión Edge NLP', value: '91,70 %', note: 'S – Sustituir sEMG por voz' },
          { label: 'Latencia BLE', value: '< 20 ms', note: 'E – Eliminar ACK y nube' },
          { label: 'Costo BOM unitario', value: 'S/ 420', note: 'M – Modificar chasis PLA + XL4015' },
        ],
        bullets: [
          'Sustituir sEMG ruidoso por Edge NLP (8 intenciones clínicas en español, inglés y portugués).',
          'Combinar PWM, alerta sonora y sincronización offline-first (IndexedDB + Node.js).',
          'Modificar potencia con XL4015 para erradicar desconexiones BLE por kickback del motor.',
        ],
        deliveryCue: 'Enfatizar el salto de 350 ms a menos de 20 ms ante una palabra de dolor.',
        speechScript:
          'Con SCAMPER transformamos el prototipo en cuatro frentes cuantificados. Sustituimos sensores sEMG costosos por procesamiento de voz local con noventa y uno coma siete por ciento de precisión. Combinamos control motor y registro clínico offline en la misma plataforma. Modificamos la etapa de potencia separando la alimentación del servo mediante XL4015, logrando cero caídas BLE durante dos horas cuarenta y cinco de autonomía. Y eliminamos la dependencia de la nube, bajando la latencia de parada de emergencia a menos de veinte milisegundos cuando el paciente dice "me duele".',
      },
      {
        id: 'g-5',
        number: 5,
        timeRange: '1:40 – 2:00',
        blockLabel: 'Profundización de Rol (Coordinación)',
        title: 'Trazabilidad integral de Design Thinking a Evidencias E00–E21',
        subtitle: 'Articulación del equipo y doble cribado bajo protocolo PRISMA 2020',
        kind: 'roleFocus',
        kpis: [
          { label: 'Registros identificados', value: '820', note: 'Scopus 385 + WoS 245 + SD 190' },
          { label: 'Cribado Lote 1', value: '279', note: 'Ciego por pares con José Casariego' },
          { label: 'Estudios primarios', value: '31 (100 %)', note: 'P01–P31 (2022–2026) + 2 guía' },
        ],
        bullets: [
          'Estructurado siguiendo las revisiones guía Karasheva et al. (2025) y Shafaie et al. (2026).',
          'Los desacuerdos del Lote 1 se resolvieron con criterio PCC y respaldo metodológico Page (2021).',
        ],
        referenceTags: ['G01 Karasheva 2025', 'G02 Shafaie 2026', 'P31 Guo 2022', 'R33 Page 2021'],
        deliveryCue: 'Señalar el flujo ordenado de evidencias E00–E03 hacia el artículo.',
        speechScript:
          'Como coordinador aseguré que cada mejora física de ALMA tuviera respaldo en la literatura y trazabilidad en Drive. Tomando como plantilla estructural las revisiones de Karasheva y Shafaie, aplicamos PRISMA 2020 sobre ochocientos veinte registros de Scopus, Web of Science y ScienceDirect, realizando cribado ciego por pares hasta consolidar treinta y un estudios primarios verificados, cien por ciento publicados entre dos mil veintidós y dos mil veintiséis.',
      },
      {
        id: 'g-6',
        number: 6,
        timeRange: '2:00 – 2:25',
        blockLabel: 'Mercado y Evaluación Financiera',
        title: 'Viabilidad financiera robusta a 5 años (COK 12 %)',
        subtitle: 'Modelo híbrido: venta a clínicas (S/ 1 150) y alquiler domiciliario (S/ 140/mes)',
        kind: 'finance',
        kpis: [
          { label: 'VAN (12 %)', value: 'S/ 9 589,89', note: 'Inversión inicial S/ 24 000' },
          { label: 'TIR', value: '25,16 %', note: 'Supera ampliamente al COK (12 %)' },
          { label: 'Ratio B/C · PRI', value: '1,40 · 3,69 a', note: 'Positivo aun con caída de −20 %' },
        ],
        bullets: [
          'Costo directo BOM S/ 420 (~US$ 112), en línea con Kansal 2023 (US$ 107) y Triwiyanto 2025 (< US$ 100).',
          'En escenario de estrés (−20 % de flujos), el VAN se mantiene en S/ 2 871,91 (TIR 16,16 %).',
        ],
        referenceTags: ['P08 Kansal 2023', 'R02 Triwiyanto 2025', 'R27 Syukriyah 2026'],
        deliveryCue: 'Mostrar los 4 indicadores financieros y la barra de sensibilidad −20 %.',
        speechScript:
          'En términos de negocio, fabricar un exoesqueleto ALMA cuesta cuatrocientos veinte soles frente a más de mil quinientos dólares de alternativas importadas, equiparando referentes de bajo costo como Kansal dos mil veintitrés. Con una inversión inicial de veinticuatro mil soles y un modelo mixto de venta a clínicas a mil ciento cincuenta soles y alquiler domiciliario a ciento cuarenta soles mensuales, obtenemos un VAN de nueve mil quinientos ochenta y nueve soles, una TIR de veinticinco coma dieciséis por ciento, beneficio-costo de uno coma cuarenta y recuperación en tres coma sesenta y nueve años, resistiendo incluso caídas de veinte por ciento.',
      },
      {
        id: 'g-7',
        number: 7,
        timeRange: '2:25 – 2:45',
        blockLabel: 'Impacto Social y ODS',
        title: 'Evidencia PRISMA aplicada a Salud, Innovación e Inclusión',
        subtitle: 'Alineamiento directo con los Objetivos de Desarrollo Sostenible 3, 9 y 10',
        kind: 'impact',
        kpis: [
          { label: 'Reducción de costo', value: '> 85 %', note: 'vs exoesqueleto comercial' },
          { label: 'ODS 3 · 9 · 10', value: '3 metas', note: 'Salud, industria local e inclusión' },
          { label: 'Trazabilidad clínica', value: '100 %', note: 'Alertas automáticas dolor ≥ 7/10' },
        ],
        bullets: [
          'ODS 3: continuidad terapéutica domiciliaria respaldada por Zheng 2025 (ΔFMA-UE +13,34) y Candio 2022.',
          'ODS 9 y 10: manufactura aditiva nacional y acceso para familias de distritos periféricos.',
        ],
        referenceTags: ['P14 Zheng 2025', 'P19 Gonçalves 2026', 'R30 Candio 2022', 'R32 Feigin 2024'],
        deliveryCue: 'Conectar el ahorro económico de la familia con la recuperación funcional.',
        speechScript:
          'La revisión sistemática confirma que la telerehabilitación domiciliaria iguala la eficacia clínica presencial solo cuando el hardware es asequible y motivador. Con ALMA reducimos en más del ochenta y cinco por ciento la barrera de acceso económico, impactando directamente en el ODS tres de salud y bienestar, el ODS nueve de innovación local y el ODS diez al llevar terapia robótica a distritos sin infraestructura hospitalaria.',
      },
      {
        id: 'g-8',
        number: 8,
        timeRange: '2:45 – 3:00',
        blockLabel: 'Cierre y Llamado a la Acción',
        title: 'De prototipo universitario a piloto clínico en Lima Norte',
        subtitle: 'Buscamos aliados clínicos para validación de 20 pacientes en etapa subaguda',
        kind: 'closing',
        kpis: [
          { label: 'Lote piloto requerido', value: '10 equipos', note: 'Inversión validada S/ 24 000' },
          { label: 'Meta clínica', value: '20 pacientes', note: 'Seguimiento FMA-UE 8 semanas' },
          { label: 'Evidencias Drive', value: 'E00 – E21', note: '41 DOIs auditables' },
        ],
        bullets: [
          'Invitamos a centros de fisioterapia e inversionistas de impacto a cofinanciar el piloto clínico.',
          'Todo el código, planos CAD, matriz PRISMA (31 primarios + 8 referentes) y Excel financiero están auditables en Drive.',
        ],
        deliveryCue: 'Sonreír, agradecer con seguridad y mantener contacto visual al cerrar.',
        speechScript:
          'ALMA ya funciona hoy en banco de pruebas con control por voz, aislamiento eléctrico y tablero clínico en tiempo real. Nuestro siguiente paso es desplegar un piloto clínico con diez unidades y veinte pacientes junto a centros de fisioterapia aliados en Lima Norte. Invitamos a clínicas e inversionistas de impacto a sumarse para transformar la rehabilitación post-ACV en un derecho accesible en cada hogar. Muchas gracias.',
      },
    ],
  },

  // =========================================================================
  // 2. ARTHURO F. HERRADA VELA (Metodología PRISMA 2020 y Control ESP32)
  // =========================================================================
  {
    memberId: 'arthuro',
    memberName: 'Arthuro F. Herrada Vela',
    memberCode: 'N00358779',
    roleTitle: 'Metodología PRISMA 2020, Búsqueda Scopus/WoS y Control ESP32',
    slides: [
      {
        id: 'a-1',
        number: 1,
        timeRange: '0:00 – 0:20',
        blockLabel: 'Gancho y Presentación',
        title: '¿Cómo lograr que un exoesqueleto obedezca la voz de un paciente en menos de 20 milisegundos sin fallar por ruido eléctrico?',
        subtitle: 'Proyecto ALMA · Diseño electrónico seguro y protocolo sistemático PRISMA 2020',
        kind: 'cover',
        kpis: [
          { label: 'Latencia BLE', value: '< 20 ms', note: 'Write No Response ESP32' },
          { label: 'Precisión NLP', value: '91,70 %', note: 'Comandos de voz locales' },
          { label: 'Rol en T3', value: 'Metodología', note: 'PRISMA 2020 y Firmware ESP32' },
        ],
        bullets: [
          'En rehabilitación robótica, un retraso o caída inalámbrica ante dolor compromete la articulación.',
          'Soy Arthuro Herrada, responsable del protocolo PRISMA y arquitectura de control en ALMA.',
        ],
        deliveryCue: 'Iniciar con ritmo firme resaltando la cifra de 20 milisegundos.',
        speechScript:
          'Cuando un paciente en rehabilitación dice "me duele, detente", el exoesqueleto no puede esperar medio segundo ni perder conexión inalámbrica por interferencia del motor. Ese desafío de seguridad fue nuestro punto de partida. Soy Arthuro Herrada, encargado de la metodología PRISMA 2020 y del sistema electrónico de ALMA, y en tres minutos les mostraré cómo la evidencia científica respalda nuestra arquitectura segura y rentable.',
      },
      {
        id: 'a-2',
        number: 2,
        timeRange: '0:20 – 0:50',
        blockLabel: 'Problema Real y Empatía (DT)',
        title: 'Dos brechas detectadas en campo: acceso y seguridad',
        subtitle: 'Validación Design Thinking con pacientes post-ACV y fisioterapeutas',
        kind: 'problem',
        kpis: [
          { label: 'Brecha regional', value: '65 %', note: 'Sin terapia continua post-ACV' },
          { label: 'Entrevistas base', value: '6 actores', note: '4 pacientes + 2 especialistas' },
          { label: 'Riesgo clave', value: 'Kickback', note: 'Ruido inductivo en motores' },
        ],
        bullets: [
          'Los pacientes no toleran electrodos EMG complejos ni traslados costosos cada semana.',
          'Los terapeutas exigen garantía de tope angular (90°) y parada de emergencia inmediata.',
        ],
        deliveryCue: 'Explicar brevemente por qué el paciente requiere manos libres.',
        speechScript:
          'A través de Design Thinking entrevistamos a cuatro pacientes y dos fisioterapeutas. Confirmamos que el sesenta y cinco por ciento de afectados queda sin continuidad terapéutica por barreras de traslado, y que las órtesis basadas en señales musculares EMG fallan cuando existe atrofia severa o sudor. Además, los especialistas enfatizaron que cualquier equipo domiciliario debe limitar físicamente la flexión a noventa grados y responder al instante ante el dolor.',
      },
      {
        id: 'a-3',
        number: 3,
        timeRange: '0:50 – 1:15',
        blockLabel: 'Solución Mecatrónica ALMA',
        title: 'Aislamiento galvánico XL4015 + Edge NLP en ESP32',
        subtitle: 'De la interferencia electromagnética a una transmisión BLE estable',
        kind: 'architecture',
        kpis: [
          { label: 'Controlador', value: 'ESP32', note: 'GPIO 13 PWM · GPIO 12 Buzzer' },
          { label: 'Regulación VCC', value: 'XL4015', note: 'Separa lógica 5 V de potencia 11,1 V' },
          { label: 'Sensado', value: 'HX711', note: 'Monitoreo continuo de esfuerzo' },
        ],
        bullets: [
          'Separamos las líneas VCC de batería LiPo (11,1 V) hacia el servo 40 kg·cm y el riel lógico ESP32.',
          'Activamos BLE PROPERTY_WRITE_NR para ráfagas cinemáticas continuas sin bloqueo por ACK.',
          'Control difuso Mamdani ajusta velocidad (1–10) y detiene el actuador ante dolor ≥ 7/10.',
        ],
        deliveryCue: 'Señalar el bloque de aislamiento de potencia en la lámina.',
        speechScript:
          'Para resolver esto diseñamos una arquitectura mecatrónica de cuatro capas. En la etapa electrónica, el ESP32 opera el servomotor de cuarenta kilogramos por centímetro en el pin trece y un buzzer en el pin doce, pero separamos la alimentación mediante un convertidor step-down XL4015. Así eliminamos la fuerza contraelectromotriz que antes tumbaba el Bluetooth, logrando dos coma setenta y cinco horas de autonomía con cero desconexiones y latencia menor a veinte milisegundos.',
      },
      {
        id: 'a-4',
        number: 4,
        timeRange: '1:15 – 1:40',
        blockLabel: 'Innovación SCAMPER',
        title: 'SCAMPER enfocado en control, costo y tiempo real',
        subtitle: 'Sustituir, Combinar, Modificar y Eliminar con métricas verificadas',
        kind: 'scamper',
        kpis: [
          { label: 'S – Sustituir EMG', value: '91,70 %', note: 'Edge NLP en 3 idiomas' },
          { label: 'M – Modificar chasis', value: 'S/ 420', note: 'PLA FDM en Inventor' },
          { label: 'E – Eliminar nube', value: '0 ms net', note: 'Inferencia local offline' },
        ],
        bullets: [
          'Sustituimos EMG por voz + celda HX711, ahorrando electrodos y tiempo de montaje.',
          'Combinamos lógica difusa de seguridad con base IndexedDB y sincronización Node.js.',
        ],
        deliveryCue: 'Contrastar el costo de S/ 420 frente al comercial.',
        speechScript:
          'Aplicamos SCAMPER con indicadores medibles: sustituimos los sensores EMG por un modelo NLP en el borde con noventa y uno coma siete por ciento de precisión; combinamos control PWM, buzzer de alerta y registro offline; modificamos el chasis a PLA impreso en 3D logrando un costo de fabricación de cuatrocientos veinte soles; y eliminamos el procesamiento en la nube para asegurar que la orden de emergencia se ejecute incluso sin conexión a internet.',
      },
      {
        id: 'a-5',
        number: 5,
        timeRange: '1:40 – 2:00',
        blockLabel: 'Profundización de Rol (Metodología PRISMA)',
        title: 'Protocolo replicable Scopus, WoS y ScienceDirect: de 820 a 31 estudios',
        subtitle: 'Cribado doble ciego y concordancia metodológica guiada por Karasheva 2025 y Shafaie 2026',
        kind: 'roleFocus',
        kpis: [
          { label: 'Identificados', value: '820', note: 'Scopus 385 + WoS 245 + SD 190' },
          { label: 'Cribados (L1 + L2)', value: '558', note: '262 duplicados · 468 excluidos' },
          { label: 'Elegibles → Final', value: '85 → 31', note: '54 excluidos (15 rev. sec.)' },
        ],
        bullets: [
          'Cribado en 2 lotes independientes (279 registros c/u) siguiendo Page (2021) y guías G01–G02.',
          'Toro-Ossaba (2024, ESP32+Kalman) y Li (2026, espasticidad sEMG) validan control seguro.',
          'Respaldo difuso por dolor de Abdallah (2024) y hardware 3D Triwiyanto (2025).',
        ],
        referenceTags: ['P21 Toro-Ossaba 2024', 'P09 Li 2026', 'P13 Li 2025', 'R13 Abdallah 2024'],
        deliveryCue: 'Recorrer visualmente las cifras exactas del flujo PRISMA: 820 → 558 → 85 → 31.',
        speechScript:
          'En la revisión sistemática ejecuté ecuaciones booleanas en Scopus, Web of Science y ScienceDirect obteniendo ochocientos veinte registros. Tras eliminar doscientos sesenta y dos duplicados, cribamos en paralelo quinientos cincuenta y ocho resúmenes y evaluamos ochenta y cinco textos completos, consolidando treinta y un estudios primarios con DOI verificable, respaldados metodológicamente por nuestras dos revisiones guía y ocho referentes previos como Abdallah y Triwiyanto.',
      },
      {
        id: 'a-6',
        number: 6,
        timeRange: '2:00 – 2:25',
        blockLabel: 'Mercado y Evaluación Financiera',
        title: 'Rentabilidad demostrada y resiliencia ante estrés del −20 %',
        subtitle: 'Evaluación económica a 5 años con COK del 12 % anual',
        kind: 'finance',
        kpis: [
          { label: 'VAN Base', value: 'S/ 9 589,89', note: 'Inversión S/ 24 000' },
          { label: 'TIR Base', value: '25,16 %', note: 'B/C = 1,40 · PRI = 3,69 años' },
          { label: 'VAN (−20 % flujos)', value: 'S/ 2 871,91', note: 'TIR = 16,16 % (> 12 %)' },
        ],
        bullets: [
          'Precio de venta a clínicas (S/ 1 150) genera 63,5 % de margen bruto unitario.',
          'Alquiler domiciliario (S/ 140/mes) democratiza el acceso cumpliendo umbral Syukriyah (2026).',
        ],
        referenceTags: ['P08 Kansal 2023', 'R27 Syukriyah 2026'],
        deliveryCue: 'Destacar que incluso con 20 % menos ingresos el proyecto sigue siendo viable.',
        speechScript:
          'Desde la evaluación financiera, nuestra inversión inicial de veinticuatro mil soles se recupera en tres coma sesenta y nueve años. El flujo proyectado a cinco años con una tasa de descuento del doce por ciento entrega un VAN de nueve mil quinientos ochenta y nueve soles, una TIR de veinticinco coma dieciséis por ciento y un beneficio-costo de uno coma cuarenta. Incluso simulando una caída severa del veinte por ciento en los ingresos, el VAN sigue siendo positivo con dos mil ochocientos setenta y un soles.',
      },
      {
        id: 'a-7',
        number: 7,
        timeRange: '2:25 – 2:45',
        blockLabel: 'Impacto Social y ODS',
        title: 'Ingeniería segura orientada a ODS 3, 9 y 10',
        subtitle: 'De la clínica centralizada al monitoreo fisioterapéutico remoto',
        kind: 'impact',
        kpis: [
          { label: 'Ahorro familiar', value: '> 80 %', note: 'vs sesiones clínicas presenciales' },
          { label: 'Alertas clínicas', value: 'Dolor ≥ 7', note: 'Notificación automática en API' },
          { label: 'Recientes PRISMA', value: '100 %', note: '31 estudios (2022–2026)' },
        ],
        bullets: [
          'Protección articular (ROM ≤ 90°, Zhang 2025), telerehabilitación multisensor (Li 2026) y equidad.',
        ],
        referenceTags: ['P04 Li 2026', 'P18 Zhang 2025', 'P31 Guo 2022'],
        deliveryCue: 'Pausa breve tras mencionar las alertas automáticas.',
        speechScript:
          'Más allá de los números, cada repetición y reporte de dolor igual o mayor a siete sobre diez genera una alerta automática para el fisioterapeuta, en sintonía con sistemas de telerehabilitación multisensor publicados en dos mil veintiséis. Así unimos el rigor de la ingeniería de control con los ODS tres, nueve y diez.',
      },
      {
        id: 'a-8',
        number: 8,
        timeRange: '2:45 – 3:00',
        blockLabel: 'Cierre y Llamado a la Acción',
        title: 'Arquitectura validada lista para estudio clínico piloto',
        subtitle: 'Hardware estable, protocolo PRISMA (31 primarios + 8 referentes) y modelo rentable',
        kind: 'closing',
        kpis: [
          { label: 'Hardware + App', value: 'Operativo', note: 'ESP32 + Monolito Node.js' },
          { label: 'Próximo hito', value: 'Piloto 10 u.', note: 'Centros aliados Lima Norte' },
        ],
        bullets: [
          'Invitamos a instituciones de salud y centros de investigación UPN a validar el piloto clínico.',
        ],
        deliveryCue: 'Cierre enérgico y seguro dentro de los 3 minutos exactos.',
        speechScript:
          'Con hardware probado, aislamiento eléctrico validado, treinta y un estudios primarios respaldando nuestra metodología y un VAN positivo bajo escenarios adversos, ALMA está listo para su piloto clínico con diez equipos en Lima Norte. Buscamos centros de rehabilitación aliados para iniciar la validación con pacientes este semestre. Muchas gracias.',
      },
    ],
  },

  // =========================================================================
  // 3. JOSÉ E. CASARIEGO VALDEZ (Resultados, Matriz de Extracción y Bibliometría)
  // =========================================================================
  {
    memberId: 'jose',
    memberName: 'José E. Casariego Valdez',
    memberCode: 'N00324605',
    roleTitle: 'Resultados, Matriz de Extracción (31 estudios) y Bibliometría',
    slides: [
      {
        id: 'j-1',
        number: 1,
        timeRange: '0:00 – 0:20',
        blockLabel: 'Gancho y Presentación',
        title: '¿Por qué los exoesqueletos robóticos existentes superan los 1 500 dólares mientras la mayoría de pacientes abandona su terapia en casa?',
        subtitle: 'Proyecto ALMA · Contraste entre 31 estudios primarios + 8 referentes y diseño accesible',
        kind: 'cover',
        kpis: [
          { label: 'Estudios PRISMA', value: '31 DOIs', note: 'P01–P31 (2022–2026)' },
          { label: 'Fuentes totales', value: '41 DOIs', note: '31 primarios + 2 guías + 8 ref.' },
          { label: 'Rol en T3', value: 'Resultados', note: 'Extracción y bibliometría' },
        ],
        bullets: [
          'Analizamos la evidencia internacional para responder qué arquitectura maximiza recuperación y acceso.',
          'Soy José Casariego, responsable de resultados y análisis bibliométrico del proyecto ALMA.',
        ],
        deliveryCue: 'Enfatizar el contraste de precios desde la primera frase.',
        speechScript:
          '¿Por qué, si la robótica de rehabilitación demuestra excelentes resultados clínicos, casi ningún paciente post-ACV en el Perú tiene acceso a un exoesqueleto en casa? La respuesta está en la brecha de costo y complejidad de interfaz. Soy José Casariego, responsable de la matriz de resultados y bibliometría del grupo ALMA, y hoy les presento lo que treinta y un estudios primarios internacionales revelan a favor de nuestra solución.',
      },
      {
        id: 'j-2',
        number: 2,
        timeRange: '0:20 – 0:50',
        blockLabel: 'Problema Real y Empatía (DT)',
        title: 'De la saturación clínica a la frustración en el hogar',
        subtitle: 'Síntesis de entrevistas Design Thinking, Karasheva 2025 y Spits 2022',
        kind: 'problem',
        kpis: [
          { label: 'Déficit atención', value: '65 %', note: 'Pacientes sin terapia continua' },
          { label: 'Entrevistas reales', value: '6 actores', note: 'Mapa de empatía validado' },
          { label: 'Montaje aceptable', value: '< 3 min', note: 'Spits et al. (2022)' },
        ],
        bullets: [
          'Karasheva et al. (2025) confirman que los sensores sEMG fallan ante espasticidad post-ACV.',
          'Spits et al. (2022) demuestran que la autonomía del paciente y montaje < 3 min definen adherencia.',
        ],
        referenceTags: ['G01 Karasheva 2025', 'R31 Spits 2022', 'R32 Feigin 2024'],
        deliveryCue: 'Citar brevemente el hallazgo de autonomía en el hogar.',
        speechScript:
          'Las entrevistas de Design Thinking con cuatro pacientes y dos fisioterapeutas reflejaron exactamente lo que reportan Karasheva en dos mil veinticinco y Spits en dos mil veintidós: el sesenta y cinco por ciento carece de terapia continua, los sensores sEMG presentan variabilidad crítica ante espasticidad y si un equipo toma más de tres minutos en colocarse el paciente abandona el tratamiento.',
      },
      {
        id: 'j-3',
        number: 3,
        timeRange: '0:50 – 1:15',
        blockLabel: 'Solución Mecatrónica ALMA',
        title: 'Diseño biomimético en PLA + Control Vocal + ESP32',
        subtitle: 'Arquitectura mecatrónica alineada con los estándares hallados en Scopus/WoS/ScienceDirect',
        kind: 'architecture',
        kpis: [
          { label: 'Torque efectivo', value: '40 kg·cm', note: 'Flexo-extensión asistida codo' },
          { label: 'Límite ROM seguro', value: '0° – 90°', note: 'Protección cápsula articular' },
          { label: 'Trazabilidad', value: 'JSON + API', note: 'Ángulo, reps y eventos dolor' },
        ],
        bullets: [
          'Estructura modular de 26 piezas en Inventor CAD fabricada por impresión 3D FDM (Ly 2026; Zhang 2026).',
          'Interfaz de voz Edge NLP en español peruano sin electrodos (Guo 2022: −89,6 % parámetros, ~2 ms).',
        ],
        referenceTags: ['P02 Ly 2026', 'P22 Zhang 2026', 'P31 Guo 2022'],
        deliveryCue: 'Mostrar los 4 módulos del sistema ALMA en pantalla.',
        speechScript:
          'ALMA resuelve esa barrera integrando un exoesqueleto ergonómico de codo modelado en Autodesk Inventor e impreso en PLA ligero, accionado por un servomotor de cuarenta kilogramos por centímetro limitado a noventa grados. Al igual que referentes recientes de diseño modular y control por voz, el paciente comanda su rutina hablando en español peruano mientras el servidor clínico Node.js registra cada sesión.',
      },
      {
        id: 'j-4',
        number: 4,
        timeRange: '1:15 – 1:40',
        blockLabel: 'Innovación SCAMPER',
        title: 'Impacto medible de SCAMPER en desempeño y costo',
        subtitle: 'Comparación directa frente a prototipos con sEMG y procesamiento en nube',
        kind: 'scamper',
        kpis: [
          { label: 'Precisión NLP', value: '91,70 %', note: 'Superior a sEMG en atrofia' },
          { label: 'Costo BOM', value: 'S/ 420', note: '~US$ 112 (vs US$ 2 427 Kansal)' },
          { label: 'Autonomía', value: '2,75 h', note: 'Con aislamiento XL4015' },
        ],
        bullets: [
          'Sustituir electrodos sEMG por voz elimina la sensibilidad a espasticidad y sudoración (Karasheva 2025).',
          'Eliminar dependencia cloud reduce la latencia de emergencia a menos de 20 milisegundos.',
        ],
        deliveryCue: 'Hacer énfasis en el 91,70 % de precisión y S/ 420 de costo.',
        speechScript:
          'Mediante SCAMPER validamos cuatro mejoras cuantificables: sustituimos los electrodos EMG por voz local con noventa y uno coma siete por ciento de precisión; combinamos control PWM y registro clínico offline; modificamos la alimentación con regulador XL4015 asegurando dos coma setenta y cinco horas continuas y un BOM de cuatrocientos veinte soles; y eliminamos la nube para garantizar respuesta menor a veinte milisegundos.',
      },
      {
        id: 'j-5',
        number: 5,
        timeRange: '1:40 – 2:05',
        blockLabel: 'Profundización de Rol (Resultados y Bibliometría)',
        title: 'Síntesis bibliométrica de 31 estudios primarios (100 % 2022–2026)',
        subtitle: 'Respuestas cuantitativas a RQ1, RQ2 y RQ3 con mapa de clústeres VOSviewer',
        kind: 'roleFocus',
        kpis: [
          { label: 'Ventana 2022–2026', value: '100 %', note: '31 de 31 estudios incluidos' },
          { label: '3 Clústeres VOS', value: '8 · 13 · 10', note: '3D (25,8%) · Control (41,9%) · IA (32,3%)' },
          { label: 'Costo referencial', value: 'US$ 107 / <$500', note: 'Kansal 2023 · Syukriyah 2026' },
        ],
        bullets: [
          'RQ1: Toro-Ossaba (2024) valida ESP32+Kalman (−40 % RMS); Guo (2022) voz embebida; Zheng (2025) ΔFMA-UE +13,34.',
          'RQ2: Kansal (2023) logra PLA 3D en US$ 107; Syukriyah (2026) y Candio (2022) prueban umbral < US$ 500.',
          'RQ3: Li (2026) detecta espasticidad; Zhang (2025) garantiza cotas seguras; Abdallah (2024) lógica difusa dolor.',
        ],
        referenceTags: ['P21 Toro-Ossaba 2024', 'P31 Guo 2022', 'P14 Zheng 2025', 'P08 Kansal 2023', 'R27 Syukriyah 2026', 'R13 Abdallah 2024'],
        deliveryCue: 'Señalar cómo cada RQ se responde directamente con la matriz de extracción y VOSviewer.',
        speechScript:
          'Al sistematizar los treinta y un estudios primarios incluidos, cien por ciento publicados entre dos mil veintidós y dos mil veintiséis y agrupados en tres clústeres siguiendo la plantilla de Shafaie, obtuvimos tres hallazgos clave. En RQ1, Toro-Ossaba valida el ESP32 en exoesqueleto de codo y Guo demuestra el control por voz ligero en dos milisegundos. En RQ2, Kansal confirma chasis PLA 3D en ciento siete dólares y Syukriyah fija el umbral costo-efectivo bajo quinientos dólares. Y en RQ3, Li, Zhang y Abdallah sustentan nuestras barreras de seguridad.',
      },
      {
        id: 'j-6',
        number: 6,
        timeRange: '2:05 – 2:25',
        blockLabel: 'Mercado y Evaluación Financiera',
        title: 'Indicadores financieros sólidos respaldados por RQ2',
        subtitle: 'Proyección 5 años · Inversión S/ 24 000 · Tasa de descuento 12 %',
        kind: 'finance',
        kpis: [
          { label: 'VAN Base', value: 'S/ 9 589,89', note: 'Flujos positivos desde Año 1' },
          { label: 'TIR · B/C', value: '25,16 % · 1,40', note: 'PRI descontado: 3,69 años' },
          { label: 'Sensibilidad −20 %', value: 'S/ 2 871,91', note: 'TIR 16,16 % (viable)' },
        ],
        bullets: [
          'Modelo B2B2C combina venta clínica (S/ 1 150) y suscripción mensual en hogar (S/ 140), validado con R26/R27.',
        ],
        referenceTags: ['R26 Samkharadze 2026', 'R27 Syukriyah 2026'],
        deliveryCue: 'Mostrar tabla financiera y destacar B/C = 1,40.',
        speechScript:
          'Esta ventaja de costos se traduce en un modelo financiero sólido: con veinticuatro mil soles de inversión inicial y ventas a clínicas más alquiler domiciliario a ciento cuarenta soles al mes, alcanzamos un VAN de nueve mil quinientos ochenta y nueve soles, TIR de veinticinco coma dieciséis por ciento, beneficio-costo de uno coma cuarenta y recuperación en tres coma sesenta y nueve años, manteniéndose rentable incluso ante una caída de veinte por ciento.',
      },
      {
        id: 'j-7',
        number: 7,
        timeRange: '2:25 – 2:45',
        blockLabel: 'Impacto Social y ODS',
        title: 'Impacto cuantificado en acceso y ODS 3, 9 y 10',
        subtitle: 'Devolviendo autonomía motora y trazabilidad médica a la periferia urbana',
        kind: 'impact',
        kpis: [
          { label: 'Costo mensual hogar', value: 'S/ 140', note: 'vs > S/ 540 en traslados/sesiones' },
          { label: 'ODS alineados', value: '3 · 9 · 10', note: 'Bienestar, innovación y equidad' },
        ],
        bullets: [
          'Gonçalves (2026) en Brasil y Candio (2022) respaldan eficacia clínica accesible en el hogar.',
        ],
        referenceTags: ['P19 Gonçalves 2026', 'R30 Candio 2022'],
        deliveryCue: 'Comparar S/ 140 mensual frente al gasto de traslado tradicional.',
        speechScript:
          'Comparado con más de quinientos soles mensuales entre sesiones y transporte, ofrecer ALMA a ciento cuarenta soles al mes democratiza la recuperación post-ACV. Así vinculamos directamente nuestra matriz científica con los ODS tres, nueve y diez.',
      },
      {
        id: 'j-8',
        number: 8,
        timeRange: '2:45 – 3:00',
        blockLabel: 'Cierre y Llamado a la Acción',
        title: 'Evidencia científica + prototipo listo para escalar',
        subtitle: 'Convocamos aliados fisioterapéuticos para ensayo piloto de 8 semanas',
        kind: 'closing',
        kpis: [
          { label: 'Base científica', value: '31 + 8 DOIs', note: 'Matriz auditable en Drive E06–E08' },
          { label: 'Meta piloto', value: '10 equipos', note: 'Validación FMA-UE y adherencia' },
        ],
        bullets: [
          'Buscamos dos clínicas aliadas en Lima para validar métricas FMA-UE (Zheng 2025) durante ocho semanas.',
        ],
        deliveryCue: 'Cerrar con tono seguro y agradecimiento claro.',
        speechScript:
          'Treinta y un estudios primarios, dos revisiones guía y ocho referentes económicos validan nuestra arquitectura, y los números demuestran su sostenibilidad. Hoy buscamos dos clínicas de fisioterapia aliadas para ejecutar nuestro piloto de ocho semanas con diez exoesqueletos ALMA. Muchas gracias.',
      },
    ],
  },

  // =========================================================================
  // 4. HANNS J. MAZA PAREJA (Discusión, Business Model Canvas, Financiero y ODS)
  // =========================================================================
  {
    memberId: 'hanns',
    memberName: 'Hanns J. Maza Pareja',
    memberCode: 'N00309808',
    roleTitle: 'Discusión, Business Model Canvas, Evaluación Financiera y ODS',
    slides: [
      {
        id: 'h-1',
        number: 1,
        timeRange: '0:00 – 0:20',
        blockLabel: 'Gancho y Presentación',
        title: '¿Puede un exoesqueleto robótico de 420 soles resolver una crisis de rehabilitación y ser rentable desde el primer año?',
        subtitle: 'Proyecto ALMA · Modelo de negocio, evaluación financiera y viabilidad ODS',
        kind: 'cover',
        kpis: [
          { label: 'Costo BOM unitario', value: 'S/ 420', note: '~US$ 112 frente a > US$ 1 500' },
          { label: 'TIR del proyecto', value: '25,16 %', note: 'Supera el COK del 12 %' },
          { label: 'Rol en T3', value: 'Negocio y ODS', note: 'Canvas, VAN/TIR/B-C e Impacto' },
        ],
        bullets: [
          'En salud pública, una gran invención técnica fracasa si no es económicamente sostenible.',
          'Soy Hanns Maza, encargado de la evaluación de negocio, finanzas e impacto social de ALMA.',
        ],
        deliveryCue: 'Comenzar con tono ejecutivo y mirada segura a cámara.',
        speechScript:
          '¿Puede un exoesqueleto robótico fabricado con cuatrocientos veinte soles resolver la falta de rehabilitación domiciliaria y generar un negocio sostenible desde el primer año? Soy Hanns Maza, responsable de la evaluación económica, modelo de negocio e impacto ODS del proyecto ALMA en la UPN, y en los próximos tres minutos les demostraré con datos que ingeniería accesible y rentabilidad financiera van de la mano.',
      },
      {
        id: 'h-2',
        number: 2,
        timeRange: '0:20 – 0:50',
        blockLabel: 'Problema Real y Empatía (DT)',
        title: 'Un problema clínico con enorme costo económico familiar',
        subtitle: 'Diagnóstico Design Thinking con 4 pacientes post-ACV y 2 fisioterapeutas',
        kind: 'problem',
        kpis: [
          { label: 'Sin acceso continuo', value: '65 %', note: 'Déficit hospitalario regional' },
          { label: 'Gasto mensual terapia', value: '> S/ 540', note: 'Sesiones + transporte adaptado' },
          { label: 'Tasa de abandono', value: '60 %', note: 'Antes del tercer mes' },
        ],
        bullets: [
          'Las familias asumen altos gastos de traslado y pérdida de horas laborales del cuidador.',
          'Los equipos comerciales importados (> US$ 1 500) son inalcanzables para uso doméstico.',
        ],
        deliveryCue: 'Contrastar el gasto mensual de S/ 540 con la realidad de las familias.',
        speechScript:
          'Durante la fase de empatía entrevistamos a cuatro pacientes post-ACV y dos fisioterapeutas en Lima Norte. Comprobamos que una familia gasta más de quinientos cuarenta soles mensuales solo en traslados y sesiones ambulatorias, lo que explica que el sesenta por ciento abandone la terapia antes del tercer mes. Mientras tanto, los exoesqueletos comerciales superan los mil quinientos dólares, dejando un vacío enorme para el mercado latinoamericano.',
      },
      {
        id: 'h-3',
        number: 3,
        timeRange: '0:50 – 1:15',
        blockLabel: 'Solución Mecatrónica ALMA',
        title: 'Ingeniería frugal con trazabilidad clínica en tiempo real',
        subtitle: 'Prototipo funcional PLA + ESP32 + Edge NLP integrado a backend monolítico',
        kind: 'architecture',
        kpis: [
          { label: 'Hardware base', value: 'ESP32 + 40kg', note: 'ROM 0°–90° · Buzzer seguridad' },
          { label: 'Autonomía', value: '2,75 h', note: 'Aislamiento galvánico XL4015' },
          { label: 'Edge NLP', value: '91,70 %', note: '8 intenciones · Latencia < 20 ms' },
        ],
        bullets: [
          'Chasis modular de 26 piezas en PLA impreso en 3D (Autodesk Inventor).',
          'App con almacenamiento IndexedDB offline y sincronización automática de alertas al terapeuta.',
        ],
        deliveryCue: 'Mostrar los componentes principales y su integración con la plataforma clínica.',
        speechScript:
          'ALMA ataca este problema integrando manufactura aditiva en PLA, un microcontrolador ESP32 con aislamiento de potencia XL4015, un servomotor de cuarenta kilogramos por centímetro limitado a noventa grados y un motor de voz Edge NLP con noventa y uno coma siete por ciento de precisión. Así el paciente entrena en casa hablando con naturalidad y el fisioterapeuta audita repeticiones y alertas de dolor desde nuestro servidor.',
      },
      {
        id: 'h-4',
        number: 4,
        timeRange: '1:15 – 1:40',
        blockLabel: 'Innovación SCAMPER',
        title: 'SCAMPER orientado a reducción de costos y margen bruto',
        subtitle: 'Cómo las decisiones de ingeniería habilitaron un BOM de S/ 420',
        kind: 'scamper',
        kpis: [
          { label: 'BOM total', value: 'S/ 420', note: 'Margen bruto venta 63,5 %' },
          { label: 'Ahorro sensores', value: '−S/ 180', note: 'S – Sustituir sEMG por voz' },
          { label: 'Latencia emergencia', value: '< 20 ms', note: 'E – Eliminar nube en tiempo real' },
        ],
        bullets: [
          'Sustituir sEMG por voz reduce hardware descartable y acelera colocación del equipo.',
          'Modificar carcasa a PLA FDM y aislar VCC con XL4015 evita placas industriales costosas.',
        ],
        deliveryCue: 'Enlazar cada mejora técnica de SCAMPER con el ahorro en soles.',
        speechScript:
          'Cada letra de SCAMPER mejoró directamente nuestra estructura de costos: al sustituir electrodos sEMG por voz ahorramos ciento ochenta soles por equipo; al combinar control y telemetría en un solo ESP32 evitamos placas adicionales; al modificar la estructura a impresión 3D PLA alcanzamos un costo directo de cuatrocientos veinte soles; y al eliminar la dependencia de la nube aseguramos respuesta menor a veinte milisegundos sin pagar servidores costosos.',
      },
      {
        id: 'h-5',
        number: 5,
        timeRange: '1:40 – 2:00',
        blockLabel: 'Profundización de Rol (Canvas y Cadena de Valor)',
        title: 'Modelo de negocio B2B2C y Cadena de Valor integrada',
        subtitle: 'Venta a clínicas (S/ 1 150) + Suscripción domiciliaria (S/ 140/mes)',
        kind: 'roleFocus',
        kpis: [
          { label: 'Venta B2B clínica', value: 'S/ 1 150', note: 'Margen bruto S/ 730 por equipo' },
          { label: 'Alquiler B2C hogar', value: 'S/ 140/mes', note: 'Estadía promedio 6 meses' },
          { label: 'Ahorro vs comercial', value: '> 85 %', note: 'P08 Kansal · R26/R27' },
        ],
        bullets: [
          'Actividades clave: impresión FDM modular (P02 Ly 2026), calibración PWM y telemonitoreo (P04 Li 2026).',
          'Socios clave: clínicas locales, proveedores locales y oficinas municipales OMAPED (respondiendo brecha G02 Shafaie 2026).',
        ],
        referenceTags: ['G02 Shafaie 2026', 'P08 Kansal 2023', 'R26 Samkharadze 2026', 'R27 Syukriyah 2026'],
        deliveryCue: 'Recorrer los dos motores de ingreso del Business Model Canvas.',
        speechScript:
          'Estructuramos un Business Model Canvas de doble flujo que responde a la brecha de sostenibilidad económica señalada por Shafaie en dos mil veintiséis y se valida frente a referentes de bajo costo como Kansal, Samkharadze y Syukriyah. Vendemos unidades completas a clínicas locales a mil ciento cincuenta soles con sesenta y tres coma cinco por ciento de margen bruto, y ofrecemos un plan de alquiler domiciliario de ciento cuarenta soles mensuales con telemonitoreo.',
      },
      {
        id: 'h-6',
        number: 6,
        timeRange: '2:00 – 2:25',
        blockLabel: 'Evaluación Financiera y Sensibilidad',
        title: 'Flujo de Caja 0–5 años (COK 12 %) y Prueba de Estrés',
        subtitle: 'Inversión S/ 24 000 · Flujos crecientes S/ 6 200 a S/ 13 000',
        kind: 'finance',
        kpis: [
          { label: 'VAN Base', value: 'S/ 9 589,89', note: 'Valor presente flujos S/ 33 589,89' },
          { label: 'TIR · B/C', value: '25,16 % · 1,40', note: 'PRI descontado: 3,69 años' },
          { label: 'Estrés −10 % / −20 %', value: 'S/ 6 231 / 2 872', note: 'TIR 20,77 % y 16,16 % (> 12 %)' },
        ],
        bullets: [
          'Inversión S/ 24 000 cubre 2 impresoras 3D, lote piloto de 10 equipos, registro y plataforma.',
          'Incluso ante un escenario pesimista con −20 % en flujos, VAN sigue positivo (B/C = 1,12).',
        ],
        deliveryCue: 'Señalar con claridad la fila de sensibilidad −20 % en la tabla.',
        speechScript:
          'Nuestro modelo financiero a cinco años con una tasa de descuento del doce por ciento parte de veinticuatro mil soles de inversión y flujos netos que crecen de seis mil doscientos a trece mil soles. Obtenemos un VAN base de nueve mil quinientos ochenta y nueve coma ochenta y nueve soles, una TIR de veinticinco coma dieciséis por ciento, relación beneficio-costo de uno coma cuarenta y recupero descontado en tres coma sesenta y nueve años. En sensibilidad, incluso cayendo veinte por ciento los flujos, el VAN es de dos mil ochocientos setenta y un soles y la TIR supera el dieciséis por ciento.',
      },
      {
        id: 'h-7',
        number: 7,
        timeRange: '2:25 – 2:45',
        blockLabel: 'Impacto Social, PRISMA y ODS',
        title: 'Evidencia PRISMA 2020 y contribución cuantificada a ODS',
        subtitle: '31 estudios primarios + 8 referentes respaldan costo-efectividad y adherencia en el hogar',
        kind: 'impact',
        kpis: [
          { label: 'Estudios PRISMA', value: '31 (100 %)', note: 'Publicados entre 2022 y 2026' },
          { label: 'Ahorro paciente', value: '74 % / mes', note: 'S/ 140 alquiler vs > S/ 540 clínica' },
          { label: 'ODS impactados', value: 'ODS 3·9·10', note: 'Salud, innovación e inclusión' },
        ],
        bullets: [
          'Zheng (2025) y Candio (2022) confirman eficacia clínica y menor costo societal en casa.',
          'Democratiza ingeniería biomédica nacional reduciendo desigualdad territorial en salud.',
        ],
        referenceTags: ['P14 Zheng 2025', 'P19 Gonçalves 2026', 'R30 Candio 2022', 'R31 Spits 2022'],
        deliveryCue: 'Resaltar el ahorro del 74 % mensual para las familias.',
        speechScript:
          'Treinta y un estudios primarios revisados bajo PRISMA 2020 y ocho referentes previos respaldan estos números: la rehabilitación domiciliaria mejora la función motora y reduce costos societales cuando el hardware es accesible. Con ALMA una familia ahorra setenta y cuatro por ciento mensual frente a terapia y traslados, materializando los ODS tres, nueve y diez con tecnología mecatrónica peruana.',
      },
      {
        id: 'h-8',
        number: 8,
        timeRange: '2:45 – 3:00',
        blockLabel: 'Cierre y Llamado a la Acción',
        title: 'Inversión de impacto de S/ 24 000 para escalar ALMA',
        subtitle: 'Invitamos a clínicas aliadas e inversionistas semilla al primer lote de 10 equipos',
        kind: 'closing',
        kpis: [
          { label: 'Capital requerido', value: 'S/ 24 000', note: 'Retorno descontado en 3,69 años' },
          { label: 'Respaldo auditable', value: 'E00 – E21', note: '41 DOIs y Excel E12–E13' },
        ],
        bullets: [
          'Listos para iniciar validación clínica en Lima Norte con 20 pacientes y 2 centros aliados.',
        ],
        deliveryCue: 'Finalizar con invitación directa a revisar el Excel financiero y el prototipo.',
        speechScript:
          'Con un prototipo operativo, treinta y un estudios primarios verificados más ocho referentes económicos y una TIR superior al veinticinco por ciento, ALMA demuestra que es posible construir tecnología médica rentable e inclusiva desde el Perú. Invitamos a clínicas de rehabilitación e inversionistas de impacto a financiar nuestro primer lote piloto de diez unidades. Muchas gracias.',
      },
    ],
  },
];
