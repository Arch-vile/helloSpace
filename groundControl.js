const constants = require('./constants.js');
const physics = require('./physics.js');
const domain = require('./domain.js');
const cannon = require('cannon');
//const controlBoard = require('./controlBoard.js');
var sleep = require('sleep');

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

	this.stabilize = function(worldState) {
		this.sample(worldState.rocket.rotation);

		if(Math.abs(this.currentSpeed) < 0.0001)
			return 0;

		var fix = -1 * (this.currentSpeed / this.propulsionStrength);
		if(fix >= 1) {
			fix = 1;
		}
		
		if(fix < -1){ 
			fix = -1;
		}

		var rcs = new domain.Rcs.fromComponents( 0.0 , fix , 0.0);
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
		if(this.turnTics < 20) {
			var rcs = new domain.Rcs.fromComponents( 0.0 , 0.9 , 0.0);
			var controls = domain.Controls.fromComponents(0, rcs);
			return controls;
		}

		return next(worldState);
	};

}


var GroundControl = {

	orbitControl: new OrbitControl(),
	stabilizer: new RotationStabilizer(),


	requestControls: function(worldState) {
	
		var controls = this.orbitControl.toOrbit(worldState, () => { return this.stabilizer.stabilize(worldState); } );

		var altitude = physics.distance(worldState.rocket, worldState.earth()) - worldState.earth().radius;

		//controlBoard.rotation(worldState.rocket.rotation);
		//controlBoard.distance("Earth", altitude);
		//controlBoard.freeText(rotationStabilizer.currentSpeed + '\n' + rotationStabilizer.propulsionStrength );
		//controlBoard.controls(controls);

		return controls;
	},


};

module.exports = GroundControl;