app.controller("MasterController", function($scope){
	$scope.notations = null;
	$scope.numOfMoves = 3;
	$scope.answerPGN = null;
});

app.controller("MainController", function($scope, $http){
	$scope.$parent.answerPGN = null;
	var arrOfTurns = [];
	$scope.numOfMoves = 3;
	$scope.loading = true;

	$http.jsonp("http://en.lichess.org/api/game?username=NevSky&nb=1000&with_moves=1&rated=1&callback=JSON_CALLBACK")
			.success(function(data){
				var randNum = Math.floor((Math.random() * data.list.length) + 1);
			    var game = data.list[randNum];
			    var moves = game.moves;
//			    arrOfTurns = moves.match(/[^ ]+( +[^ ]+){0,1}/g);

			    $scope.$parent.answerPGN = new Game(moves);
			    $scope.loading = false;
//				setNotations();
			});

	$scope.incrementCtr = function(){
		if($scope.numOfMoves < 10)
			$scope.numOfMoves++;
	}

	$scope.decrementCtr = function(){
		if($scope.numOfMoves > 1)
			$scope.numOfMoves--;
	}

	// function setNotations(){
	// 	var formattedMoves = [];
	//     for(var i=0; (i<$scope.numOfMoves && i<arrOfTurns.length); i++){

	//     	var moveObj = {
	//     		'moveNo': i + 1,
	//     		'moves' : arrOfTurns[i].split(' ')
	//     	}

	// 		formattedMoves.push(moveObj);
	//     }

	//     $scope.$parent.notations = formattedMoves;
	// }
});

app.controller("BoardController",['$scope', '$state', function($scope, $state){
	$scope.hasConfirmed = false;
	$scope.stepNum = 0;

	$scope.confirm = function(){
		// var answer = notationToPGN();
		// var answerArr = getAnswerNotationArray();
		$scope.hasConfirmed = true;
		$scope.toTestPGN = new Game($scope.game.pgn());

		// if(answer.trim() == $scope.game.pgn().trim()){
		// 	correct();
		// }else{
		// 	fail(answer, answerArr);
		// }
		if($scope.toTestPGN.pgn == $scope.$parent.answerPGN.pgn)
			correct();
		else
			fail();
	}

//	function fail(pgn, pgnArr){
	function fail(){
		console.log('failed..');
		$('body').css('background-color', 'red');
		setTimeout(function(){
		 	$('body').css('background-color', '#ecf0f1');
		}, 400);

		$scope.board.start();
		$scope.game.reset();

		$scope.game.load_pgn($scope.$parent.answerPGN.pgn);
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
		})($scope.$parent.numOfMoves * 2);  

		// setTimeout(function(){
		// 	$state.transitionTo('notation', null, {reload: true});
		// }, 5000);
	}

	function move(gameHistory){
		if(gameHistory.length >= $scope.stepNum){
			var nextMove = gameHistory[$scope.stepNum].from + '-' + gameHistory[$scope.stepNum].to;
			
			var square = '.square-' + gameHistory[$scope.stepNum].to;
			$scope.prevSquare = square;
			$scope.prevColor = $(square).css('background-color');

			if($scope.toTestPGN.stepByStep[$scope.stepNum] == $scope.$parent.answerPGN.stepByStep[$scope.stepNum])
				$(square).css('background-color', 'green');
			else
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

	function getAnswerNotationArray(){
		var allMoves = [];
		for(var i=0; i<$scope.$parent.notations; i++){
			var move = $scope.$parent.notations[i];
			var moveStr = move.moveNo + '. ' + move.moves[0] + ' ' + move.moves[1] + ' ';
			allMoves[i] = moveStr;
		}

		return allMoves;
	}
}]);