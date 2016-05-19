import React from 'react';
import io from 'socket.io-client/socket.io';

var socket = io.connect("http://localhost:3000");
console.log("here is a helpful console log")

var Settings = React.createClass({
	onChildChange: function(keyname){
		console.log(keyname)
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
			<div id ="settings">
				<div id ="readOut">
					<b>Amplitude:</b> {this.props.amp}
					<p />
					<b>Pitch:</b> {this.props.pitch}

				</div><p />
				<div id = "edit">
				<span id="title">Settings</span>
				<p />
					{stringify(this.props.amp_gain)} <b>pitch bias</b> 
						<Slider inputValue={0.5}
							minValue={0}
							maxValue={1}
							name="ap_weight"
							stepValue={0.05}
							callback={this.onChildChange}/>
						<b> amp bias </b>{stringify(1.0-this.props.amp_gain)}
					<p />
					<b>Scale factor:</b>{this.props.scaleFactor} 
						<Slider inputValue={this.props.scaleFactor}
							minValue={0}
							maxValue={6}
							name="scale"
							stepValue={1}
							callback={this.onChildChange} />
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
					<b>Recording</b><p />
					<button type="button" id="button" onClick={this.startRecording}><b>Record</b></button>  
					<button type="button" id="button" onClick={this.stopRecording}><b>Stop</b></button>
				</div>
				<p />
				<div id="edit">
					<b>Arduino settings</b><p />
					<button type="button" id="button" onClick={this.reverse}><b>Reverse direction</b></button>
					<p />
					<b>Max servo range: {this.props.servoMax}</b>
					<Slider inputValue={this.props.servoMax}
							minValue={0}
							maxValue={360}
							name="servoMax"
							stepValue={1} 
							callback={this.onChildChange}/>
					<p />
					<b>Min. servo range: {this.props.servoMin}</b>
					<Slider inputValue={this.props.servoMin}
							minValue={0}
							maxValue={360}
							name="servoMin"
							stepValue={1} 
							callback={this.onChildChange}/>
					
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
	  console.log(keyname)
	  socket.emit("updateParams", keyname);

	  this.props.callback(keyname);
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
						smoothing={this.props.smoothing}
						servoMax={this.props.servoMax}
						servoMin={this.props.servoMin} />
			 
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
