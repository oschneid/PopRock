import React from 'react';
var Slider = require("./slider.jsx")
var Settings = React.createClass({
	onChildChange: function(keyname){
		this.props.emit("updateParams", keyname);
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
			socket:this.props.socket,
		}
	},
	startRecording: function(){
		if (this.state.recording == false){
			this.props.emit("startRec")
			console.log("startRecording in jsx called!")
		}
		this.setState({recording:true})
	},
	stopRecording: function(){
		if (this.state.recording == true){
			this.props.emit("stopRec")
			console.log("stop rec emit called!")
		}
		this.setState({recording:false})
	},
	reverse: function(){
			this.props.emit("reverse")
			console.log("reverse called!")
	},
	render: function(){
		return (
			<div>
			<div id ="leftPanel">
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