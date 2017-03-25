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
		this.render();
	},

	render: function() {
		screen.render();
	},

	rotation: function(quaternion) {
		var target = physics.toEuler(quaternion);
		rotationBox.setContent(
			'heading: ' + pretty(physics.rad2deg(target.y)) + 
			'\nattitude: ' + pretty(target.z) + 
			'\nbank: ' + pretty(target.x));
	
		this.render();
	},

	controls: function(controls) {
		controlBox.setContent(
			'thrust: ' + pretty(controls.thrust) + '\n' +
			'yaw:    ' + pretty(controls.rcs.yaw) + '\n' +
			'pitch:  ' + pretty(controls.rcs.pitch) + '\n' +
			'roll:   ' + pretty(controls.rcs.roll)
		);
		this.render();	
	},

	freeText: function(text) {
		freeTextBox.setContent('' + text);
		this.render();
	}
}


// Create a screen object.
var screen = blessed.screen({
  smartCSR: true,
});

screen.title = 'my window title';



var layout = blessed.layout({
  layout: 'grid',
  top: 'left',
  left: 'up',
  border: 'line',
  style: {
    bg: 'red',
    border: {
      fg: 'blue'
    }
  }});
screen.append(layout);

// Create a box perfectly centered horizontally and vertically.
var distanceBox = blessed.box({
  width: '300',
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
layout.append(distanceBox);


// Create a box perfectly centered horizontally and vertically.
var rotationBox = blessed.box({
	parent: layout,
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
layout.append(rotationBox);

var controlBox = blessed.box({
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
layout.append(controlBox);

var freeTextBox = blessed.box({
  height: '200',
  width: '90%',
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
layout.append(freeTextBox);



screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});
screen.render();



// screen.destroy();
//process.on('exit', function() { distanceBox.setContent("exit"); screen.destroy(); });
//process.on('SIGTERM', function() { screen.destroy(); });


module.exports = ControlBoard;
