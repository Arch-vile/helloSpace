const constants = require('./constants.js');
const physics = require('./physics.js');
const domain = require('./domain.js');
const cannon = require('cannon');
const numeral = require('numeral');

//const controlBoard = require('./controlBoard.js');
var sleep = require('sleep');


var prettyInt = function(number) {
	return numeral(number).format('0.0');
}


function RotationStabilizer() {
	this.current=0;
	this.previous=0;
	this.currentSpeed=0;
	this.previousSpeed=0;

	// TODO: calc JIT instead of fixed
	this.propulsionStrength=0.04774648016449;

	this.sample = function(rotation) {	
		var euler = physics.toEuler(rotation);
		var angle = physics.rad2deg(euler.y);
		this.sampleWithEuler(angle);
	};


	this.sampleWithEuler = function(angle) {

		this.previous = this.current;
		this.current = angle;

		if(Math.abs(this.previous-this.current) > 180) {
			if(this.previous > this.current) 
				this.previous = this.previous - 360;
			else
				this.previous = this.previous + 360; 
		}


		var delta = this.current - this.previous;
		this.previousSpeed = this.currentSpeed;
		this.currentSpeed = delta;

		//if(propulsion != 0)
		//	this.propulsionStrength = Math.abs((1.0 / propulsion) * Math.abs(this.currentSpeed-this.previousSpeed));

	};

	this.stabilized = false;
	this.stabilize = function(worldState) {
		this.sample(worldState.rocket.rotation);

		if(this.stabilized || Math.abs(this.currentSpeed) < 0.0001) {
			console.log("TEBOIL!");
			this.stabilized = true;
			var rcs = new domain.Rcs.fromComponents( 0.0 , 0.0 , 0.0);
			var controls = domain.Controls.fromComponents(0.0, rcs);
			return controls;
		}

		console.log("orig: " + this.currentSpeed);
		var fix = -1 * (this.currentSpeed / this.propulsionStrength);
		if(fix >= 1) {
			fix = 1;
		}
		
		if(fix < -1){ 
			fix = -1;
		}


		var rcs = new domain.Rcs.fromComponents( 0.0 , 0.0 , 0.0);
		var controls = domain.Controls.fromComponents(0.0, rcs);
		return controls;
	};

}


function OrbitControl() {


	this.toOrbit = function(worldState, next) {
		return this.ascend(worldState, () => { return this.turn(worldState,next) });
	};


	this.altitudeReached=false;
	
	this.ascend = function(worldState, next) {
		var altitude = physics.distance(worldState.rocket, worldState.earth()) - worldState.earth().radius;
		var rcs = new domain.Rcs.fromComponents( 0.0 , 0.0 , 0.0);
		var controls = domain.Controls.fromComponents(0.0, rcs);

		if(this.altitudeReached)
			return next();

		if(altitude < 20) {
			controls.thrust = 1.0;
		} else {
			this.altitudeReached = true;
		}

		return controls;
	};

	this.turnTics=0;
	this.turn = function(worldState,next) {
		
		this.turnTics++;
		var rcs = new domain.Rcs.fromComponents( 0.0 , 0.0 , 0.0);
		var controls = domain.Controls.fromComponents(0, rcs);

		if(this.turnTics < 20) {
			controls.rcs.pitch = 1.0;
			controls.rcs.yaw = 0.0;
			controls.rcs.roll = 0.0;
			return controls;
		}

		if(this.turnTics < 100) {
			return controls;
		}

		return next(worldState);
	};

}


var GroundControl = {

	orbitControl: new OrbitControl(),
	stabilizer: new RotationStabilizer(),


	current: null,
	previous: null,

	requestControls: function(worldState) {


		var rotation = worldState.rocket.rotation;

		this.previous = this.current;
		if(this.previous == null) this.previous = rotation;
		this.current = rotation;

		var dx = this.current.x - this.previous.x;
		var dy = this.current.y - this.previous.y;
		var dz = this.current.z - this.previous.z;
		var dw = this.current.w - this.previous.w;
		var dq = new cannon.Quaternion(dx,dy,dz,dw);
		dq.normalize();
		rotation.normalize();
		
		var conj = physics.conjugate(rotation);
		var ang = physics.qMult( physics.qMultS(2,dq), conj );
		var angEul = physics.toEuler(ang); 

		var degrees = (180-physics.rad2deg(angEul.y))*2;
		console.log("new : " + degrees);

		var controls = this.orbitControl.toOrbit(worldState, () => { return this.stabilizer.stabilize(worldState); } );

		//controlBoard.rotation(worldState.rocket.rotation);
		//controlBoard.distance("Earth", altitude);
		//controlBoard.freeText(rotationStabilizer.currentSpeed + '\n' + rotationStabilizer.propulsionStrength );
		//controlBoard.controls(controls);

		return controls;
	},


};

module.exports = GroundControl;