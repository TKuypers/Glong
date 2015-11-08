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
}

window.addEventListener('load' , updateScreen, false);
