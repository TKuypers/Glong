var ws281x = require('rpi-ws281x-native'),
    canvas = require('rpi-ws281x-canvas').create(15,20),
    ctx = canvas.getContext('2d');

var NUM_LEDS = parseInt(300);

ws281x.init(NUM_LEDS);


var globalx = 15;
var vector = -1;
var interval = 120;
var fontsize = 2;
var canvasHeight = 20;
var canvasWidth = 15;



process.on('SIGINT', function () {
  ws281x.reset();
  process.nextTick(function () { process.exit(0); });
});


function banner(label) 
{
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);    
    ctx.fillStyle = '#190000';
    ctx.fillRect (0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = '#FF0000';
    ctx.font = fontsize +'px';
    ctx.textBaseline = 'middle';
    if (globalx < 0 - ctx.measureText(label).width) 
    {
         globalx = canvasWidth;
    }                        
    ctx.fillText(label, globalx, (canvasHeight-fontsize)/2);

    globalx += vector;


    var matrix = [];
    var uintA  = canvas.toUint32Array();

    var row = [];

    for(var i in uintA)
    {
        row.push(uintA[i]);

        if(row.length == 15)
        {
            matrix.push(row);
            row = [];
        }
    }


    var inversed = matrix[0].map(function(col, i) { 
      return matrix.map(function(row) { 
        return row[i] 
      })
    });

    var one_dim = new Uint32Array(300);
    var k = 0;

    for (y = 0; y < 15; y++)
    {
        for (x = 0; x < 20; x++)
        {    
            one_dim[k] = inversed[14-y][x];
            k++;
        }
    }

    console.log('render');
    ws281x.render(one_dim);
}

setInterval(banner, 80, ' HTTP://EXPERTE.ES     ');



