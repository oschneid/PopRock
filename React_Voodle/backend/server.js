var coreAudio = require("node-core-audio");
var pitchFinder = require('pitchfinder');
var express = require('express');
var app = express();
var server = require('http').Server(app);

var io = require('socket.io')(server);
var IoHandler = require('./iohandler.js')
var iohandle = new IoHandler(io);

var fs = require('fs');
var five = require('johnny-five');

var smoothOut = 1;
var gain_for_amp = 0.4; 
var gain_for_pitch = 0.6;
var scaleFactor = 3;

var board = new five.Board();
var servoCreated = false;
var servo;
var servoMax = 85;
var servoMin= 20;
var smoothValue=0.8;
var reverse = false;

var pitch;
var ampRaw;

var detectPitchAMDF = new pitchFinder.AMDF({
	sampleRate:40000,
	minFrequency:5,
	maxFrequency:1200
});

var detectPitchDW = new pitchFinder.DynamicWavelet();
var last = new Date() //imposes a framerate with `var now`

var recording = false
var name;

function main() {
	//set up server
	server.listen(3000);

	app.use(express.static(__dirname + '/dist'));

	app.get('/', function (req, res) {
	  res.sendfile(__dirname + '/index.html');
	});

	app.use(express.static(__dirname + '/css'));

	///////////////////////////////////////////////////////////////
	//start of audio analysis//////////////////////////////////////
	///////////////////////////////////////////////////////////////

	// Create a new audio engine
	var engine = coreAudio.createNewAudioEngine();

		engine.setOptions({
		outputChannels:1,
		inputChannels:1,
		framesPerBuffer:400,
		sampleRate:40000
	});

	engine.addAudioCallback( processAudio );

	//////////listens for updates from frontend/////////////////////////////

	io.on('connection', function (socket) {
		console.log("connected to client!");
	  	socket.on("updateParams", function (data) {
	  		console.log("UpdateParams", data) //remember that this is slightly asynch. with the render loop.
	  		if ('ap_weight' in data){
	  			gain_for_amp = data.ap_weight;
	  			gain_for_pitch = 1-gain_for_amp;
	  		}

	  		if('amp_dB' in data){
	  			gain_for_amp = data["amp_dB"];
	  			console.log("\nnew amp gain: "+gain_for_amp);
	  		}	
	  		if('pitch_dB' in data){
	  			gain_for_pitch = data.pitch_dB;
	  			console.log("\nnew pitch gain: "+gain_for_pitch);
	  		}
	  		if('scale' in data){
	  			scaleFactor = data.scale;
	  			console.log("\nnew scale factor: "+scaleFactor)
	  		}
	  		if('smoothing' in data){
	  			smoothValue = data.smoothing;
	  			console.log("\nnew smooth factor: "+smoothValue)
	  		}
	  		if ('servoMax' in data){
	  			console.log("\nnew max servo range:"+servoMax)
	  			servoMax = data.servoMax;
	  		}
			if ('servoMin' in data){
				console.log("\nnew min servo range:"+servoMin)
				servoMin = data.servoMin;
			}
	 
	  });
	  	socket.on("startRec",function(){
	  		startRecording()
	  	})
	  	socket.on("stopRec", function(){
	  		stopRecording()
	  	})
	  	socket.on("reverse", function(){
	  		reverse = !reverse
	  	})
	});

	board.on("ready", function() {

		servo = new five.Servo({
	    pin: 10,
	    startAt: 90
	  });

	  servoCreated=true;
	});

}

function writeToAudioBufferFile(name, buffer) {
	var out = ''
	buffer.forEach(function(f){
		out = out +'0,' + f + '\n'
	})
	fs.appendFile("./recordings/"+name+"_recording.csv", out, function(err){
		if (err){
			return console.log(err);
		}
	})

}

function handleRecording(buffer){
	if (recording ==  true){
		writeToAudioBufferFile(name, buffer)

	}
}

function startRecording(){
	console.log("start rec. has been called!")
	recording = true;
	var n = new Date()
	name = n.getTime();
}

function stopRecording(){
	recording = false;
	writeParams();
}

function writeParams(){
	var params = {	smoothing:smoothValue, 
					pitchBias:gain_for_pitch,
					scaling:scaleFactor,
					servo_max:servoMax,
					servo_min:servoMin}

	fs.appendFile("./recordings/"+name+"_parameters.json", JSON.stringify(params), function(err){
	if (err){
		return console.log(err);
	}
	console.log("wrote params file!")
	})
}

///////////////////////////////////////////////////////////////
//start of audio analysis//////////////////////////////////////
///////////////////////////////////////////////////////////////

// Add an audio processing callback
// This function accepts an input buffer coming from the sound card,
// and returns an ourput buffer to be sent to your speakers.
//
// Note: This function must return an output buffer
//		if you don't want the function to playback to your speakers,
//		return an array of 0 (maybe).


function processAudio( inputBuffer ) {
	var now = new Date()
	handleRecording(inputBuffer[0])
	//vars `now` and `last` ensures it runs at 30fps
	if ((now-last)>34){	

		ampRaw = Math.abs(Math.max.apply(Math, inputBuffer[0]));

		//start of pitch analysis///////////////////////////////////////////		
		pitch = detectPitchAMDF(inputBuffer[0]);
		if (pitch==null){
			pitch = 0
		}
		else{
			pitch = mapValue(pitch, 0,1000,0,1)
		}
	
		//end of pitch analysis///////////////////////////////////////////
		
		//mixes amplitude and frequency, while scaling it up by scaleFactor.
		var ampPitchMix = (gain_for_amp*ampRaw+gain_for_pitch*pitch)*scaleFactor;
		
		//smooths values
		//Note: smoothValue is a number between 0-1
		smoothOut = smoothValue*smoothOut+(1-smoothValue)*ampPitchMix;
		
		//writes values to arduino
		setArduino(smoothOut);

		//resets timer to impose a framerate
		last = now;
		
		//broadcasts values to frontend
		broadcastValues();

		}

		return inputBuffer;

}

//////////////socket.io emit functions////////////////
function broadcastValues() {
		//applies gain to pitch
		var pitchGain = gain_for_pitch*pitch
			if (pitchGain>1.5) {
				pitchGain = 1.5;
			};

		var ampGain = gain_for_amp*ampRaw
		if (ampGain>1) {
			ampGain = 1;
		};

		iohandle.broadcastAmp(ampGain);
		iohandle.broadcastAmpGain(gain_for_amp)
		iohandle.broadcastPitchGain(gain_for_pitch) 
		iohandle.broadcastMix(smoothOut);
		iohandle.broadcastPitch(pitchGain);
		iohandle.broadcastScale(scaleFactor);
}


//////////////////////////////////////////////////////////////
//Arduino communication code/////////////////////////////////
////////////////////////////////////////////////////////////

function setArduino(smoothOut) {

	if (servoCreated){
		if (reverse){
		//maps the audio input to the servo value range, and calculates the difference
		//so that it moves upwards with increased amplitude.
		servo.to(mapValue(smoothOut, 0, 1, servoMin, servoMax));
		}
		else {
				servo.to(servoMax-mapValue(smoothOut, 0, 1, servoMin, servoMax));
			}
	};
};

function mapValue(value, minIn, maxIn, minOut, maxOut){
	return (value / (maxIn - minIn) )*(maxOut - minOut);
}

///////////////////////////////////////////////////////////////////////////
// RUN MAIN
main()