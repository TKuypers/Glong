app.controller('PongCtrl', function($scope, $rootScope) 
{

	
	$scope.id     = null;
	$scope.inGame = false;


	$scope.init = function()
	{
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


		// mouse move
		document.addEventListener('mousemove', function()
		{
			if($scope.inGame)
			{
				socket.emit('updatePaddle');
				console.log('move');
			}
		});

	};



	// call the init function
	$scope.init();

   	// remove references to the controller
    $scope.removeListeners = function()
    {
		
    };
    

    $scope.$on('$destroy', function() 
    {
        $scope.removeListeners();
    });

});