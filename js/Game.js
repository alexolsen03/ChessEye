var Game = function(pgnMe){
	console.log(pgnMe);
	this.pgn = pgnMe.trim();
	this.create();
}

Game.prototype.create = function(){
	this.turnByTurn = this.createTurnByTurn();
	this.stepByStep = this.createStepByStep();
}

Game.prototype.createTurnByTurn = function(){
	var turnByTurn = '';

	//Test if this is a true pgn or just moves
	if(this.pgn.indexOf('.') == -1){
		turnByTurn = this.pgn.match(/[^ ]+( +[^ ]+){0,1}/g);
	}
	else{
		var temp = this.pgn.replace(/(\d\. )/g, '');
		console.log(temp);
		turnByTurn = temp.match(/[^ ]+( +[^ ]+){0,1}/g);
	}

	console.log('created turnByTurn');
	console.log(turnByTurn);

	return turnByTurn;
}

Game.prototype.createStepByStep = function(){
	var ctr = 0;
	var stepByStep = [];
	if(this.turnByTurn != null){
		for(var i=0; i<this.turnByTurn.length; i++){
			var moves = this.turnByTurn[i].split(' ');
			stepByStep[ctr] = moves[0];
			ctr++;
			stepByStep[ctr] = moves[1];
			ctr++;
		}
	}

	console.log('created StepByStep');
	console.log(stepByStep);

	return stepByStep;
}

Game.prototype.getPgnUpToMove = function(moveNo){
	var pgnStr = '';
	var turn = 1;
	for(var i=0; i<moveNo; i+=2){
		var moveW = this.stepByStep[i];
		var moveB = this.stepByStep[i+1];

		pgnStr += moveW + ' ' + moveB + ' ';

		turn++;
	}

	console.log('pgn up to move ' + moveNo + ' is ');
	console.log(pgnStr);
	return pgnStr.trim();

}