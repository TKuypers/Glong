app.config(['$routeProvider', '$locationProvider',  function($routeProvider) 
{
	
  $routeProvider

  // pong
  .when('/pong',
  {
      controller  : 'PongCtrl',
      templateUrl : 'views/pong.html',
  })

  // none...
  .otherwise(
  {
    redirectTo : '/pong'
  });


}]);