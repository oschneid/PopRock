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
		}
	},
	componentDidMount: function() {
		var socket = io.connect("http://localhost:3000");
		socket.on("mixdown", function(m){
			this.setState({mix:m});
		}.bind(this))
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
			<div id = "canvas">
			<svg id = "circleContainer">
				<circle cx={window.innerWidth/2} cy={window.innerHeight/2} r={radius} fill="#00FF00" />
			</svg>
			<Settings />
			 
			</div>)
	}
});


module.exports = Voodle;
