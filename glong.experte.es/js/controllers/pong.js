app.controller('PongCtrl', function($scope, $rootScope, $location) 
{



	// check if we have audio
	if(Modernizr.audio)
	{
		var blip = new Audio("assets/blip.wav");
	}

	// join the queue
	$rootScope.socket.on('gameBloop', function(data)
	{
		if(Modernizr.audio)
		{
			blip.play();
		}
	});






	// mouse move
	$scope.updatePaddle = function(pos)
	{
		if($rootScope.playing)
		{
			var data = {position:pos};

			$rootScope.socket.emit('updatePaddle', data);
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
        $scope.paddlePosition = Math.round( (sliderPercentage/100)*16);
        

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