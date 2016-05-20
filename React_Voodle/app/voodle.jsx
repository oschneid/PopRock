import React from 'react';
var Settings = require("./settings.jsx")

var Voodle = React.createClass({
	render: function(){
		if (((this.props.mix)*(this.props.scale))<0){
			var radius = 0.1;
		}
		else
			var radius = (this.props.mix)*(this.props.scale)
		return (
			<div id = "canvas">
			<svg id = "circleContainer">
				<circle cx={window.innerWidth/2} cy={window.innerHeight/2} r={radius} fill="#00FF00" />
			</svg>
			<Settings 	amp={(this.props.amp).toString().substring(0,5)} 
						pitch={(this.props.pitch).toString().substring(0,5)} 
						amp_gain={this.props.amp_gain}
						pitch_gain={this.props.pitch_gain}
						scaleFactor={this.props.scaleFactor}
						smoothing={this.props.smoothing}
						servoMax={this.props.servoMax}
						servoMin={this.props.servoMin} />
			 
			</div>)
	}
});


module.exports = Voodle;
