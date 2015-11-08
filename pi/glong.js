var ws281x = require('./../node_modules/rpi-ws281x-native/lib/ws281x-native');

var NUM_LEDS = parseInt(process.argv[2], 10) || 10,
    pixelData = new Uint32Array(NUM_LEDS);

ws281x.init(NUM_LEDS);

// ---- trap the SIGINT and reset before exit
process.on('SIGINT', function () {
  ws281x.reset();
  process.nextTick(function () { process.exit(0); });
});



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
    posY: 8
};
var bluePaddle = {
    posY: 8
};

var ball = {
    posX: 7,
    posY: 10,
    speedY: 1,
    direction: 1
};

//explosion
var explosion = {
    posX: 200,
    posY: 200,
    time: 0,
    up:0,down:0,left:0,right:0
};

var game = {
    steps: 10,
    score: 0,
    fps: 50,
    init: function(){var gameLoopInterval = setInterval(gameLoop, 1000/game.fps);}
};


//starting the gameloop
game.init();

function gameLoop()
{
    clearMatrix();
    //checkPlayerInput();
    updateBall();
    updateCounter();
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

/*
function checkPlayerInput()
{
    if (upPressed && redPaddle.posY > 0)
    {
        if (keyPressed == false) 
        {
            redPaddle.posY--;
            keyPressed = true;
        }
    }
    else if (downPressed && redPaddle.posY < 15)
    {
        if (keyPressed == false)
        {
            redPaddle.posY++;
            keyPressed = true;
        }
    }
    if (downPressed == false && upPressed == false)
    {
        keyPressed = false;
    }
}
*/
function updateBall()
{
    game.steps--;
    if (game.steps==0)
    {
        moveBall();
        game.steps=10;
    }
}

function moveBall()
{
       // && ball.posY >= redPaddle.posY && ball.posY < redPaddle.posY+5
    if ( ball.posX == 1 )
    {
        ball.direction = 1;
       // ball.speedY = ball.speedY + ((( redPaddle.posY + 2 ) - ball.posY) * -1);
       // if (ball.speedY > 2){ball.speedY=2}
       // if (ball.speedY < -2){ball.speedY=-2}
        game.score++;
        game.fps++;
    }
    if ( ball.posX == 13 )
    {
        ball.direction = 0;
        game.score++;
        game.fps++;
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

    if ( ball.posX == 0 )
    {
        explosion.posX = 0;
        explosion.posY = ball.posY;
        explosion.up = explosion.posY;
        explosion.down = explosion.posY;
        explosion.time = 4;
    }

    if (explosion.time > 0)
    {
        explosion.up--;
        explosion.down++;
        explosion.left--;
        explosion.right++;

        explosion.time--;
    }
    if (explosion.time == 0)
    {
        explosion.up = -1;
        explosion.down = -1;
        explosion.left = -1;
        explosion.right = -1;
    }
    
    if ( ball.posY <= 0 || ball.posY >= 19)
    {
        ball.speedY = ball.speedY *-1;
        console.log("check");
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
    for (y = 0; y < 5; y++)
    {
        matrix[redPaddle.posY + y][0] = 1;
        matrix[bluePaddle.posY + y][14] = 2;
    }
    
    //update explosion
    if (explosion.time > 0)
    {
        matrix[explosion.up][explosion.posX] = 4;
        matrix[explosion.down][explosion.posX] = 4;
        matrix[explosion.posY][explosion.left] = 4;
        matrix[explosion.posY][explosion.right] = 4;
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
                matrix[y][x] = "0X222222";
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

    


    /*
    for(var i = 1; i <= 300; i++)
    {
        var k = (i-1);

        if(i <= 20)
        {
           one_dim[k] = matrix[k][0];
        }
        else
        {
           var y = (i%20)-1;
           var x = ((i-(i%20))/20)-1;

           one_dim[k] = matrix[y][x];
        }
    }
    */

}


/*

    function keyDownHandler(e)
    {
        if(e.keyCode == 40)
        {
            downPressed = true;
        }
        else if(e.keyCode == 38)
        {
            upPressed = true;
        }
    }

    function keyUpHandler(e)
    {
        if(e.keyCode == 40)
        {
            downPressed = false;
        }
        else if(e.keyCode == 38)
        {
            upPressed = false;
        }
    }

*/

function updateScore()
{
    for (y = 0; y < 10; y++)
    {    
        for (x = 0; x < 6; x++)
        {
            matrix[y+5][x+1] = counter1[y][x];
            matrix[y+5][x+8] = counter2[y][x];
        }
    }
}

function updateCounter()
{

    if (game.score<10)
    {
        rightnumber = game.score;
        leftnumber = 0;
    }
    else
    {
        rightnumber = game.score % 10;
        leftnumber = (game.score - (game.score % 10))/10;
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



    number0 =
    [[5,5,5,5,5,5],
    [5,5,5,5,5,5],
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
    [0,0,5,5,0,0]];

    number2 =
    [[5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [5,5,0,0,0,0],
    [5,5,0,0,0,0],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5]];

    number3 =
    [[5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5]];

    number4 =
    [[5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5]];

    number5 =
    [[5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [5,5,0,0,0,0],
    [5,5,0,0,0,0],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5]];

    number6 =
    [[5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [5,5,0,0,0,0],
    [5,5,0,0,0,0],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5],
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
    [0,0,0,0,5,5]];

    number8 =
    [[5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5]];

    number9 =
    [[5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [5,5,0,0,5,5],
    [5,5,0,0,5,5],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5],
    [0,0,0,0,5,5],
    [0,0,0,0,5,5],
    [5,5,5,5,5,5],
    [5,5,5,5,5,5]];