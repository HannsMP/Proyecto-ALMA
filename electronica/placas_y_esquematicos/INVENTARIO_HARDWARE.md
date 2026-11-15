# Inventario de Electrónica y Hardware (Proyecto ALMA)

Durante el análisis sistemático de la carpeta `backups/`:
- **Archivos de diseño PCB**: No se encontraron archivos de placas impresas (`.kicad_pcb`, `.sch`, `.brd`, Gerber) en el respaldo original.
- **Diagrama de flujo del sistema**: Movido a `electronica/diagramas_sistema/flujograma_sistema_hardware.png`.
- **Microcontroladores y periféricos identificados en el firmware C++**:
  - **ESP32 (versión final)**: Comunicación Bluetooth Serial (`ESP32_Servo`), Servomotor PWM en **GPIO 13** (50 Hz, 500–2400 µs), Buzzer indicador en **GPIO 12**.
  - **Arduino + Celda de carga HX711 (prototipo inicial)**: Sensor de peso HX711 en pines **DT = 3**, **SCK = 2**; Servomotor en **Pin 9**.
- **Código fuente C++ de estas placas**: Organizado bajo `programacion/cpp_esp32_arduino/` para respetar el contexto de programación monolítica.
