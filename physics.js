
var cannon = require('cannon');
var constants = require('./constants.js');

var Physics = {

	gravitation: function(body1, body2) {
	    const dist = body1.position.distanceTo(body2.position)
	    const force = ((constants.gravitation * body1.mass * body2.mass) / Math.pow(dist, constants.gravitationFalloff))
	    const forceV = (from, to, length) => from.position.vsub(to.position).unit().scale(length)
	    return [
	      forceV(body2, body1, force),
	      forceV(body1, body2, force)
	    ]
	},

	deg2rad: function deg2rad(degrees) {
	  return degrees * (Math.PI / 180)
	}
}

module.exports = Physics;