var GameAI = function(player1name, player2name){
	Game.call(this, player1name, player2name);
}

GameAI.prototype = Object.create(Game.prototype);
GameAI.prototype.buildNewProbs = function() {

	console.log("[AI] - AI is building probabilities");

	var nextTurnPlayerSlug = this.getNextTurnPlayerSlug();

	if (gamePiano[1] == nextTurnPlayerSlug || gamePiano[2] == nextTurnPlayerSlug || gamePiano[3] == nextTurnPlayerSlug)
		lines[1] = 0;
	if (gamePiano[4] == nextTurnPlayerSlug || gamePiano[5] == nextTurnPlayerSlug || gamePiano[6] == nextTurnPlayerSlug)
		lines[2] = 0;
	if (gamePiano[7] == nextTurnPlayerSlug || gamePiano[8] == nextTurnPlayerSlug || gamePiano[9] == nextTurnPlayerSlug)
		lines[3] = 0;
	if (gamePiano[1] == nextTurnPlayerSlug || gamePiano[4] == nextTurnPlayerSlug || gamePiano[7] == nextTurnPlayerSlug)
		cols[1] = 0;
	if (gamePiano[2] == nextTurnPlayerSlug || gamePiano[5] == nextTurnPlayerSlug || gamePiano[8] == nextTurnPlayerSlug)
		cols[2] = 0;
	if (gamePiano[3] == nextTurnPlayerSlug || gamePiano[6] == nextTurnPlayerSlug || gamePiano[9] == nextTurnPlayerSlug)
		cols[3] = 0;
	if (gamePiano[1] == nextTurnPlayerSlug || gamePiano[5] == nextTurnPlayerSlug || gamePiano[9] == nextTurnPlayerSlug)
		diag[1] = 0;
	if (gamePiano[3] == nextTurnPlayerSlug || gamePiano[5] == nextTurnPlayerSlug || gamePiano[7] == nextTurnPlayerSlug)
		diag[2] = 0;


	gameMap[1].prob = lines[1] + cols[1] + diag[1];
	gameMap[2].prob = lines[1] + cols[2];
	gameMap[3].prob = lines[1] + cols[3] + diag[2];
	gameMap[4].prob = lines[2] + cols[1];
	gameMap[5].prob = lines[2] + cols[2] + diag[1] + diag[2];
	gameMap[6].prob = lines[2] + cols[3];
	gameMap[7].prob = lines[3] + cols[1] + diag[2];
	gameMap[8].prob = lines[3] + cols[2];
	gameMap[9].prob = lines[3] + cols[3] + diag[1];

	console.log("[AI] - AI has build new probs");

	return true;
};

// Code le plus indigeste de cette planète.
GameAI.prototype.willBeWinner = function() {

	console.log("[AI] - Checking if AI have to block");

	var isPlayerWin = this.overrideProbs(this.player1);
	var isIAWin = this.overrideProbs(this.player2);

	console.log(typeof isPlayerWin + "," + isPlayerWin);
	console.log(typeof isIAWin + "," + isIAWin);

	if (isIAWin) {
		//gameMap[isIAWin].prob = 1000;
		console.log("[AI] - AI do not have to block because she will win");
		return isIAWin;
	} else if(isPlayerWin) {
		//gameMap[isPlayerWin].prob = 1000;
		console.log("[AI] - AI have to block in square : " + isPlayerWin);
		return isPlayerWin;
	} else {
		console.log("[AI] - AI do not have to block");		
	}

	return false;
};

