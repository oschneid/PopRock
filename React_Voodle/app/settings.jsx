import React from 'react';
import io from 'socket.io-client/socket.io';

var Slider = require("./slider.jsx")
var Settings = React.createClass({
	componentDidMount: function() {
		var socket = io.connect("http://localhost:3000");
		socket.on("amp",function(data){
	    	this.setState({amp:data});
		}.bind(this));

		socket.on("pitch", function(f0) {
			this.setState({pitch:f0})
		}.bind(this));

		socket.on("amp_gain", function(db){
			this.setState({amp_gain:db});
			
		}.bind(this))

		socket.on("pitch_gain", function(db){
			this.setState({pitch_gain:db});
		}.bind(this))

		this.setState({socket:socket});
	},
	onChildChange: function(keyname){
		// console.log(keyname)
		this.state.socket.emit("updateParams", keyname);
		this.setState(keyname)
	},
	getInitialState: function(){
		return { 
			recording:false, 
			smoothing:0.8,
			amp:0.0,
			pitch:0.0,
			scale:3.0,
			servoMax:85,
			servoMin:20,
			ap_weight:0.0,
		}
	},
	startRecording: function(){
		if (this.state.recording == false){
			this.state.socket.emit("startRec")
			console.log("startRecording in jsx called!")
		}
		this.setState({recording:true})
	},
	stopRecording: function(){
		if (this.state.recording == true){
			this.state.socket.emit("stopRec")
			console.log("stop rec emit called!")
		}
		this.setState({recording:false})
	},
	reverse: function(){
			this.state.socket.emit("reverse")
			console.log("reverse called!")
	},
	render: function(){
		return (
						<div>
			<div id ="leftPanel">
				<div id ="readOut">
					<b>Amplitude:</b> {(this.state.amp).toString().substring(0,5)}
					<p />
					<b>Pitch:</b> {(this.state.pitch).toString().substring(0,5)}

				</div><p />
				<div id = "edit">
				<span id="title">Settings</span>
				<p />
					{stringify(this.state.ap_weight)} <b>pitch bias</b> 
					<Slider inputValue={0.5}
							minValue={0}
							maxValue={1}
							name="ap_weight"
							stepValue={0.05}
							callback={this.onChildChange}/>
					<b> amp bias </b>{stringify(1.0-this.state.ap_weight)}
					<p />
					<b>Scale factor: </b>{this.state.scale} 
					<Slider inputValue={this.state.scale}
							minValue={0}
							maxValue={6}
							name="scale"
							stepValue={1} 
							callback={this.onChildChange}/>
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
					<b>Max servo range: {this.state.servoMax}</b>
					<Slider inputValue={this.state.servoMax}
							minValue={0}
							maxValue={360}
							name="servoMax"
							stepValue={1} 
							callback={this.onChildChange} />
					<p />
					<b>Min. servo range: {this.state.servoMin}</b>
					<Slider inputValue={this.state.servoMin}
							minValue={0}
							maxValue={360}
							name="servoMin"
							stepValue={1}
							callback={this.onChildChange} />
					
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