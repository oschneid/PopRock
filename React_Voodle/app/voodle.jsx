

import React from 'react';

import io from 'socket.io-client/socket.io';
var socket = io.connect("http://localhost:3000");
console.log("here is a helpful console log")

var Settings = React.createClass({
	getInitialState: function(){
		return{recording:false}
	},
	startRecording: function(){
		if (this.state.recording == false){
			socket.emit("startRec")
			console.log("startRecording in jsx called!")
		}
		this.setState({recording:true})
	},
	stopRecording: function(){
		if (this.state.recording == true){
			socket.emit("stopRec")
			console.log("stop rec emit called!")
		}
		this.setState({recording:false})

	},
	render: function(){
		return (
			<div id ="settings">
				<div id ="readOut">
					<b>Amplitude:</b> {this.props.amp}
					<p />
					<b>Pitch:</b> {this.props.pitch}

				</div><p />
				<div id = "edit">
				<span id="title">Settings</span>
				<p />
					{stringify(this.props.amp_gain)} <b>pitch bias</b> <Slider inputValue={0.5}
							minValue={0}
							maxValue={1}
							name="ap_weight"
							stepValue={0.05}/><b> amp bias </b>{stringify(1.0-this.props.amp_gain)}
					<p />
					<b>Scale factor:</b>{this.props.scaleFactor} <Slider inputValue={this.props.scaleFactor}
							minValue={0}
							maxValue={6}
							name="scale"
							stepValue={1} />
					<p />
					<b>Smoothing:</b>{stringify(this.props.smoothing)} <Slider inputValue={this.props.smoothing}
							minValue={0}
							maxValue={1}
							name="smoothing"
							stepValue={0.05} />
					<p />
					
				</div>
				<div id="record_save">
					<button type="button" onClick={this.startRecording}><b>Record</b></button>
					<button type="button" onClick={this.stopRecording}><b>Stop</b></button>
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
	      min={this.props.minValue} 
	      max={this.props.maxValue} 
	      value={this.state.value} 
	      onChange={this.handleChange}
	      step={this.props.stepValue}/>

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
						scaleFactor={this.props.scaleFactor}
						smoothing={this.props.smoothing} />
			 
				</div>)
	}

	});

function stringify(n){
	if (n==0){
		return "0.00"
	}
	else if (n==1){
		return"1.00"
	}
	else if (n.toString().length < 4){
			return n.toString()+"0"
		}
	else {
		return n.toString().substring(0,4)
	}
}

module.exports = Voodle;
