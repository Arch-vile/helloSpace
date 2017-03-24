var blessed = require('blessed');

var ControlBoard = {

	count: 1,

	distance: function(target,distance) {
		distanceBox.setContent('' + this.count);
		this.count = this.count +1;
		screen.render();
	//	screen.destroy();
	},

}



// Create a screen object.
var screen = blessed.screen({
  smartCSR: true
});


screen.title = 'my window title';

// Create a box perfectly centered horizontally and vertically.
var distanceBox = blessed.box({
  top: 'left',
  left: 'top',
  width: '10%',
  height: '10%',
  content: 'hello',
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
screen.append(distanceBox);
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});
screen.render();


// screen.destroy();
//process.on('exit', function() { distanceBox.setContent("exit"); screen.destroy(); });
//process.on('SIGTERM', function() { screen.destroy(); });


module.exports = ControlBoard;
