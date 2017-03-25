const constants = require('./constants.js');
const physics = require('./physics.js');
const domain = require('./domain.js');
const cannon = require('cannon');
const controlBoard = require('./controlBoard.js');
var sleep = require('sleep');

var rotationStabilizer = {
	current: 0,
	previous: 0,
	currentSpeed: 0,
	previousSpeed: 0,
	propulsionStrength: 0.04774648016449,

	sample: function(rotation,propulsion) {	
		var euler = physics.toEuler(rotation);
		var angle = physics.rad2deg(euler.y);
		this.sampleWithEuler(angle,propulsion);
	},


	sampleWithEuler: function(angle,propulsion) {

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

	},

	stabilize: function() {
		if(Math.abs(this.currentSpeed) < 0.0001)
			return 0;

		var fix = -1 * (this.currentSpeed / this.propulsionStrength);
		if(fix >= 1) {
			fix = 1;
		}
		
		if(fix < -1){ 
			fix = -1;
		}

		return fix;
	}
	


}


var GroundControl = {

	

	requestControls: function(worldState) {
		var thrust = 1;
		var yaw = 0.0;
		var pitch = 0;
		var roll = 0;

		var distanceToEarth = physics.distance(worldState.rocket, worldState.earth());
		var distanceEarthSurface = distanceToEarth - worldState.earth().radius;
		
		if(distanceEarthSurface > 32) {
			thrust = 0;
			yaw = 0;
			roll = 0;
			pitch = 0.8;
		}

		if(distanceEarthSurface > 35) {
			pitch = 0;
		}

		if(distanceEarthSurface > 100) {
			yaw = 0;
			roll = 0;
			pitch = rotationStabilizer.stabilize();
			thrust = 0;
		}

		var rotation = worldState.rocket.rotation;


		rotationStabilizer.sample(rotation,pitch);





		var rcs = new domain.Rcs.fromComponents( yaw , pitch , roll);
		var controls = domain.Controls.fromComponents(thrust, rcs);
		controlBoard.rotation(worldState.rocket.rotation);
		controlBoard.distance("Earth", distanceEarthSurface);
		controlBoard.freeText(rotationStabilizer.currentSpeed + '\n' + rotationStabilizer.propulsionStrength );
		controlBoard.controls(controls);

		return controls;
	},

	printRocketRotation: function(rocketState) {
		var target = new cannon.Vec3(0,0,0);
		rocketState.rotation.toEuler(target);
	}
};


module.exports = GroundControl;