GameAI.prototype.overrideProbs = function(player) {

	var challenger = player.slug == "player1" ? this.player2 : this.player1;

	if (gamePiano[1] == player.slug && gamePiano[4] == player.slug && gamePiano[7] == null) {
		return 7;
	}

	if (gamePiano[7] == player.slug && gamePiano[1] == player.slug && gamePiano[4] == null) {
		return 4;
	}

	if (gamePiano[4] == player.slug && gamePiano[7] == player.slug && gamePiano[1] == null) {
		return 1;
	}

	if (gamePiano[2] == player.slug && gamePiano[5] == player.slug && gamePiano[8] == null) {
		return 8;
	}

	if (gamePiano[8] == player.slug && gamePiano[2] == player.slug && gamePiano[5] == null) {
		return 5;
	}

	if (gamePiano[5] == player.slug && gamePiano[8] == player.slug && gamePiano[2] == null) {
		return 2;
	}

	if (gamePiano[3] == player.slug && gamePiano[6] == player.slug && gamePiano[9] == null) {
		return 9;
	}

	if (gamePiano[9] == player.slug && gamePiano[3] == player.slug && gamePiano[6] == null) {
		return 6;
	}

	if (gamePiano[6] == player.slug && gamePiano[9] == player.slug && gamePiano[3] == null) {
		return 3;
	}

	if (gamePiano[1] == player.slug && gamePiano[2] == player.slug && gamePiano[3] == null) {
		return 3;
	}

	if (gamePiano[3] == player.slug && gamePiano[1] == player.slug && gamePiano[2] == null) {
		return 2;
	}

	if (gamePiano[3] == player.slug && gamePiano[2] == player.slug && gamePiano[1] == null) {
		return 1;
	}

	if (gamePiano[4] == player.slug && gamePiano[5] == player.slug && gamePiano[6] == null) {
		return 6;
	}

	if (gamePiano[6] == player.slug && gamePiano[4] == player.slug && gamePiano[5] == null) {
		return 5;
	}

	if (gamePiano[6] == player.slug && gamePiano[5] == player.slug && gamePiano[4] == null) {
		return 4;
	}

	if (gamePiano[7] == player.slug && gamePiano[8] == player.slug && gamePiano[9] == null) {
		return 9;
	}

	if (gamePiano[9] == player.slug && gamePiano[7] == player.slug && gamePiano[8] == null) {
		return 8;
	}

	if (gamePiano[9] == player.slug && gamePiano[8] == player.slug && gamePiano[7] == null) {
		return 7;
	}

	if (gamePiano[1] == player.slug && gamePiano[5] == player.slug && gamePiano[9] == null) {
		return 9;
	}

	if (gamePiano[9] == player.slug && gamePiano[1] == player.slug && gamePiano[5] == null) {
		return 5;
	}

	if (gamePiano[5] == player.slug && gamePiano[9] == player.slug && gamePiano[1] == null) {
		return 1;
	}

	if (gamePiano[3] == player.slug && gamePiano[5] == player.slug && gamePiano[7] == null) {
		return 7;
	}

	if (gamePiano[7] == player.slug && gamePiano[3] == player.slug && gamePiano[5] == null) {
		return 5;
	}

	if (gamePiano[5] == player.slug && gamePiano[7] == player.slug && gamePiano[3] == null) {
		return 3;
	}

	return false;
};

GameAI.prototype.AIChoice = function(forcedChoice) {

	console.log(forcedChoice);

	forcedChoice = forcedChoice || null;
	console.log(forcedChoice);

	if (!forcedChoice) {

		console.log("[AI] - AI is making a choice");
		console.log("[AI] - Probs are this one : ");

		var bestProb = [];
		console.log(bestProb);
		$.each(gameMap,function(index,square){
			bestProb[index] = parseInt(square.prob);
		});
		console.log(bestProb);


		var maxValue = 0;
		bestProb.forEach(function(value, index){
			if (value > maxValue)
				maxValue = value;
		});

		bestProb.forEach(function(value, index){	
			if (value < maxValue)
				delete bestProb[index];
		});


		var squares = [];
		bestProb.forEach(function(value, index){
			console.log("[BESTPROB] index -> " + index);
			console.log("[BESTPROB] value -> " + value);
			if ($('.square[data-id=' + index + ']').attr('data-belong') == "false")
				squares.push(index);
		});	


		console.log("[AI] - AI has possible choices : " );
		console.log(squares);

		var choosenSquare = squares[Math.floor(Math.random() * squares.length)];

		gameMap[choosenSquare].prob = parseInt(0);
	} else {
		var choosenSquare = forcedChoice;
		console.log("[AI] - The choice is forced to : " + choosenSquare );
	}

	this.AIClick(choosenSquare);
};

GameAI.prototype.onValidateTour = function(){
	Game.prototype.onValidateTour.call(this);	

	if (this.getCurrentTurn().slug == "player2") {
		var winner = this.willBeWinner();
		if (winner) {
			this.AIChoice(winner);
		} else {
			this.buildNewProbs();
			this.AIChoice();
		}
	}
}

GameAI.prototype.AIClick = function(square) {
	$('.square[data-id=' + square + ']').click();
    Materialize.toast("L'IA a choisit sa case (" + square + ')', 5000);
	setTimeout(function(){
		$('#validateTourButton').trigger("click");
	},800);
};