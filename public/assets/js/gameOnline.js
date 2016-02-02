var GameOnline = function(player1name, player2name){
	Game.call(this, player1name, player2name);
}

GameOnline.prototype = Object.create(Game.prototype);