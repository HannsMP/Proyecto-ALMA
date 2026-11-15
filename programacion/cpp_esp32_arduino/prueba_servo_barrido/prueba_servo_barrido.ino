#include <Servo.h>

Servo brazoServo;

// Ajustes de movimiento
const int anguloInicial = 30;     // Evita el extremo 0° donde hay menos control
const int anguloFinal = 130;      // Ángulo máximo seguro, cerca del límite
const int velocidad = 25;         // Más alto = más suave (20 a 30 ideal)
const int pausa = 1000;           // Tiempo para mantener posición (en ms)

void setup() {
  brazoServo.attach(9);
}

void loop() {
  // Flexión: del punto inicial al final
  for (int angulo = anguloInicial; angulo <= anguloFinal; angulo++) {
    brazoServo.write(angulo);
    delay(velocidad);
  }

  delay(pausa);  // Mantener posición flexionada

  // Extensión: regreso al punto inicial
  for (int angulo = anguloFinal; angulo >= anguloInicial; angulo--) {
    brazoServo.write(angulo);
    delay(velocidad);
  }

  delay(pausa);  // Mantener posición extendida
}


