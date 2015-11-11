app.service('games', ['$http', '$rootScope', function($http, $rootScope)
{

	// get the api requests
	this.postCounter = function(data)
	{
		var url    = 'http://experte.es/counter.php?player='+data.player;

		if(data.score != undefined)
		{
			url += '&score='+data.score;
		};

		// set the request
		var req = 
		{
			method : 'GET',
			url    : url,
		};

		// do the requiest
		$http(req).success(function(data){}).error(function(data){});	
	};



}]);