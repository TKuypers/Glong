app.controller('ScoreCtrl', function($scope, $rootScope, $location) 
{

	$rootScope.page        = 'score';
	$rootScope.title       = "GLOW PONG";
	$scope.text = "Ik+haalde+een+score+van+"+$rootScope.score+"+met+pong!+%23glow";



});