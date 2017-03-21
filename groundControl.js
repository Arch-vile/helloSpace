const constants = require('./constants.js');
const physics = require('./physics.js');
const domain = require('./domain.js');

var GroundControl = {
	requestControls: function(worldState) {
		console.log("Fuel remaining: " + worldState.rocket.fuel.volume);
		var thrust = 1;
		var yaw = 1 - (100 / worldState.rocket.fuel.volume);
		var pitch = 0.1;
		var roll = 0.1;
		if(worldState.rocket.fuel.volume < 50) { 
			thrust = 0; 
			yaw = 0; 
			pitch = 0;
			roll = 0;
		}
		return domain.Controls.fromComponents(thrust, new domain.Rcs.fromComponents( yaw , pitch , roll));
	}
};

module.exports = GroundControl;