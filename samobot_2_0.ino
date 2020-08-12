// pin ports
#define LED 13
#define SERVO1 4
#define SERVO2 7
#define SENSOR1 5
#define SENSOR2 6
#define BUTTON1 8
#define BUTTON2 12
#define MOTOR1FORWARD 3
#define MOTOR1BACK 11
#define MOTOR2FORWARD 10 // no PWM with Servo
#define MOTOR2BACK 9     // no PWM with Servo

#include <Servo.h>

Servo servo1;
Servo servo2;

int serialNumeric = 0;
char serialCommand = ' ';
int sensor1 = 0;
int sensor2 = 0;
int button1 = 0;
int button2 = 0;


void doCommand(char command, int param) {
  int ret = param;
  switch (command) {
      case 'L': // led
        if(param == 0) {
          digitalWrite(LED, LOW);
        } else {
          digitalWrite(LED, HIGH);
        }
        break;
      case 'S': // SERVO1
          servo1.write(param);
        break;
      case 'C': // SERVO2
          servo2.write(param);
      break;
      case 'D': // MOTOR1
        if(param == 0) {
          digitalWrite(MOTOR1FORWARD, LOW);
          digitalWrite(MOTOR1BACK, LOW);
        } else if(param == 1){
          digitalWrite(MOTOR1FORWARD, HIGH);
          digitalWrite(MOTOR1BACK, LOW);
        } else if(param == 2){
          digitalWrite(MOTOR1FORWARD, LOW);
          digitalWrite(MOTOR1BACK, HIGH);
        } else if(param == 3){
          digitalWrite(MOTOR1FORWARD, HIGH);
          digitalWrite(MOTOR1BACK, HIGH);
        }
      break;
      case 'M': // MOTOR2
        if(param == 0) {
          digitalWrite(MOTOR2FORWARD, LOW);
          digitalWrite(MOTOR2BACK, LOW);
        } else if(param == 1){
          digitalWrite(MOTOR2FORWARD, HIGH);
          digitalWrite(MOTOR2BACK, LOW);
        } else if(param == 2){
          digitalWrite(MOTOR2FORWARD, LOW);
          digitalWrite(MOTOR2BACK, HIGH);
        } else if(param == 3){
          digitalWrite(MOTOR2FORWARD, HIGH);
          digitalWrite(MOTOR2BACK, HIGH);
        }
      break;
      case 'B':
        ret = sensor1 * 1000 + sensor2 * 100 + button1 * 10 + button2;
        sensor1 = 0;
        sensor2 = 0;
        button1 = 0;
        button2 = 0;
      break;
  }
  Serial.print(command);
  Serial.println(String(ret));
}
void usbRead() {
  if (Serial.available() > 0) {
    char i = (char)Serial.read();
    if (i == '\n') {
        doCommand(serialCommand, serialNumeric);
        serialCommand = ' ';
        serialNumeric = 0;
    } else {
        serialCommand = i;
        serialNumeric = Serial.parseInt();
    }
  }
}

void sensorButton() {
  if(digitalRead(SENSOR1) == HIGH) {
    sensor1 = 1;
  }
  if(digitalRead(SENSOR2) == HIGH) {
    sensor2 = 1;
  }
  if(digitalRead(BUTTON1) == HIGH) { // green
    button1 = 1;
  }  
  if(digitalRead(BUTTON2) == LOW) { // red, inverse button
    button2 = 1;
  }  
}

void setup() {
  Serial.begin(9600);
  servo1.attach(SERVO1);
  servo2.attach(SERVO2);
  pinMode(MOTOR1FORWARD, OUTPUT);
  pinMode(MOTOR1BACK, OUTPUT);
  pinMode(MOTOR2FORWARD, OUTPUT);
  pinMode(MOTOR2BACK, OUTPUT);
  
  digitalWrite(LED, HIGH);
  pinMode(LED, OUTPUT);
  pinMode(SENSOR1, INPUT);
  pinMode(SENSOR2, INPUT);
  pinMode(BUTTON1, INPUT);
  pinMode(BUTTON2, INPUT);
}

void loop() {
  usbRead();
  sensorButton();
}
