const constants = require('./constants.js');
const physics = require('./physics.js');
const domain = require('./domain.js');

var GroundControl = {
	requestControls: function(worldState) {
		console.log("Fuel remaining: " + worldState.rocket.fuel.volume);
		var thrust = 1;
		if(worldState.rocket.fuel.volume < 50) thrust = 0;
		return domain.Controls.fromComponents(thrust, new domain.Rcs.fromComponents(0.1,0.1,0.1));
	}
};

module.exports = GroundControl;