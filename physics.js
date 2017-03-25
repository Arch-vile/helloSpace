
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

	distance: function(body1, body2) {
		return body1.position.distanceTo(body2.position);
	},

	rad2deg: function (rad) {
		if(rad < 0)
			rad = 2*Math.PI + rad; 
	  return rad * (180 / Math.PI);
	},

	toEuler: function(quaternion) {
		var target = new cannon.Vec3(0,0,0);
		quaternion.toEuler(target);
		return target;
	},

	

	
}

module.exports = Physics;



	// roll (x-axis rotation)
/*	var t0 = +2.0 * (q.w * q.x + q.y * q.z);
	var t1 = +1.0 - 2.0 * (q.x * q.x + ysqr);
	var roll = Math.atan2(t0, t1);

	// pitch (y-axis rotation)
	var t2 = +2.0 * (q.w * q.y - q.z * q.x);
	t2 = t2 > 1.0 ? 1.0 : t2;
	t2 = t2 < -1.0 ? -1.0 : t2;
	var pitch = Math.asin(t2);

	// yaw (z-axis rotation)
	var t3 = +2.0 * (q.w * q.z + q.x * q.y);
	var t4 = +1.0 - 2.0 * (ysqr + q.z * q.z);  
	var yaw = Math.atan2(t3, t4);
	rotationBox.setContent('' + roll + '\n' + pitch + '\n' + yaw);

*/