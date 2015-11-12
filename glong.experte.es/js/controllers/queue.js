app.controller('QueueCtrl', function($scope, $rootScope, $location, games) 
{

	$rootScope.page        = 'queue';
    $rootScope.title       = "GLOW PONG";
	$rootScope.socket = io.connect('http://screen.expertees.nl');
	
	// join the queue
	$rootScope.socket.on('inQueue', function(data)
	{
		$rootScope.$apply(function()
		{
			$rootScope.id = data.id;
		});
	});


	// join the queue
	$rootScope.socket.on('queueUpdate', function(data)
	{
		$rootScope.$apply(function()
		{
			$rootScope.queueLength = 0;

			var ids = data.queue;

			for(var i in ids)
			{
				var c = ids[i];
				if(c == $rootScope.id)
				{
					break;
				}
				$rootScope.queueLength++;
			};
		});
	});


	// check if we joined a game
	$rootScope.socket.on('gameJoined', function(data)
	{
		console.log('game joined');

		$rootScope.$apply(function()
		{
			$rootScope.inGame = true
			$rootScope.side   = data.pos;		
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
			// add to counter
			games.postCounter({player:$rootScope.id});

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
			// add to counter
			games.postCounter({player:$rootScope.id, score:data.score});

			$rootScope.score = data.score;
			$location.path('/score');

			$rootScope.socket.emit('gameEnd');
		});
	});

});