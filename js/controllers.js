app.controller("MasterController", function($scope){
	$scope.notations = null;
	$scope.numOfMoves = 3;
	$scope.answerPGN = null;
});

/*****************
	CONTROLLER FOR THE NOTATIONS PAGE
******************/
app.controller("MainController", function($scope, $http){
	var arrOfTurns = [];

	$scope.loading = true;

	$scope.$parent.answerPGN  = null;
	$scope.$parent.numOfMoves = 3;

	$http.jsonp("http://en.lichess.org/api/game?username=NevSky&nb=1000&with_moves=1&rated=1&callback=JSON_CALLBACK")
			.success(function(data){
				var randNum = Math.floor((Math.random() * data.list.length) + 1),
			        game    = data.list[randNum],
			        moves   = game.moves; //note, could pass 'verbose' option here

			    $scope.$parent.answerPGN = new Game(moves);
			    $scope.loading = false;
			});

	$scope.incrementCtr = function(){
		if($scope.$parent.numOfMoves < 10)
			$scope.$parent.numOfMoves++;
	}

	$scope.decrementCtr = function(){
		if($scope.$parent.numOfMoves > 1)
			$scope.$parent.numOfMoves--;
	}
});


/*****************
	CONTROLLER FOR THE BOARD PAGE
******************/
app.controller("BoardController",['$scope', '$state', function($scope, $state){
	$scope.hasConfirmed = false;
	$scope.stepNum = 0;

	$scope.confirm = function(){
		$scope.hasConfirmed = true;
		$scope.toTestPGN = new Game($scope.game.pgn());

		console.log($scope.board);
		console.log($scope.game);

		var isMatch = true;
		for(var i=0; i<$scope.$parent.numOfMoves; i++){
			if($scope.toTestPGN.stepByStep[i] != $scope.$parent.answerPGN.stepByStep[i]){
				isMatch = false;
				console.log($scope.toTestPGN.stepByStep[i] + ' is not ' + $scope.$parent.answerPGN.stepByStep[i]);
				break;
			}
		}

		console.log($scope.board.fen());

		if(isMatch)
			correct();
		else
			fail();
	}

	$scope.stepForward = function(){
		$($scope.prevSquare).css('background-color', $scope.prevColor); 

		var gameHistory = $scope.game.history({verbose: true});
		if($scope.stepNum < gameHistory.length){
			var nextMove = gameHistory[$scope.stepNum].from + '-' + gameHistory[$scope.stepNum].to;
			$scope.board.move(nextMove);
			$scope.stepNum++;
		}
	}

	$scope.stepBack = function(){
		$($scope.prevSquare).css('background-color', $scope.prevColor); 

		var gameHistory = $scope.game.history({verbose: true});
		var turn = gameHistory[$scope.stepNum - 1];

		if($scope.stepNum > 0){
			$scope.stepNum--;
			var nextMove = turn.to + '-' + turn.from;
			//TODO need to replace taken pieces

			$scope.board.move(nextMove);

			if(turn.captured != null){
				var capturedColor = turn.color == 'w' ? 'b' : 'w';
				var capturedPiece = {
					type: turn.captured,
					color: capturedColor
				}

				console.log('captured piece was: ');
				console.log(capturedPiece);

				console.log('putting it at ' + turn.to);

//				$scope.board.position($scope.$parent.answerPGN.getPgnUpToMove($scope.stepNum), false);

//				console.log($scope.game.put(capturedPiece, turn.to));
//				$scope.game.load($scope.game.fen());
				 var oldPosition = $scope.board.position();
				 var newPosition = oldPosition;
				 newPosition[turn.to] = capturedPiece.type.toUpperCase();
				 var fenPos = objToFen(newPosition);
				 $scope.board.position(newPosition, false);
				// console.log($scope.board.position(newPosition, false));
				// console.log($scope.board.position());
				//turn.to needs the captured piece put on it
			}else{
				console.log('turn.captured is null');
			}

		}
	}

	function fail(){
		flashBackground('red');

		$scope.board.start();
		$scope.game. reset();

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
		   }, 700)
		})($scope.$parent.numOfMoves * 2);  
	}

	function flashBackground(color){
		$('.lightbox').css('background-color', color);
		setTimeout(function(){
		 	$('.lightbox').css('background-color', 'white');
		}, 500);
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
		flashBackground('green');
	}

	function objToFen(obj) {
	  // if (validPositionObject(obj) !== true) {
	  //   console.log('objToFen is false!');
	  //   return false;
	  // }
	  var COLUMNS = 'abcdefgh'.split('');

	  var fen = '';

	  var currentRow = 8;
	  for (var i = 0; i < 8; i++) {
	    for (var j = 0; j < 8; j++) {
	      var square = COLUMNS[j] + currentRow;

	      // piece exists
	      if (obj.hasOwnProperty(square) === true) {
	        fen += pieceCodeToFen(obj[square]);
	      }

	      // empty space
	      else {
	        fen += '1';
	      }
	    }

	    if (i !== 7) {
	      fen += '/';
	    }

	    currentRow--;
	  }

	  // squeeze the numbers together
	  // haha, I love this solution...
	  fen = fen.replace(/11111111/g, '8');
	  fen = fen.replace(/1111111/g, '7');
	  fen = fen.replace(/111111/g, '6');
	  fen = fen.replace(/11111/g, '5');
	  fen = fen.replace(/1111/g, '4');
	  fen = fen.replace(/111/g, '3');
	  fen = fen.replace(/11/g, '2');

	  return fen;
	}

	// convert bP, wK, etc code to FEN structure
function pieceCodeToFen(piece) {
  var tmp = piece.split('');

  // white piece
  if (tmp[0] === 'w') {
    return tmp[1].toUpperCase();
  }

  // black piece
  return tmp[1].toLowerCase();
}
}]);