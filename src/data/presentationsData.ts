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

export const SLIDE_KIND_LABELS: Record<SlideVisualKind, string> = {
  cover: 'Portada y Gancho Clínico',
  problem: 'Diagnóstico y Empatía (DT)',
  architecture: 'Arquitectura Mecatrónica ALMA',
  scamper: 'Innovación SCAMPER Medida',
  roleFocus: 'Profundización de Rol',
  finance: 'Modelo de Negocio y Finanzas',
  impact: 'Impacto Social y ODS',
  closing: 'Cierre y Piloto Clínico',
};

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
          'Imaginen sobrevivir a un ACV y saber que recuperarán movilidad solo asistiendo 3 veces por semana a terapia durante meses. En el Perú, > 65 % abandona por falta de cupos y traslados mayores a S/ 135 semanales. Soy Gabriel Cadenillas, coordinador de ALMA en la UPN, y hoy les presento nuestro exoesqueleto robótico por voz, viable y validado científicamente.',
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
          'Con Design Thinking entrevistamos a 4 pacientes post-ACV y 2 fisioterapeutas en Lima Norte. Detectamos 2 barreras concretas: los electrodos sEMG fallan por atrofia muscular y sudor, y operar una pantalla con 1 mano frustra al usuario. Por eso definimos nuestro reto: terapia domiciliaria segura por voz natural bajo S/ 1 200.',
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
          'Nuestra arquitectura acopla 4 subsistemas. En mecánica, 26 piezas en PLA impresas en 3D con tope de 0° a 90°. En electrónica, un ESP32 controla el servomotor de 40 kg·cm, buzzer preventivo y celda HX711, aislados mediante regulador XL4015. En software, la app ALMA procesa voz local en español peruano sin depender de internet.',
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
          'Con SCAMPER optimizamos 4 frentes medidos. Sustituimos sEMG por Edge NLP con 91,7 % de precisión en 8 intenciones. Combinamos PWM y registro clínico offline. Modificamos la potencia con XL4015 logrando 2,75 h de autonomía sin caídas BLE y un BOM de S/ 420. Eliminamos la nube, bajando la parada ante dolor a < 20 ms.',
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
          'Como coordinador aseguré trazabilidad integral desde Design Thinking hasta las evidencias E00–E21 en Drive. Siguiendo las revisiones guía de Karasheva (2025) y Shafaie (2026), aplicamos PRISMA 2020 sobre 820 registros de Scopus, WoS y ScienceDirect, cribando por pares hasta consolidar 31 estudios primarios (100 % entre 2022 y 2026).',
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
          'En negocio, fabricar ALMA cuesta S/ 420 frente a > US$ 1 500 de equipos importados, en línea con Kansal (2023). Con S/ 24 000 de inversión, venta a clínicas en S/ 1 150 y alquiler domiciliario a S/ 140/mes, obtenemos a 5 años (COK 12 %) un VAN de S/ 9 589,89, TIR de 25,16 %, B/C de 1,40 y PRI de 3,69 años, viable aun cayendo −20 %.',
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
          'Nuestra revisión sistemática confirma que la telerehabilitación domiciliaria iguala la eficacia clínica cuando el hardware es asequible y seguro. ALMA reduce en > 85 % la barrera de acceso económico, impactando en el ODS 3 de salud, el ODS 9 de manufactura aditiva local y el ODS 10 de inclusión en distritos periféricos.',
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
          'ALMA ya opera en banco de pruebas con control por voz, aislamiento eléctrico y tablero clínico en tiempo real. Invitamos a centros de fisioterapia e inversionistas de impacto a cofinanciar el piloto de 10 unidades para 20 pacientes en Lima Norte. Todas las evidencias están auditables en Drive. Muchas gracias.',
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
          'Cuando un paciente dice "me duele, detente", el exoesqueleto no puede demorar 500 ms ni perder Bluetooth por ruido del motor. Ese reto de seguridad fue nuestro punto de partida. Soy Arthuro Herrada, encargado del protocolo PRISMA 2020 y firmware ESP32 en ALMA, y les mostraré nuestra arquitectura segura y rentable.',
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
          'En Design Thinking entrevistamos a 4 pacientes y 2 fisioterapeutas. Confirmamos que el 65 % queda sin terapia continua por costos de traslado, y que los electrodos EMG fallan con atrofia muscular o sudor. Además, los especialistas exigieron tope mecánico a 90° y parada inmediata ante dolor.',
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
          'Diseñamos 4 capas mecatrónicas. El ESP32 gobierna el servo de 40 kg·cm en GPIO 13 y el buzzer en GPIO 12, aislando los 11,1 V de potencia respecto al riel lógico de 5 V con un regulador XL4015. Así eliminamos el ruido inductivo, alcanzando 2,75 h de autonomía y latencia BLE < 20 ms.',
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
          'Aplicamos SCAMPER con métricas verificadas: sustituimos EMG por Edge NLP en 3 idiomas con 91,7 % de precisión; combinamos control difuso y registro offline en IndexedDB; modificamos el chasis a PLA FDM logrando un BOM de S/ 420; y eliminamos la nube para garantizar respuesta inmediata sin internet.',
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
          'En metodología PRISMA ejecuté ecuaciones booleanas en Scopus (385), WoS (245) y ScienceDirect (190), sumando 820 registros. Eliminados 262 duplicados, cribamos en doble ciego 558 resúmenes y evaluamos 85 textos completos hasta consolidar 31 estudios primarios con DOI, respaldados por 2 guías y 8 referentes como Abdallah (2024) y Triwiyanto (2025).',
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
          'En evaluación financiera a 5 años (COK 12 %), nuestra inversión de S/ 24 000 se recupera en 3,69 años. La venta clínica a S/ 1 150 (63,5 % margen) más el alquiler a S/ 140/mes generan un VAN de S/ 9 589,89, TIR de 25,16 % y B/C de 1,40; incluso ante estrés de −20 %, el VAN sigue en S/ 2 871,91 (TIR 16,16 %).',
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
          'Cada repetición y reporte de dolor ≥ 7/10 detiene el actuador y dispara una alerta automática al fisioterapeuta, alineado con sistemas multisensor de 2026. Así unimos el control seguro en > 80 % de ahorro familiar con los ODS 3, 9 y 10.',
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
          'Con hardware validado, aislamiento eléctrico probado, 31 estudios primarios y VAN positivo bajo estrés, ALMA está listo para desplegar 10 unidades piloto en Lima Norte. Buscamos centros aliados para iniciar ensayos clínicos este semestre. Muchas gracias.',
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
          '¿Por qué, si la robótica clínica funciona, casi ningún paciente post-ACV accede a un exoesqueleto en casa? La brecha está en precios > US$ 1 500 y sensores complejos. Soy José Casariego, responsable de resultados y bibliometría en ALMA, y hoy resumo lo que 31 estudios primarios y 8 referentes respaldan.',
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
          'Las entrevistas con 4 pacientes y 2 terapeutas reflejaron exactamente lo reportado por Karasheva (2025) y Spits (2022): el 65 % carece de terapia continua, los electrodos sEMG fallan ante espasticidad y, si la colocación supera los 3 min, el paciente abandona el tratamiento.',
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
          'ALMA integra 26 piezas biomiméticas en PLA impresas en 3D con un servomotor de 40 kg·cm limitado de 0° a 90°. Siguiendo referentes de diseño modular (Ly 2026) y control vocal ligero (Guo 2022, ~2 ms), el paciente comanda su rutina en español peruano con trazabilidad directa en API Node.js.',
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
          'Mediante SCAMPER validamos 4 mejoras cuantificables: sustituimos sEMG por voz local con 91,7 % de precisión; combinamos PWM y registro offline; modificamos la potencia con XL4015 logrando 2,75 h de autonomía y BOM de S/ 420 (~US$ 112); y eliminamos la nube logrando respuesta < 20 ms.',
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
          'Al sintetizar los 31 estudios primarios (100 % publicados entre 2022 y 2026) en 3 clústeres VOSviewer según Shafaie (2026), respondimos nuestras 3 preguntas: en RQ1, Toro-Ossaba (2024) valida ESP32, Guo (2022) voz embebida y Zheng (2025) ΔFMA-UE +13,34; en RQ2, Kansal (2023) logra PLA en US$ 107 y Syukriyah (2026) fija umbral < US$ 500; y en RQ3, Li (2026), Zhang (2025) y Abdallah (2024) respaldan seguridad.',
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
          'Esta ventaja de costos sustenta la proyección a 5 años (COK 12 %): con S/ 24 000 de inversión, venta clínica a S/ 1 150 y alquiler a S/ 140/mes, logramos VAN de S/ 9 589,89, TIR de 25,16 %, B/C de 1,40 y PRI de 3,69 años, manteniendo VAN positivo (S/ 2 871,91) aun cayendo −20 %.',
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
          'Frente a > S/ 540 mensuales entre sesiones y traslados, alquilar ALMA a S/ 140/mes democratiza la recuperación en casa y concreta los ODS 3, 9 y 10.',
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
          '31 estudios primarios, 2 guías y 8 referentes económicos respaldan nuestra arquitectura. Buscamos 2 clínicas aliadas en Lima para validar métricas FMA-UE durante 8 semanas con 10 exoesqueletos ALMA. Muchas gracias.',
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
          '¿Puede un exoesqueleto robótico de S/ 420 resolver la crisis de rehabilitación domiciliaria y ser rentable desde el Año 1? Soy Hanns Maza, encargado del modelo de negocio, finanzas e impacto ODS en ALMA, y en 3 minutos les demostraré con cifras que ingeniería accesible y rentabilidad van de la mano.',
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
          'En Design Thinking entrevistamos a 4 pacientes post-ACV y 2 fisioterapeutas en Lima Norte. Confirmamos que el 65 % carece de terapia continua y cada familia gasta > S/ 540 mensuales entre sesiones y traslados, causando un 60 % de abandono antes del mes 3. Los equipos comerciales (> US$ 1 500) son inalcanzables.',
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
          'ALMA resuelve esta brecha integrando 26 piezas PLA impresas en 3D, un ESP32 con aislamiento XL4015, un actuador de 40 kg·cm limitado de 0° a 90° y Edge NLP con 91,7 % de precisión y < 20 ms de latencia. El paciente entrena por voz en casa mientras el terapeuta audita alertas online u offline.',
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
          'Cada mejora SCAMPER optimizó nuestros costos: al sustituir electrodos sEMG por voz ahorramos S/ 180 por unidad; al combinar control y telemetría en 1 ESP32 evitamos placas extra; al modificar el chasis a PLA FDM logramos un BOM de S/ 420 (63,5 % margen); y al eliminar la nube operamos sin cuotas costosas.',
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
          'Diseñamos un Business Model Canvas B2B2C que responde a la brecha económica de Shafaie (2026) y se alinea con referentes como Kansal (2023), Samkharadze (2026) y Syukriyah (2026). Vendemos equipos a clínicas a S/ 1 150 con S/ 730 de margen bruto, y ofrecemos alquiler domiciliario a S/ 140/mes con telemonitoreo clínico.',
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
          'Nuestro modelo financiero a 5 años, evaluado al 12 % de COK, parte de S/ 24 000 de inversión para 2 impresoras 3D, 10 equipos piloto y plataforma, con flujos netos crecientes de S/ 6 200 a S/ 13 000. Obtenemos un VAN base de S/ 9 589,89, TIR de 25,16 %, B/C de 1,40 y PRI descontado de 3,69 años. Incluso en escenario pesimista de −20 %, el VAN es S/ 2 871,91 y la TIR de 16,16 %.',
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
          'Esta viabilidad se apoya en 31 estudios primarios PRISMA 2020 (2022–2026) y 8 referentes: la telerehabilitación accesible mejora la recuperación motora y baja costos sociales. Con ALMA cada familia ahorra 74 % mensual (S/ 140 frente a > S/ 540), materializando los ODS 3, 9 y 10.',
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
          'Con prototipo operativo, 41 DOIs verificables y TIR de 25,16 %, demostramos que es viable crear tecnología médica rentable e inclusiva en el Perú. Invitamos a clínicas e inversionistas a financiar el piloto de 10 equipos para 20 pacientes en Lima Norte. Muchas gracias.',
      },
    ],
  },
];
