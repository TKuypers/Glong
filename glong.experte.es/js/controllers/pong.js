app.controller('PongCtrl', function($scope, $rootScope) 
{

	
	$scope.id      = null;
	$scope.inGame  = false;

	$scope.playing = false;



	console.log('init');

	var socket = io.connect('http://192.168.0.100');
	
	// join the queue
	socket.on('inQueue', function(data)
	{
		$scope.$apply(function()
		{
			$scope.id = data.id;
		});
	});


	// check if we joined a game
	socket.on('gameJoined', function(data)
	{
		$scope.$apply(function()
		{
			$scope.inGame = true;
		});
	});



	// check if the game will start
	socket.on('gamePrepare', function(data)
	{

	});



	// start the game
	socket.on('gameStart', function(data)
	{
		$scope.$apply(function()
		{
			$scope.playing = true;
		});
	});




	// start the game
	socket.on('gameStop', function(data)
	{
		$scope.$apply(function()
		{
			$scope.playing = false;
		});
	});




	// mouse move
	document.addEventListener('mousemove', function()
	{
		if($scope.inGame)
		{
			socket.emit('updatePaddle');
			console.log('move');
		}
	});





   	// remove references to the controller
    $scope.removeListeners = function()
    {
		
    };
    

    $scope.$on('$destroy', function() 
    {
        $scope.removeListeners();
    });

});