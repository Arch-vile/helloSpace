const constants = require('./constants.js');
const physics = require('./physics.js');
const domain = require('./domain.js');
const cannon = require('cannon');
const controlBoard = require('./controlBoard.js');


var rotationStabilizer = {
	current: 0,
	previous: 0,
	currentSpeed: 0,
	previousSpeed: 0,
	propulsionStrength: 0,

	sample: function(rotation,propulsion) {	
		var euler = physics.toEuler(rotation);
		var angle = physics.rad2deg(euler.y);
		this.sampleWithEuler(angle,propulsion);
	},


	sampleWithEuler: function(angle,propulsion) {
		this.previous = this.current;
		this.current = angle;

		var delta = this.current - this.previous;
		if(delta < 0) delta = 360 - delta; 

		this.previousSpeed = this.currentSpeed;
		this.currentSpeed = delta;

		if(propulsion != 0)
			this.propulsionStrength = (1.0 / propulsion) * Math.abs(this.currentSpeed-this.previousSpeed);

	},

	stabilize: function() {
		var fix = (this.currentSpeed / this.propulsionStrength);
		if(fix > 1) fix = 1;
		return -1 * fix;
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
			pitch = -0.1;//rotationStabilizer.stabilize();
			thrust = 0;
		}

		var rotation = worldState.rocket.rotation;


		rotationStabilizer.sample(rotation,pitch);


		controlBoard.rotation(worldState.rocket.rotation);
		controlBoard.distance("Earth", distanceEarthSurface);
		controlBoard.freeText(rotationStabilizer.currentSpeed + '\n' + rotationStabilizer.propulsionStrength );

		var rcs = new domain.Rcs.fromComponents( yaw , pitch , roll);
		var controls = domain.Controls.fromComponents(thrust, rcs);
		controlBoard.controls(controls);

		return controls;
	},

	printRocketRotation: function(rocketState) {
		var target = new cannon.Vec3(0,0,0);
		rocketState.rotation.toEuler(target);
	}
};

module.exports = GroundControl;