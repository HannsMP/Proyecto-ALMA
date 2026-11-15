#include "HX711.h"
#include <Servo.h>

#define DT 3
#define SCK 2
#define SERVO_PIN 9

HX711 balanza;
Servo miServo;

float factor_escala = 800;       // Aumenta sensibilidad
float umbral_peso = 0.05;        // 50 gramos
bool deteccion_activada = true;
bool rutina_activa = false;

void setup() {
  Serial.begin(9600);

  balanza.begin(DT, SCK);
  balanza.set_scale(factor_escala);
  balanza.tare();

  miServo.attach(SERVO_PIN);
  miServo.write(0);   // Iniciar brazo totalmente recto
  delay(1000);        // Esperar a que el servo se estabilice

  Serial.println("╔════════════════╦═══════════════╦══════════════════╗");
  Serial.println("║ Lectura Bruta  ║ Peso (kg)     ║ Peso Aprox. (g)  ║");
  Serial.println("╠════════════════╬═══════════════╬══════════════════╣");

  Serial.println("Sistema listo. Esperando al paciente...");
}

void loop() {
  long lectura_bruta = balanza.read();
  float peso_unidades = balanza.get_units(10);     // Lee con más muestras
  float peso_gramos = peso_unidades * 1000;

  // Mostrar tabla de valores
  Serial.print("║ ");
  Serial.print(lectura_bruta);
  Serial.print("     ║     ");
  Serial.print(peso_unidades, 3);
  Serial.print("     ║     ");
  Serial.print(peso_gramos, 1);
  Serial.println(" g     ║");

  if (deteccion_activada) {
    if (peso_unidades >= umbral_peso) {
      Serial.println("Paciente colocado. Esperando 5 segundos...");
      delay(5000);

      float peso_confirmacion = balanza.get_units(10);
      if (peso_confirmacion >= umbral_peso) {
        Serial.println("Iniciando movimiento continuo del brazo...");

        miServo.write(0);  // Asegurar que el brazo está recto
        delay(500);

        deteccion_activada = false;
        rutina_activa = true;
      }
    }
  }

  if (rutina_activa) {
    // Movimiento repetitivo del brazo
    moverServoLento(0, 90);
    delay(1000);
    moverServoLento(90, 0);
    delay(1000);
  }

  delay(1000);
}

void moverServoLento(int desde, int hasta) {
  if (desde < hasta) {
    for (int i = desde; i <= hasta; i++) {
      miServo.write(i);
      delay(15);
    }
  } else {
    for (int i = desde; i >= hasta; i--) {
      miServo.write(i);
      delay(15);
    }
  }
}



