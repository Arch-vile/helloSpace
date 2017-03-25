const blessed = require('blessed');
const numeral = require('numeral');
const cannon = require('cannon');
const physics = require('./physics.js');

var pretty = function(number) {
	return numeral(number).format('0,0.000');
}

var ControlBoard = {
	distance: function(target,distance) {
		distanceBox.setContent(target + ": " + pretty(distance));
		screen.render();
	},

	rotation: function(quaternion) {
		var target = physics.toEuler(quaternion);
		rotationBox.setContent(
			'heading: ' + pretty(physics.rad2deg(target.y)) + 
			'\nattitude: ' + pretty(target.z) + 
			'\nbank: ' + pretty(target.x));
	
		screen.render();
	},

	controls: function(controls) {
		controlBox.setContent(
			'thrust: ' + controls.thrust + '\n' +
			'yaw:    ' + controls.rcs.yaw + '\n' +
			'pitch:  ' + controls.rcs.pitch + '\n' +
			'roll:   ' + controls.rcs.roll
		);	
	},

	freeText: function(text) {
		freeTextBox.setContent('' + text);
		screen.render();
	}
}


// Create a screen object.
var screen = blessed.screen({
  smartCSR: true,
});

screen.title = 'my window title';

// Create a box perfectly centered horizontally and vertically.
var distanceBox = blessed.box({
  top: '0',
  width: '200',
  height: '200',
  content: '<distances>',
  label: 'Distances',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'green'
    }
  }
});



// Create a box perfectly centered horizontally and vertically.
var rotationBox = blessed.box({
  top: '200',
  width: '200',
  height: '200',
  content: '<rotations>',
  label: 'Rocket rotation (e)',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'green'
    }
  }
});

var controlBox = blessed.box({
  top: '0',
  left: '200',
  width: '200',
  height: '250',
  content: '<controls>',
  label: 'Rocket controls',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'green'
    }
  }
});


var freeTextBox = blessed.box({
  top: '400',
  width: '600',
  height: '200',
  content: '<free>',
  label: 'Free box',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'green'
    }
  }
});



screen.append(rotationBox);
screen.append(distanceBox);
screen.append(freeTextBox);
screen.append(controlBox);

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});
screen.render();



// screen.destroy();
//process.on('exit', function() { distanceBox.setContent("exit"); screen.destroy(); });
//process.on('SIGTERM', function() { screen.destroy(); });


module.exports = ControlBoard;
