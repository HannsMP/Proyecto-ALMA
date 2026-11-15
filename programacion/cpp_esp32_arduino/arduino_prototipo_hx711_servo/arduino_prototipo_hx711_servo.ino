#include <Servo.h>
#include "HX711.h"

// Pines del sensor HX711
#define DT 3
#define SCK 2

Servo brazoServo;
HX711 balanza;

float factor_escala = 420;
float umbral_peso = 0.1;  // kg
bool peso_detectado = false;

const int anguloInicial = 0;
const int anguloFinal = 130;
const int velocidad = 20;
const int pausa = 1000;

void setup() {
  Serial.begin(9600);

  // Esperar que el sistema se estabilice tras encendido
  delay(1000);

  // Inicializar HX711
  balanza.begin(DT, SCK);
  delay(500);  // Espera para estabilizar sensor
  balanza.set_scale(factor_escala);
  balanza.tare();  // Calibrar (poner a cero sin peso)

  // Inicializar Servo
  brazoServo.attach(9);
  brazoServo.write(anguloInicial);

  Serial.println("Sistema encendido. Esperando paciente...");
}

void loop() {
  if (!peso_detectado) {
    float peso = balanza.get_units(5);
    Serial.print("Peso detectado: ");
    Serial.print(peso, 3);
    Serial.println(" kg");

    if (peso >= umbral_peso) {
      Serial.println("Paciente detectado. Iniciando en 5 segundos...");
      delay(5000);
      peso_detectado = true;
      Serial.println("Rehabilitación iniciada.");
    }

    delay(200);
  } else {
    // Movimiento continuo
    for (int angulo = anguloInicial; angulo <= anguloFinal; angulo++) {
      brazoServo.write(angulo);
      delay(velocidad);
    }

    delay(pausa);

    for (int angulo = anguloFinal; angulo >= anguloInicial; angulo--) {
      brazoServo.write(angulo);
      delay(velocidad);
    }

    delay(pausa);
  }
}



