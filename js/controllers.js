app.controller("MasterController", function($scope){
	$scope.notations = null;
	$scope.numOfMoves = 3;
});

app.controller("MainController", function($scope, $http){
	console.log('instantiating main ctrl');

	var arrOfTurns = [];
	$scope.numOfMoves = 3;

	$http.jsonp("http://en.lichess.org/api/game?username=NevSky&nb=1000&with_moves=1&rated=1&callback=JSON_CALLBACK")
			.success(function(data){
				var randNum = Math.floor((Math.random() * data.list.length) + 1);
			    var game = data.list[randNum];
			    var moves = game.moves;
			    arrOfTurns = moves.match(/[^ ]+( +[^ ]+){0,1}/g);

				setNotations();
			});

	$scope.incrementCtr = function(){
		if($scope.numOfMoves < 10){
			$scope.numOfMoves++;
			setNotations();
		}
	}

	$scope.decrementCtr = function(){
		if($scope.numOfMoves > 1){
			$scope.numOfMoves--;
			setNotations();
		}
	}

	function setNotations(){
		var formattedMoves = [];
	    for(var i=0; (i<$scope.numOfMoves && i<arrOfTurns.length); i++){

	    	var moveObj = {
	    		'moveNo': i + 1,
	    		'moves' : arrOfTurns[i].split(' ')
	    	}

			formattedMoves.push(moveObj);
	    }

	    $scope.$parent.notations = formattedMoves;
	}
});

app.controller("BoardController",['$scope', '$state', function($scope, $state){

	$scope.stepNum = 0;

	$scope.confirm = function(){
		console.log('meeh');
		var ctr = 0;
		var ct = 0;

		var answer = notationToPGN();
		console.log('should match pgn: ');
		console.log($scope.game.pgn());

		if(answer.trim() == $scope.game.pgn().trim()){
			correct();
		}else{
			fail(answer);
		}
	}

	function fail(pgn){
		console.log('failed..');
		$('body').css('background-color', 'red');
		setTimeout(function(){
		 	$('body').css('background-color', '#ecf0f1');
		// 	$state.transitionTo('notation', null, {reload: true});
		}, 400);

90o9
		var boop = '[Event "rated standard game"]' +
			        '[Site "Free Internet Chess Server"]' +
			        '[Date "2008.02.20"]' +
			        '[Round "-"]' +
			        '[White "justdoeet"]' +
			        '[Black "Zornhau"]' +
			        '[WhiteElo "1598"]' +
			        '[BlackElo "1482"]' +
			        '[Result "1-0"]' +
			        '[Time "18:51:25"]' +
			        '[TimeControl "1200+0"]' +
			        '[Mode "ICS"]\n\n' + pgn;

		// pgn2 = ['[Event "Casual Game"]',
		//        '[Site "Berlin GER"]',
		//        '[Date "1852.??.??"]',
		//        '[EventDate "?"]',
		//        '[Round "?"]',
		//        '[Result "1-0"]',
		//        '[White "Adolf Anderssen"]',
		//        '[Black "Jean Dufresne"]',
		//        '[ECO "C52"]',
		//        '[WhiteElo "?"]',
		//        '[BlackElo "?"]',
		//        '[PlyCount "47"]',
		//        '',
		//        '1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 Bxb4 5.c3 Ba5 6.d4 exd4 7.O-O',
		//        'd3 8.Qb3 Qf6 9.e5 Qg6 10.Re1 Nge7 11.Ba3 b5 12.Qxb5 Rb8 13.Qa4',
		//        'Bb6 14.Nbd2 Bb7 15.Ne4 Qf5 16.Bxd3 Qh5 17.Nf6+ gxf6 18.exf6',
		//        'Rg8 19.Rad1 Qxf3 20.Rxe7+ Nxe7 21.Qxd7+ Kxd7 22.Bf5+ Ke8',
		//        '23.Bd7+ Kf8 24.Bxe7# 1-0'];

		$scope.board.start();
		$scope.game.reset();
//		var x = $scope.game.load_pgn(pgn2.join('\n'));
		$scope.game.load_pgn(boop);
		var gameHistory = $scope.game.history({verbose: true});

		
		$scope.prevSquare = '';
		$scope.prevColor  = '';
		//this code came from
		//http://stackoverflow.com/questions/3583724/how-do-i-add-a-delay-in-a-javascript-loop
		(function myLoop (i) {          
		   setTimeout(function () {  
		   	  $($scope.prevSquare).css('background-color', $scope.prevColor); 
		      move(gameHistory);                        
		      if (--i) myLoop(i);      
		   }, 500)
		})(gameHistory.length - 1);  

		setTimeout(function(){
			$state.transitionTo('notation', null, {reload: true});
		}, 5000);
	}

	function move(gameHistory){
		if(gameHistory.length > $scope.stepNum){
			var nextMove = gameHistory[$scope.stepNum].from + '-' + gameHistory[$scope.stepNum].to;
			var square = '.square-' + gameHistory[$scope.stepNum].to;
			$scope.prevSquare = square;
			$scope.prevColor = $(square).css('background-color');
			$(square).css('background-color', 'red');
			$scope.board.move(nextMove);
			$scope.stepNum++;
		}
	}

	function correct(){
		console.log('correct..');
		$('body').css('background-color', 'green');
		setTimeout(function(){
			$('body').css('background-color', '#ecf0f1');
			$state.transitionTo('notation', null, {reload: true});
		}, 400);
	}

	function notationToPGN(){
		var pgn = '';

		console.log($scope.$parent.notations);

		for(var obj in $scope.$parent.notations){
			var move = $scope.$parent.notations[obj];
			pgn += move.moveNo + '. ' + move.moves[0] + ' ' + move.moves[1] + ' ';
		}

		console.log('returning pgn of: ' + pgn);
		return pgn;
	}
}]);