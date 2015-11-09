var app = angular.module('glong', ['ngTouch', 'ngRoute', 'angular-gestures']);


/* Run some basic functions */
app.run(function($rootScope, $location) 
{
    // set fastclick
    FastClick.attach(document.body);  

    // disable touchmove
    document.addEventListener('touchmove', function(e){e.preventDefault();}, false);



    $rootScope.id          = null;
	$rootScope.inGame      = false;
	$rootScope.playing     = false;
	$rootScope.score       = 0;
    $rootScope.side        = null;
    $rootScope.queueLength = 0;


	$location.path('/start');


});




/* Load angular on load */
window.onload = function()
{   
    angular.bootstrap(document.querySelector("body#glong"), ["glong"]);
};


