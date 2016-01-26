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

FFT fft;
int bands = 512;
float[] spectrum = new float[bands];



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
    
    //and a frequency analyzer
    fft = new FFT(this, bands);
    fft.input(input);
    
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
    smoothRMS = 0.9 * smoothRMS + 0.1 * rms.analyze();    
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
      
      
      fft.analyze(spectrum);
      int maxFreq = 0;
      for(int i = 0; i < bands; i++){
        // The result of the FFT is normalized
        // draw the line for frequency band i scaling it up by 5 to get more amplitude.
        //line( i, height, i, height - spectrum[i]*height*5 );
        if (spectrum[i] > spectrum[maxFreq]) {
          maxFreq = i;
        }
      }
      
      float freq = maxFreq / (float)bands/2 * 44100; //assume sampling at 44.1 kHz
      println(freq);
      println(smoothRMS);
        
      
      // RibBit works best from 15 to 85 degrees
      //arduinoValue += 5;
      //arduinoValue = 15;
      arduinoValue = int(map(freq, 300, 400, 85, 15));
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