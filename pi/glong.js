var ws281x = require('./../node_modules/rpi-ws281x-native/lib/ws281x-native');


var NUM_LEDS = parseInt(300, 10) || 10,
    pixelData = new Uint32Array(NUM_LEDS);

ws281x.init(NUM_LEDS);

// ---- trap the SIGINT and reset before exit
process.on('SIGINT', function () {
  ws281x.reset();
  process.nextTick(function () { process.exit(0); });
});


var io = null;

//create starting matrix
var matrix =
[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

//create the canvas
//var canvas = document.createElement('canvas');
//var width = 270;
//var height = 200;
//canvas.width = width;
//canvas.height = height;
//var context = canvas.getContext('2d');

//canvas.style.border   = "1px solid";

//var body = document.getElementsByTagName("body")[0];
//body.appendChild(canvas);

        // KEY HANDLES
//        var keyPressed = false;
//        var downPressed = false;
//        var upPressed = false;

//        document.addEventListener("keydown", keyDownHandler, false);
//        document.addEventListener("keyup", keyUpHandler, false);

//create the red & blue paddle & ball
var redPaddle = {
    posY: 8,
    blocks: 4
};
var bluePaddle = {
    posY: 8,
    blocks: 4
};

var ball = {
    posX: 7,
    posY: 10,
    speedY: 1,
    direction: 1,
    steps: null,
    speed: null
};


var countdownCounter;;
var countdown = null;

var game = {
    steps: 50,
    score: 0,
    fps: 12,
    init: function()
    {
        if(gameLoopInterval != null) 
        {
            clearInterval(gameLoopInterval);
            gameLoopInterval = null;
        }

        clearMatrix();


        if(countdown == null)
        {
            countdown = setInterval(countdownLoop, 1000);
        }

        game.steps = 50;
        game.score = 0;
        game.fps = 12; 

        countdownCounter = 5;

        redPaddle.posY  = 8;
        bluePaddle.posY = 8;

        ball = {
            posX: 7,
            posY: 10,
            speedY: 1,
            direction: 1,
            steps: 4,
            speed: 4
        };    

        console.log('init:'+new Date());

    },

    end : function()
    {
        if(gameLoopInterval != null) 
        {
            clearInterval(gameLoopInterval);
            gameLoopInterval = null;
        }

        explosion();

        setTimeout(function()
        {
            io.emit('game.end', {score:game.score});
        }, 2000);
    },


    pause: function()
    {
        if(gameLoopInterval != null) 
        {
            clearInterval(gameLoopInterval);
            gameLoopInterval = null;
        }

        if(countdown != null) 
        {
            clearInterval(countdown);
            countdown = null;
        }
    },
};


var gameLoopInterval = null;

var countdownLoop = function() {

    updateCountdown();
    countdownCounter--;

    if (countdownCounter < 0) 
    {
        if(countdown != null)
        {
            clearInterval(countdown);
            countdown = null;
        }
        gameLoopInterval = setInterval(gameLoop, (1/game.fps)*1000);
    }

    reparseMatrix();
    one_dim_matrix();
    translateToLED();
}





var idleInterval = function()
{
    var step = 0;
    setInterval(function()
    {
        if(gameLoopInterval == null && countdown == null && explosionInterval == null)
        {
            clearMatrix();

            matrix = JSON.parse(JSON.stringify(idle[step]));

            reparseMatrix();
            one_dim_matrix();
            translateToLED();

            step = (step < (idle.length-1)) ? (step+1) : 0;
        }

    }, 100);
};

idleInterval();






function updateCountdown()
{
    for (y = 0; y < 12; y++)
    {    
        for (x = 0; x < 6; x++)
        {
            if (countdownCounter == 5) { matrix[y+4][x+4] = number5[y][x]; };
            if (countdownCounter == 4) { matrix[y+4][x+4] = number4[y][x]; };
            if (countdownCounter == 3) { matrix[y+4][x+4] = number3[y][x]; };
            if (countdownCounter == 2) { matrix[y+4][x+4] = number2[y][x]; };
            if (countdownCounter == 1) { matrix[y+4][x+4] = number1[y][x]; };
            if (countdownCounter == 0) { matrix[y+4][x+4] = number0[y][x]; };
        }
    }
}


var explosionInterval = null;
var explosionCounter  = 10;

var explosion = function()
{  
    explosionCounter = 10;
    explosionInterval = setInterval(explosionLoop, 200);
};

var explosionStatus  = 0;

function explosionLoop()
{
    clearMatrix();

    if (explosionStatus == 0)
    {
        for (y = 0; y < 20; y++)
        {    
            for (x = 0; x < 15; x++)
            {
                if(y % 2 == true)
                {
                    matrix[y][x] = 4;
                }
            }
        }
        explosionStatus = 1;        
    }
    else if (explosionStatus == 1)
    {
        for (y = 0; y < 20; y++)
        {    
            for (x = 0; x < 15; x++)
            {
                if(y % 2 == true)
                {
                    matrix[y][x] = 1;
                }
            }
        }
        explosionStatus = 0;        
    }

    explosionCounter--;

    if (explosionCounter <= 0) 
    {
        for (y = 0; y < 20; y++)
        {    
            for (x = 0; x < 15; x++)
            {
                matrix[y][x] = 0;
            }
        }

        if(explosionInterval != null)
        {
            clearInterval(explosionInterval);
            explosionInterval = null;
        }
    }

    reparseMatrix();
    one_dim_matrix();
    translateToLED();
}




//starting the gameloop

function gameLoop()
{
    clearMatrix();
    updateBall();
    updateCounter(game.score);
    updateScore();
    updateMatrix();
    reparseMatrix();
    one_dim_matrix();
    translateToLED();
}



function translateToLED()
{
  for (var i = 0; i < NUM_LEDS; i++)
  {
    pixelData[i] = one_dim[i];
  }

  ws281x.render(pixelData);
}


function updateBall()
{
    ball.steps--;
    if (ball.steps == 0)
    {
        moveBall();
        ball.steps = ball.speed;
    }
}


var addToScore = function()
{
    game.score++;

    if(game.score > 0 && game.score % 5 == 0)
    {
        if(ball.speed > 1)
        {
            ball.speed--;
        }
    }

    io.emit('game.bloop');
}


function moveBall()
{
    if ( ball.posX == 1 && ball.posY >= redPaddle.posY && ball.posY < redPaddle.posY+redPaddle.blocks )
    {
        ball.direction = 1;
        if (ball.posY == redPaddle.posY) {
            ball.speedY = -1;
        }
        else if (ball.posY == redPaddle.posY + (redPaddle.blocks-1)) {
            ball.speedY = 1;
        }

        addToScore();
    }
    if ( ball.posX == 13 && ball.posY >= bluePaddle.posY && ball.posY < bluePaddle.posY+bluePaddle.blocks  )
    {
        ball.direction = 0;
        if (ball.posY == bluePaddle.posY) {
            ball.speedY = -1;
        }
        else if (ball.posY == bluePaddle.posY + (bluePaddle.blocks-1)) {
            ball.speedY = 1;
        }

        addToScore();
    }



  
    if ( ball.direction == 1 )
    {
        ball.posX++;
    }
    if ( ball.direction == 0 )
    {
        ball.posX--;
    }
    
    ball.posY = ball.posY + ball.speedY;


    if ( ball.posX < 0 || ball.posX > 14)
    {
        game.end();
        console.log('game over:'+game.score);
    }

    
    if ( ball.posY <= 0 || ball.posY >= 19)
    {
        ball.speedY = ball.speedY *-1;
    }
    
    if ( ball.posY > 19) {
      ball.posY = 19;
    }
    if ( ball.posY < 0 ) {
      ball.posY = 0;
    }
}


function clearMatrix()
{
    for (y = 0; y < 20; y++)
    {    
        for (x = 0; x < 15; x++)
        {
            matrix[y][x] = 0;
        }
    }
}
        
function updateMatrix()
{
    //update ball
    if(typeof matrix[ball.posY] != 'undefined')
    {
      matrix[ball.posY][ball.posX] = 3;
    }
    
    //update paddles
    for (y = 0; y < redPaddle.blocks; y++)
    {
        matrix[redPaddle.posY + y][0] = 1;
        matrix[bluePaddle.posY + y][14] = 2;
    }
    
}

function reparseMatrix()
{
    for (y = 0; y < 20; y++)
    {
        var tempY = matrix[y];
        
        for (x = 0; x < 15; x++)
        {   
            switch ( tempY[x] )
            {
                //lampje uit
                case 0:
                matrix[y][x] = "0X190000";
                break;
                    
                //rood
                case 1:
                matrix[y][x] = "0XFF0000";
                break;
                    
                //blauw
                case 2:
                matrix[y][x] = "0X0000FF";
                break;
                
                //groen
                case 3:
                matrix[y][x] = "0X00CC00";
                break;
                    
                //geel
                case 4:
                matrix[y][x] = "0XFFCC00";
                break;
                    
                //lichtblauw
                case 5:
                matrix[y][x] = (countdown == null) ? "0X222222" : "0xFFFFFF";
                break;     
            }
        }
    }
}

var one_dim   = [];

function one_dim_matrix()
{

    var inversed = matrix[0].map(function(col, i) { 
      return matrix.map(function(row) { 
        return row[i] 
      })
    });
   

    one_dim = [];

    for (y = 0; y < 15; y++)
    {
        for (x = 0; x < 20; x++)
        {    
            one_dim.push(inversed[14-y][x]); 
        }
    }
}


var counter1;
var counter2;

function updateCounter(number)
{

    if (number<10)
    {
        rightnumber = number;
        leftnumber = 0;
    }
    else
    {
        rightnumber = number % 10;
        leftnumber = (number - (number % 10))/10;
    }

    switch (leftnumber)
    {

        case 0:
        counter1 = number0
        break;

        case 1:
        counter1 = number1
        break;   

        case 2:
        counter1 = number2
        break;   

        case 3:
        counter1 = number3
        break;   

        case 4:
        counter1 = number4
        break;   

        case 5:
        counter1 = number5
        break;   

        case 6:
        counter1 = number6
        break;   

        case 7:
        counter1 = number7
        break;      

        case 8:
        counter1 = number8
        break;      

        case 9:
        counter1 = number9
        break;      

    };
    

    switch (rightnumber)
    {

        case 0:
        counter2 = number0
        break;

        case 1:
        counter2 = number1
        break;   

        case 2:
        counter2 = number2
        break;   

        case 3:
        counter2 = number3
        break;   

        case 4:
        counter2 = number4
        break;   

        case 5:
        counter2 = number5
        break;   

        case 6:
        counter2 = number6
        break;   

        case 7:
        counter2 = number7
        break;      

        case 8:
        counter2 = number8
        break;      

        case 9:
        counter2 = number9
        break;      

    };

}


function updateScore()
{
    for (y = 0; y < 12; y++)
    {    
        for (x = 0; x < 6; x++)
        {
            matrix[y+4][x+1] = counter1[y][x];
            matrix[y+4][x+8] = counter2[y][x];
        }
    }
}

    number0 =
    [[5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5]];

    number1 =
    [[0,0,5,5,0,0],
    [0,0,5,5,0,0],
    [0,0,5,5,0,0],
    [0,0,5,5,0,0],
    [0,0,5,5,0,0],
    [0,0,5,5,0,0],
    [0,0,5,5,0,0],
    [0,0,5,5,0,0],
    [0,0,5,5,0,0],
    [0,0,5,5,0,0],
    [0,0,5,5,0,0],
    [0,0,5,5,0,0]];

    number2 =
    [[5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [5,5,0,0,0,0],
    [5,5,0,0,0,0],
    [5,5,0,0,0,0],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5]];

    number3 =
    [[5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5]];

    number4 =
    [[5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5]];

    number5 =
    [[5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [5,5,0,0,0,0],
    [5,5,0,0,0,0],
    [5,5,0,0,0,0],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5]];

    number6 =
    [[5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [5,5,0,0,0,0],
    [5,5,0,0,0,0],
    [5,5,0,0,0,0],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5]];

    number7 =
    [[5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5]];

    number8 =
    [[5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5]];

    number9 =
    [[5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5]];





var idle = [
    [[0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],


    [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],


    [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],

    [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],

    [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0]],

    [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],


    [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],

    [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
];




module.exports = function(param)
{   
    io = param;

    return {
        game   : game,
        left   : redPaddle,
        right  : bluePaddle
    }
}
