var GameAI = function(player1name, player2name){
	Game.call(this, player1name, player2name);
}

GameAI.prototype = Object.create(Game.prototype);
GameAI.prototype.buildNewProbs = function() {


	return true;
};

GameAI.prototype.getBestProbs = function() {
	var probs = [];
	$.each(gameMap, function(index, square){
		var prob = square.prob;
		console.log(prob);
	});
};

GameAI.prototype.onValidateTour = function(){
	Game.prototype.onValidateTour.call(this);
	this.getBestProbs();
	this.buildNewProbs();
}