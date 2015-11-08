app.controller('PongCtrl', function($scope, $rootScope) 
{

	
	$scope.id      = null;
	$scope.inGame  = false;

	$scope.playing = false;



	console.log('init');

	var socket = io.connect('http://screen.expertees.nl');
	
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
		console.log('gamestart');

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
	$scope.updatePaddle = function(pos)
	{
		if($scope.playing)
		{
			var data = {position:pos};

			//console.log(data);

			socket.emit('updatePaddle', data);
		}
	};





	$scope.sliderPosition = 45;
	$scope.paddlePosition; 
	$scope.sendPaddlePosition;


	//get global values
	$scope.fieldHeight;
	$scope.fieldStart;
	$scope.fieldEnd;
	$scope.touchPad;


	$scope.doDrag = function(e) {
	    
	    var touch = e.touches[0];
	    var touchPosition = Math.round(touch.pageY - 20);
	    
	    $scope.sliderPosition = touchPosition;
	    
	    if ( $scope.sliderPosition < $scope.fieldStart ) {
	        $scope.sliderPosition = $scope.fieldStart 
	    }
	    if ( $scope.sliderPosition > $scope.fieldEnd ) {
	        $scope.sliderPosition = $scope.fieldEnd;
	    }
	    
        $scope.positionSlider();

        //get the paddle position
        var sliderPercentage = Math.round( (($scope.sliderPosition-$scope.fieldStart)/($scope.fieldEnd-$scope.fieldStart)*100) );
        $scope.paddlePosition = Math.round( (sliderPercentage/100)*15 ) + 1;
        

        if($scope.sendPaddlePosition !== $scope.paddlePosition) 
        {
            $scope.sendPaddlePosition = $scope.paddlePosition;

            $scope.updatePaddle($scope.sendPaddlePosition);
        }
	};


	$scope.positionSlider = function()
	{
		var slider = document.getElementById("slider");
        	slider.style.top = $scope.sliderPosition + "px";
	};



	$scope.updateScreen = function()
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

	    //get touchPad height and sliderheight
	    $scope.touchPadHeight = height - 170;
	    $scope.fieldHeight = Math.round($scope.touchPadHeight*0.8);
	    $scope.fieldStart = Math.round($scope.touchPadHeight*0.1)+5 + 70;
	    $scope.fieldEnd = Math.round($scope.touchPadHeight*0.9)-45 + 70;
	}



	$scope.setSlider = function() 
	{
	    $scope.sliderPosition = $scope.fieldStart;

	    $scope.positionSlider();
	}



	$scope.setControls = function()
	{
	    window.addEventListener('touchmove', $scope.doDrag, false);
	    window.addEventListener('resize' , $scope.updateScreen, false);

	    $scope.updateScreen();
	   	$scope.setSlider();
	};

	
	$scope.setControls();




   	// remove references to the controller
    $scope.removeListeners = function()
    {
		
    };
    

    $scope.$on('$destroy', function() 
    {
        $scope.removeListeners();
    });

});