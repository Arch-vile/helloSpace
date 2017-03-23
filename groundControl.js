const constants = require('./constants.js');
const physics = require('./physics.js');
const domain = require('./domain.js');
const cannon = require('cannon');

var GroundControl = {
	requestControls: function(worldState) {
		var thrust = 1;
		//var yaw = 1 - (100 / worldState.rocket.fuel.volume);
		var yaw = 0.0;
		var pitch = 0.0;
		var roll = 0.0;


		if(worldState.rocket.fuel.volume < 30) { 
			yaw = 0.2; 
		}

		if(worldState.rocket.fuel.volume < 20) {
			yaw = 0;
		}

		var distanceToEarth = physics.distance(worldState.rocket, worldState.earth());
		console.log(distanceToEarth);

		//this.printRocketRotation(worldState.rocket);


		return domain.Controls.fromComponents(thrust, new domain.Rcs.fromComponents( yaw , pitch , roll));
	},

	printRocketRotation: function(rocketState) {
		var target = new cannon.Vec3(0,0,0);
		rocketState.rotation.toEuler(target);
	}
};

module.exports = GroundControl;