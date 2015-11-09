app.controller('QueueCtrl', function($scope, $rootScope, $location) 
{

	
	$rootScope.socket = io.connect('http://screen.expertees.nl');
	
	// join the queue
	$rootScope.socket.on('inQueue', function(data)
	{
		$rootScope.$apply(function()
		{
			$rootScope.id = data.id;
		});
	});


	// check if we joined a game
	$rootScope.socket.on('gameJoined', function(data)
	{
		console.log('game joined');

		$rootScope.$apply(function()
		{
			$rootScope.inGame = true;
		});
	});



	// countdown
	$rootScope.socket.on('gamePrepare', function(data)
	{
		$rootScope.$apply(function()
		{
			$location.path('/game');
		});
	});



	// start the game
	$rootScope.socket.on('gameStart', function(data)
	{
		console.log('gamestart');

		$rootScope.$apply(function()
		{
			$rootScope.playing = true;
		});
	});



	// start the game
	$rootScope.socket.on('gameStop', function(data)
	{
		$rootScope.$apply(function()
		{
			$rootScope.playing = false;
			$location.path('/queue');
		});
	});


	// start the game
	$rootScope.socket.on('gameEnd', function(data)
	{
		console.log('gameend');

		$rootScope.$apply(function()
		{
			$rootScope.score = data.score;
			$location.path('/score');

			$rootScope.socket.emit('gameEnd');
		});
	});

});