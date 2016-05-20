import React from 'react';
var Settings = require("./settings.jsx")
var io = require('socket.io-client/socket.io');


var Voodle = React.createClass({
	getInitialState: function() {
		return {
			mix:0.0,
			smoothingFactor:0.0,
			scaleFactor:0.0,
			scale:500,
			amp:0.0,
			pitch:0.0,
			socket:{}
		}
	},
	componentDidMount: function() {
		var socket = io.connect("http://localhost:3000");

		socket.on("amp",function(data){
	    	this.setState({amp:data});
		}.bind(this));

		socket.on("pitch", function(f0) {
			this.setState({pitch:f0})
		}.bind(this));

		socket.on("mixdown", function(m){
			this.setState({mix:m});
		}.bind(this))

		this.setState({socket:socket})
	},
	render: function(){
		var radius;
		if ( ((this.state.mix) * (this.state.scale)) < 0) {
			radius = 0.1;
		}
		else {
			radius = (this.state.mix) * (this.state.scale)
		}
		// console.log(radius)
		return (
			<div>
			<div id = "canvas">
				<svg id = "circleContainer">
					<circle cx={window.innerWidth/2} cy={window.innerHeight/2} r={radius} fill="#00FF00" />
				</svg>
				
			</div>
			<div id ="overlay">
					<div id ="readOut">
						<b>Amplitude:</b> {(this.state.amp).toString().substring(0,5)}
						<p />
						<b>Pitch:</b> {(this.state.pitch).toString().substring(0,5)}
					</div>
					<Settings socket={this.state.socket}/>
				</div>
			</div>)
	}
});


module.exports = Voodle;
