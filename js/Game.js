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

	if(this.pgn.indexOf('.') == -1){
		turnByTurn = this.pgn.match(/[^ ]+( +[^ ]+){0,1}/g);
	}
	else{
		var temp = this.pgn.replace(/(\d\. )/g, '');
		console.log(temp);
		turnByTurn = temp.match(/[^ ]+( +[^ ]+){0,1}/g);
	}

	// var tester = this.pgn.match(/(\d\. )/g);
	// console.log(tester);

	// var turnByTurn = this.pgn.match(/[^ ]+( +[^ ]+){0,1}/g);

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