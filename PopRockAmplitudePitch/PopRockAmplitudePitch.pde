/*
Be Careful with your speaker volume, you might produce a painful 
feedback. We recommend to wear headphones for this example.
*/


import processing.serial.*;
import cc.arduino.*;
import ddf.minim.*;
import ddf.minim.analysis.*;
import ddf.minim.effects.*;
import ddf.minim.signals.*;
import ddf.minim.spi.*;
import ddf.minim.ugens.*;

Arduino arduino;
int pin = 9;
int arduinoValue = 15;
long updateInterval = 25; // every upda  teInterval ms
long lastUpdateTime = 0;

Minim minim;
AudioInput audioin;

int scale=1;
float smoothRMS = 0;
float smoothPitch = 0;
float maxRMS = 0;
float poprockControl = 0;

//for pitch analysis
FFT         fft;
FFT         ifft;
float[] inverseBuffer;
float[] toInverseBuffer;
float   pitchAcc; //used to keep track of pitch

void setup() {
    size(640,360);
    background(255);
        
    minim = new Minim(this);
    
    //gets the audio line in
    audioin = minim.getLineIn();
    
    println(Arduino.list());
    arduino = new Arduino(this, Arduino.list()[0], 57600);
    // if there's no response, double-check you're talking to the
    // right arduino location (see println) 
    arduino.pinMode(pin, Arduino.SERVO);
    lastUpdateTime = millis();
    
    //Initialize fft objects for pitch detection.
    //Each FFT object that has a time-domain buffer that matches the audio input's
    //sample buffer.
    fft = new FFT(audioin.bufferSize(), audioin.sampleRate() );
    ifft = new FFT(audioin.bufferSize(), audioin.sampleRate() );
}     


void draw() {
    background(125,255,125);
    
    // adjust the volume of the audio input
    //input.amp(4);
    
  // perform a forward FFT on the audio input,
  // which contains the mix of both the left and right channels of the file
  fft.forward(audioin.mix);
  
//start of cepstral analysis.
      inverseBuffer = new float[audioin.bufferSize()];
      toInverseBuffer = new float[audioin.bufferSize()];
      //iterate through the bands, take the absolute square log of them and and add each to inverseBuffer[].
      for(int i = 0; i < fft.specSize(); i++)
       {     
        inverseBuffer[i] = log(sq(abs(fft.getBand(i)))); 
       }
      //get the inverse
      ifft.forward(inverseBuffer);
      ifft.inverse(inverseBuffer);
        
      //Identifies the peak band with a "lowpass filter" restricting us to 20 bands as to eliminate
      //noise. Note a typical adult male will have a fundamental frequency from 85 to 180 Hz
      //and a typical adult female from 165 to 255 Hz.
      for(int i = 0; i < 20; i++)
      {
        
        //uncomment this block if you would like a visualization
        //strokeWeight(5);
        //line( i*5, height, i*5, height -  sq(abs(inverseBuffer[i])) );
        
        if (inverseBuffer[i] > pitchAcc){
          pitchAcc = inverseBuffer[i];
        }
      }
//end of cepstral analysis
 
     pitchAcc = map(pitchAcc, 0,100, 0, 12); //maps the pitchAcc to a value between 0-20. pitchAcc is reset after adding values to poprockControl.
   
  
    //smooth input values
    smoothRMS = 0.93 * smoothRMS + 0.07 * (audioin.mix.level()*10); //<>//
    smoothPitch = 0.90 * smoothPitch + 0.10 * pitchAcc ; //<>//
    // rms.analyze() return a value between 0 and 1. To adjust
    // the scaling and mapping of an ellipse we scale from 0 to 0.5
    
    //update poprockController. This is used to modulate the servo.
    //poprockControl = (0.5*smoothRMS)+(0.5*smoothPitch); //<>//
   poprockControl = smoothPitch;
    scale=int(map(poprockControl, 0, 1, 1, 350));
   // println(smoothRMS);
    noStroke();
  
    pitchAcc = 0.0; //resets pitchAcc
  
    fill(255,0,150);
    // We draw an ellispe coupled to the audio analysis
    ellipse(width/2, height/2, 1*scale, 1*scale);
    println(arduinoValue);
     if (millis() - lastUpdateTime > updateInterval)
    {
      lastUpdateTime = millis();
      // RibBit works best from 15 to 85 degrees
      //arduinoValue += 5;
      //arduinoValue = 15;
      arduinoValue = int(map(poprockControl, 0, 1, 85, 15));
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
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
  
   