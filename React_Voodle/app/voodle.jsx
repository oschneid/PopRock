

import React from 'react';

var Settings = React.createClass({
	render: function(){
		return (
			<div id ="settings">
				<div id ="readOut">
					<b>Amplitude:</b> {this.props.amp}
					<p />
					<b>Pitch:</b> {this.props.pitch}

				</div>
				<div id = "gain">
					<b>Amplitude gain: </b>{this.props.amp_gain}
					<p />
					<b>Pitch gain: </b>{this.props.pitch_gain}
					<p />
					<b>Scale factor:</b>{this.props.scaleFactor}
				</div>
			</div>
			)

	}
})

var Voodle = React.createClass({
	render: function(){
		return (


			<div id = "canvas">
			<svg id = "circleContainer">
				<circle cx={window.innerWidth/2} cy={window.innerHeight/2} r={(this.props.mix)*(this.props.scale)} fill="#00FF00" />
			</svg>
			<Settings 	amp={(this.props.amp).toString().substring(0,5)} 
						pitch={(this.props.pitch).toString().substring(0,5)} 
						amp_gain={this.props.amp_gain}
						pitch_gain={this.props.pitch_gain}
						scaleFactor={this.props.scaleFactor}/>
			 
				</div>)
	}

	});





module.exports = Voodle;
