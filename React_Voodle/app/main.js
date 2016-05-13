import React from 'react';
var Voodle = require('./voodle.jsx');
require('../css/voodle.css');
var io = require('socket.io-client/socket.io');
var socket = io.connect("http://localhost:3000");
var amp = 0.0;
var pitch = 0;
var amp_gain = 0;
var pitch_gain = 0;
var mix = 0.0;
var visualScaleFactor = 500;
var scaleFactor =0;

socket.on("amp",function(data){
	    amp = data;
	})

socket.on("pitch", function(f0) {
	pitch = f0;
})

socket.on("amp_gain", function(db){
	amp_gain = db;
})

socket.on("pitch_gain", function(db){
	pitch_gain = db;
})

socket.on("mixdown", function(m){
	mix = m;
	
})

socket.on("scale", function(scaling){
	scaleFactor=scaling;
	main()
	})





function main() {
		//console.log("MAIN.JS amp: "+amp)
		React.render(<Voodle 	amp={amp} 
								pitch={pitch}
								amp_gain={amp_gain}
								pitch_gain={pitch_gain} 
								mix={mix}
								scale={visualScaleFactor}
								scaleFactor={scaleFactor} />
								, document.getElementById('app'));
	}