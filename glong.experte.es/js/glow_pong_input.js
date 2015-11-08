var sliderPosition = 45;
var PaddlePosition; var sendPaddlePosition;

var startDrag = function()
{
    console.log('start');
};

var endDrag = function()
{
};

function doDrag(e) {
    
    var touch = e.touches[0];
    touchPosition = Math.round(touch.pageY - 20);
    
      sliderPosition = touchPosition;
    
    if ( sliderPosition < fieldStart ) {
        sliderPosition = fieldStart 
    }
    if ( sliderPosition > fieldEnd ) {
        sliderPosition = fieldEnd;
    }
    
        var slider = document.getElementById("slider");
        slider.style.top = sliderPosition + "px";

        //get the paddle position
        sliderPercentage = Math.round( ((sliderPosition-fieldStart)/(fieldEnd-fieldStart)*100) );
        paddlePosition = Math.round( (sliderPercentage/100)*15 ) + 1;
        

        if (sendPaddlePosition !== paddlePosition) {
            sendPaddlePosition = paddlePosition;
            console.log(sendPaddlePosition);
        }
};

var updateScreen = function()
{
        var width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

        var height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    
    var container = document.getElementById("field");
    container.style.width = width + "px";
    container.style.height = height + "px";

    //get touchPad height and sliderheight
    touchPadHeight = height - 170;
    fieldHeight = Math.round(touchPadHeight*0.8);
    fieldStart = Math.round(touchPadHeight*0.1)+5 + 70;
    fieldEnd = Math.round(touchPadHeight*0.9)-45 + 70;
}

//get global values
var fieldHeight;
var fieldStart;
var fieldEnd;
var touchPad;

    window.addEventListener('touchstart', startDrag, false);
    window.addEventListener('touchend', endDrag, false);
    window.addEventListener('touchmove', doDrag, false);

    window.addEventListener('resize' , updateScreen, false);
    window.addEventListener('load' , updateScreen, false);

    window.addEventListener('load' , setSlider, false);

function setSlider() {
    sliderPosition = fieldStart;
    var slider = document.getElementById("slider");
    slider.style.top = sliderPosition + "px";
}