var app    = require('express')();
var server = require('http').Server(app);
var io     = require('socket.io')(server);

var glong  = require('./glong.js');


var events       = require('events');
var eventEmitter = new events.EventEmitter();

var helpers = require('./functions/helpers.js');

server.listen(80);





var game =
{
	left     : null,
	right    : null,

	complete : false,
	playing  : false,


	update : function()
	{
		console.log('update');

		if(!game.complete)
		{
			// search for players
			if(game.left == null || game.right == null)
			{
				game.searchPlayers();
			}

			// check if we have enough platers
			if(game.left != null && game.right != null)
			{
				game.start();
			}
		}
	},



	start : function()
	{
		console.log('Game started'+game.left+','+game.right);

		game.complete = true;
	},


	stop : function()
	{
		console.log('Game stopped');

		game.complete = false;
	},


	searchPlayers :  function()
	{
		// left
		var players = ['left', 'right'];
		for(var t in players)
		{
			var pos = players[t];

			if(game[pos] == null)
			{
				if(queue.ids.length >= 1)
				{
					var id =  queue.ids[0];

					game.playerAdded(id, pos);
				}
			}
		}
	},


	playerStopped : function(id)
	{
		// left
		if(game.left == id)
			game.left = null;

		// right
		if(game.right == id)
			game.right = null;

		game.stop();
		game.update();
	},


	playerAdded : function(id, pos)
	{
		game[pos] = id;
		queue.removeFromQueue(id);

		eventEmitter.emit('game.playerAdded', {id: id, pos:pos});
	},
};







var queue = 
{
	ids  : [],

	addToQueue : function(id)
	{
		queue.ids.push(id);

		queue.updateQueue();
	},


	removeFromQueue : function(id)
	{
		for(var i in queue.ids)
		{
			var curr = queue.ids[i];
			if(curr == id)
			{
				queue.ids.splice(i, 1);
			}
		}

		queue.updateQueue();
	},


	updateQueue :  function()
	{
		//console.log(queue.ids);
	},
};





// on connection
io.on('connection', function (socket) 
{
	var id     = helpers.makeId(5);
	var pos    = false;
	var inGame = false;

	// add to the queue
	queue.addToQueue(id);
	socket.emit('inQueue', {id:id});

	// check if we're added to the game
	var addedHandler = function (data)
	{
		if(id == data.id)
		{
			inGame = true;
			pos    = data.pos;

			socket.join('game');
			socket.emit('gameJoined');
		}
	};

	eventEmitter.once('game.playerAdded', addedHandler);

	// update the game
	game.update();



	// update the paddle
	socket.on('updatePaddle', function(data)
	{
		console.log(pos+' updated');
	});


	/*
	// join the room
	socket.join(room);
	socket.emit('joined', {room:room});
	*/

	// disconnect
	socket.on('disconnect', function() 
	{
		if(!inGame)
		{
			queue.removeFromQueue(id);
		}
		else
		{
			game.playerStopped(id);
			socket.leave('game');
		}

	});

	/*
	// push the connection back
	socket.emit('connection_id', connection_id);

  	socket.on('my other event', function(data)
  	{
    	console.log(data);
  	});
	*/
});


