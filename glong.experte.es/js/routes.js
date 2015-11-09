app.config(['$routeProvider', '$locationProvider',  function($routeProvider) 
{
	
  $routeProvider


  // start
  .when('/start',
  {
      controller  : 'StartCtrl',
      templateUrl : 'views/start.html',
      reloadOnSearch: false,
  })


  // queue
  .when('/queue',
  {
      controller  : 'QueueCtrl',
      templateUrl : 'views/queue.html',
      reloadOnSearch: false,
  })


  // pong
  .when('/game',
  {
      controller  : 'PongCtrl',
      templateUrl : 'views/pong.html',
      reloadOnSearch: false,
  })



  // score
  .when('/score',
  {
      controller  : 'ScoreCtrl',
      templateUrl : 'views/score.html',
      reloadOnSearch: false,
  })




  // none...
  .otherwise(
  {
    redirectTo : '/start'
  })


}]);