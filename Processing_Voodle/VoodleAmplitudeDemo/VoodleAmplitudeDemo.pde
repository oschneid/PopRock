/*
Be Careful with your speaker volume, you might produce a painful 
feedback. We recommend to wear headphones for this example.
*/

import processing.sound.*;
import processing.serial.*;
import cc.arduino.*;

Arduino arduino;
int pin = 9;
int arduinoValue = 15;
long updateInterval = 25; // every updateInterval ms
long lastUpdateTime = 0;

AudioIn input;
Amplitude rms; 

int scale=1;
float smoothRMS = 0;
float maxRMS = 0;

void setup() {
    size(640,360);
    background(255);
        
    //Create an Audio input and grab the 1st channel
    input = new AudioIn(this, 0);
    
    // start the Audio Input
    input.start();
    
    // create a new Amplitude analyzer
    rms = new Amplitude(this);
    
    // Patch the input to an volume analyzer
    rms.input(input);
    
    println(Arduino.list());
    arduino = new Arduino(this, Arduino.list()[1], 57600);
    // if there's no response, double-check you're talking to the
    // right arduino location (see println) 
    arduino.pinMode(pin, Arduino.SERVO);
    lastUpdateTime = millis();
}     


void draw() {
    background(125,255,125);
    
    // adjust the volume of the audio input
    input.amp(4.0);
    
    //smooth input values
    smoothRMS = 0.93 * smoothRMS + 0.07 * rms.analyze();
    //maxRMS = max(smoothRMS, maxRMS);
    //println(maxRMS);
    
    // rms.analyze() return a value between 0 and 1. To adjust
    // the scaling and mapping of an ellipse we scale from 0 to 0.5
    scale=int(map(smoothRMS, 0, 0.5, 1, 350));
    noStroke();
    
    fill(255,0,150);
    // We draw an ellispe coupled to the audio analysis
    ellipse(width/2, height/2, 1*scale, 1*scale);
    
     if (millis() - lastUpdateTime > updateInterval)
    {
      lastUpdateTime = millis();
      // RibBit works best from 15 to 85 degrees
      //arduinoValue += 5;
      //arduinoValue = 15;
      arduinoValue = int(map(smoothRMS, 0, 1, 85, 15));
      if (arduinoValue < 15)
      {
        arduinoValue = 15;
      } else if (arduinoValue > 85) {
        arduinoValue = 85;
      }
      //println(arduinoValue);
      arduino.servoWrite(pin,arduinoValue);
    }
   
}