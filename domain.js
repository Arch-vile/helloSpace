var cannon = require('cannon');

function WorldState(args) {
	this.rocket = new RocketState(args.rocket);
	this.planetStates = planets(args.planetStates);

	function planets(args) {
		var planets = [];
		args.forEach(function(state){
			planets.push(new PlanetState(state));
		});
		return planets;
	}
}

WorldState.prototype.earth = function() {
	for(planet of this.planetStates) {
		if(planet.name == "Earth2") {
			return planet;
		}
	}

}

function RocketState(args) {
	this.mass = args.mass;
	this.position = vec3(args.position);
	this.rotation = quaternion(args.rotation);
	this.velocity = vec3(args.velocity);
	this.angularVelocity = vec3(args.angularVelocity);
	this.exploded = args.exploded;
	this.fuel = new Fuel(args.fuel);

}

function Fuel(args) {
	this.mass = args.mass;
	this.volume = args.volume;
}


function PlanetState(args) {
	this.name = args.name;
	this.mass = args.mass;
	this.radius = args.radius;
	this.position = vec3(args.position);
	this.rotation = quaternion(args.rotation);
	this.velocity = vec3(args.velocity);
	this.angularVelocity = vec3(args.angularVelocity);
}

function Controls(args) {
	this.thrust = args.thrust;
	this.rcs = new Rcs(args.rcs);

}

Controls.fromComponents = function(thrust, rcs) {
    return new Controls({thrust: thrust, rcs: rcs});
}


function Rcs(args) {
	this.yaw = args.yaw;
	this.pitch = args.pitch;
	this.roll = args.roll;
}

Rcs.fromComponents = function(yaw,pitch,roll) {
	return new Rcs({yaw: yaw,  pitch: pitch, roll: roll});
}

function vec3(args) {
	return new cannon.Vec3(args.x, args.y, args.z);
}

function quaternion(args) {
	return new cannon.Quaternion(args.x, args.y, args.z, args.w);
}

module.exports.WorldState = WorldState
module.exports.RocketState = RocketState;
module.exports.Fuel = Fuel;
module.exports.PlanetState = PlanetState;
module.exports.Controls = Controls;
module.exports.Rcs = Rcs;