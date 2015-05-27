var Lichess = {
	//Currently this is my best option for getting random games.  This guy has played a lot.
	//Ideally would like to change this to just get a random game from lichess's api.
	RANDOM_GAMES_URL : "http://en.lichess.org/api/game?username=NevSky&nb=1000&with_moves=1&rated=1",

	getRandomFormattedGame : function(){ 
		$.ajax({
		  url: this.RANDOM_GAMES_URL,
		  dataType:'jsonp',
		  jsonp:'callback',
		  success: function(data) {
		    // data is a javascript object, do something with it!
		    //console.debug(JSON.stringify(data));

		    var randNum = Math.floor((Math.random() * data.list.length) + 1);
		    var game = data.list[randNum];
		    var moves = game.moves;
		    var arrOfTurns = moves.match(/[^ ]+( +[^ ]+){0,1}/g);

		    var Move = {};
		    for(var i=0; i<arrOfTurns.length; i++){
		    	Move[(i + 1)] = arrOfTurns[i];
		    }

		    console.log(Move);
		  }
		});
	},

	getSingleGame : function(){

		var listOfGames = 
			$.ajax({
			  url: this.RANDOM_GAMES_URL,
			  dataType:'jsonp',
			  jsonp:'callback',
			  success: function(data) {
			    // data is a javascript object, do something with it!
			    //console.debug(JSON.stringify(data));

			    var randNum = Math.floor((Math.random() * data.list.length) + 1);
			    var game = data.list[randNum];
			    console.log(game.moves);
			  }
			});
	}

}

