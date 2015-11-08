var app = angular.module('glong', ['ngTouch', 'ngRoute', 'angular-gestures']);


/* Run some basic functions */
app.run(function($rootScope, $location) 
{
    // set fastclick
    FastClick.attach(document.body);  
});





/* Load angular on load */
window.onload = function()
{   
    angular.bootstrap(document.querySelector("body#glong"), ["glong"]);
};


