import React from 'react';
import io from 'socket.io-client/socket.io';

var socket = io.connect("http://localhost:3000");
var Slider = require("./slider.jsx")
var Settings = React.createClass({
	onChildChange: function(keyname){
		// console.log(keyname)
		socket.emit("updateParams", keyname);
		this.setState(keyname)
	},

	getInitialState: function(){
		return{recording:false, smoothing:this.props.smoothing}
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
	reverse: function(){
			socket.emit("reverse")
			console.log("reverse called!")
	},
	render: function(){
		return (
						<div>
			<div id ="leftPanel">
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
					<b>Smoothing:</b>{stringify(this.state.smoothing)} 
					<Slider inputValue={this.state.smoothing}
							minValue={0}
							maxValue={1}
							name="smoothing"
							stepValue={0.05}
							callback={this.onChildChange} />
					<p />
					
				</div>
				<p />
				<div id="edit">
					<span id='title'>Recording</span><p />
					<button type="button" id="button" onClick={this.startRecording}><b>Record</b></button>  
					<button type="button" id="button" onClick={this.stopRecording}><b>Stop</b></button>
				</div>
			</div>
			<div id="rightPanel">
				<p />
				<div id="edit">
					<span id='title'>Servo settings</span><p />
					<button type="button" id="button" onClick={this.reverse}><b>Reverse</b></button>
					<p />
					<b>Max servo range: {this.props.servoMax}</b>
					<Slider inputValue={this.props.servoMax}
							minValue={0}
							maxValue={360}
							name="servoMax"
							stepValue={1} />
					<p />
					<b>Min. servo range: {this.props.servoMin}</b>
					<Slider inputValue={this.props.servoMin}
							minValue={0}
							maxValue={360}
							name="servoMin"
							stepValue={1} />
					
				</div>
				<p />
				<div id="edit">
					<span id='title'>Motor settings</span><p />
					<button type="button" id="button" onClick={this.reverse}><b>Reverse (unimplemented)</b></button>< p/>
					To-do: implement motor max/min range.
				</div>
			</div>
			</div>
			)

	}
})


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

module.exports = Settings;