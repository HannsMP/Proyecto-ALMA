#include <BluetoothSerial.h>      // Librería para habilitar la comunicación Bluetooth en el ESP32.
#include <ESP32Servo.h>           // Librería para controlar servomotores con el ESP32.

BluetoothSerial SerialBT;         // Objeto para manejar la comunicación Bluetooth.
Servo servo;                      // Objeto para controlar el servomotor.

const int servoPin = 13;          // Pin al que está conectado el servomotor.
const int buzzerPin = 12;         // Pin al que está conectado el buzzer (zumbador).

bool moverServo = false;          // Variable de control: indica si el servo debe moverse.
int angulo = 0;                   // Ángulo actual del servomotor.
int direccion = 1;                // Dirección del movimiento: 1 para subir, -1 para bajar.

const int pausa = 500;            // Tiempo de pausa (ms) cuando el servo llega a un extremo.
const int velocidad = 30;         // Velocidad del movimiento del servo (ms de espera entre pasos).

void setup() {
  Serial.begin(115200);                   // Inicia la comunicación por puerto serie para depuración.
  SerialBT.begin("ESP32_Servo");          // Inicia el Bluetooth con el nombre "ESP32_Servo".
  Serial.println("Esperando conexión Bluetooth...");  // Muestra mensaje en el monitor serie.

  servo.setPeriodHertz(50);              // Configura la frecuencia PWM para el servo (50 Hz típico).
  servo.attach(servoPin, 500, 2400);     // Asigna el pin del servo y define el rango de pulso (en microsegundos).
  servo.write(angulo);                   // Posiciona inicialmente el servo en 0°.

  pinMode(buzzerPin, OUTPUT);            // Configura el pin del buzzer como salida.
  digitalWrite(buzzerPin, LOW);          // Asegura que el buzzer inicie apagado.
}

void loop() {
  if (SerialBT.available()) {            // Si hay datos recibidos por Bluetooth...
    char comando = SerialBT.read();      // Lee el carácter recibido.
    Serial.print("Comando recibido: ");  // Imprime el texto "Comando recibido: "
    Serial.println(comando);             // Muestra el comando por el monitor serie.

    if (comando == 'a') {                // Si el comando es 'a'...
      moverServo = true;                 // Activar el movimiento del servo.
    } else if (comando == 'b') {         // Si el comando es 'b'...
      moverServo = false;                // Detener el movimiento.
      servo.write(0);                    // Regresar el servo a la posición 0°.
      digitalWrite(buzzerPin, LOW);      // Apagar el buzzer.
    }
  }

  if (moverServo) {                      // Si se debe mover el servo...
    digitalWrite(buzzerPin, HIGH);       // Encender el buzzer mientras se mueve.

    servo.write(angulo);                 // Mover el servo al ángulo actual.
    delay(velocidad);                    // Esperar para dar tiempo al movimiento.

    angulo += direccion;                 // Ajustar el ángulo en la dirección actual.

    if (angulo >= 90 || angulo <= 0) {   // Verificar si se llegó a un extremo (0° o 90°)
      digitalWrite(buzzerPin, LOW);      // Apagar el buzzer durante la pausa.
      delay(pausa);                      // Esperar antes de cambiar dirección.
      direccion *= -1;                   // Invertir dirección del movimiento.
    }
  } else {
    digitalWrite(buzzerPin, LOW);        // Si no se mueve el servo, buzzer apagado.
  }
}




