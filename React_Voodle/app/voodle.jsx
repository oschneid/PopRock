

import React from 'react';

import io from 'socket.io-client/socket.io';
var socket = io.connect("http://localhost:3000");

var Settings = React.createClass({
	render: function(){
		return (
			<div id ="settings">
				<div id ="readOut">
					<b>Amplitude:</b> {this.props.amp}
					<p />
					<b>Pitch:</b> {this.props.pitch}

				</div><p />
				<div id = "edit">
					<b>Amplitude gain: </b>{this.props.amp_gain} <Slider inputValue={this.props.amp_gain}
							minValue={-12}
							maxValue={12}
							name="amp_dB"/>
					<p />
					<b>Pitch gain: </b>{this.props.pitch_gain} <Slider inputValue={this.props.pitch_gain}
							minValue={-12}
							maxValue={12}
							name="pitch_dB"/>
					<p />
					<b>Scale factor:</b>{this.props.scaleFactor} <Slider inputValue={this.props.scaleFactor}
							minValue={0}
							maxValue={12}
							name="scale"/>
					<p />
					
				</div>
			</div>
			)

	}
})

var Slider = React.createClass({
	getInitialState: function() {
	  return {value: this.props.inputValue};
	},
	handleChange: function(event) {
	  this.setState({value: event.target.value});
	  

	  var keyname = {}
	  keyname[this.props.name] = event.target.value

	  socket.emit("updateParams", keyname);
	},
	render: function() {
	  return (

	    <input 
	      className="slider"
	      type="range" 
	      min={this.props.minValue} max={this.props.maxValue} 
	      value={this.state.value} 
	      onChange={this.handleChange}
	      step="1"/>

	  );}
})


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
						scaleFactor={this.props.scaleFactor}/>
			 
				</div>)
	}

	});



module.exports = Voodle;
