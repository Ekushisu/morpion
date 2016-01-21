var GameAI = function(player1name, player2name){
	Game.call(this, player1name, player2name);
}

GameAI.prototype = Object.create(Game.prototype);
GameAI.prototype.buildNewProbs = function() {

	if (gamePiano[1] == this.getNextTurnPlayerSlug() || gamePiano[2] == this.getNextTurnPlayerSlug() || gamePiano[3] == this.getNextTurnPlayerSlug())
		lines[1] = 0;
	if (gamePiano[4] == this.getNextTurnPlayerSlug() || gamePiano[5] == this.getNextTurnPlayerSlug() || gamePiano[6] == this.getNextTurnPlayerSlug())
		lines[2] = 0;
	if (gamePiano[7] == this.getNextTurnPlayerSlug() || gamePiano[8] == this.getNextTurnPlayerSlug() || gamePiano[9] == this.getNextTurnPlayerSlug())
		lines[3] = 0;
	if (gamePiano[1] == this.getNextTurnPlayerSlug() || gamePiano[4] == this.getNextTurnPlayerSlug() || gamePiano[7] == this.getNextTurnPlayerSlug())
		cols[1] = 0;
	if (gamePiano[2] == this.getNextTurnPlayerSlug() || gamePiano[5] == this.getNextTurnPlayerSlug() || gamePiano[8] == this.getNextTurnPlayerSlug())
		cols[2] = 0;
	if (gamePiano[3] == this.getNextTurnPlayerSlug() || gamePiano[6] == this.getNextTurnPlayerSlug() || gamePiano[9] == this.getNextTurnPlayerSlug())
		cols[3] = 0;
	if (gamePiano[1] == this.getNextTurnPlayerSlug() || gamePiano[5] == this.getNextTurnPlayerSlug() || gamePiano[9] == this.getNextTurnPlayerSlug())
		diag[1] = 0;
	if (gamePiano[3] == this.getNextTurnPlayerSlug() || gamePiano[5] == this.getNextTurnPlayerSlug() || gamePiano[7] == this.getNextTurnPlayerSlug())
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

	return true;
};

GameAI.prototype.AIChoice = function() {
	var bestProb = [];
	$.each(gameMap,function(index,square){
		bestProb[index] = parseInt(square.prob);
	});

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
		if ($('.square[data-id=' + index + ']').attr('data-belong') == "false")
			squares.push(index);
	});	

	this.AIClick(squares[Math.floor(Math.random() * squares.length)]);
};

GameAI.prototype.onValidateTour = function(){
	Game.prototype.onValidateTour.call(this);
	this.buildNewProbs();

	if (this.getCurrentTurn().slug == "player2")
		this.AIChoice();
}

GameAI.prototype.AIClick = function(square) {
	$('.square[data-id=' + square + ']').click();
    Materialize.toast("L'IA a choisit sa case (" + square + ')', 5000);
	setTimeout(function(){
		$('#validateTourButton').trigger("click");
	},800);
};