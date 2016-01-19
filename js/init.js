(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('#modal1').openModal();
    $('#modal1 form').submit(function(e){
    	e.preventDefault();
    	e.stopPropagation();
    	var game = new Game($('input[name=player1name]').val(),$('input[name=player2name]').val());
    	game.init();
    	$('#modal1').closeModal();
    })

    $('#restartGameButton').click(function(){
    	location.reload();
    })

  }); // end of document ready
})(jQuery); // end of jQuery name space


var Game = function(player1name, player2name){

	this.player1 = {
		name : player1name
	};

	this.player2 = {
		name : player2name
	};

	this.gameTurn = this.player1;

	this.init = function(){
		$('#player1nameholder').html(this.player1.name);
		$('#player2nameholder').html(this.player2.name);
		$('#currentplayernameholder').html(this.player1.name);
	}
}