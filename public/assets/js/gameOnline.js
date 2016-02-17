var GameOnline = function(player1, player2){
	Game.call(this, player1[1], player1[1]);
	this.player1.socket = player1[0];
	this.player2.socket = player2[0];
}

GameOnline.prototype = Object.create(Game.prototype);