(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('#modal1').openModal();
    $('#modal1 form').submit(function(e){
    	e.preventDefault();
    	e.stopPropagation();
    	var game = new Game($('input[name=player1name]').val(),$('input[name=player2name]').val());
    	game.init();

        setInterval(function(e){
            console.log(game.getSelectedSquare());
        },200)
    })

    $('#restartGameButton').click(function(){
    	location.reload();
    })

  }); // end of document ready
})(jQuery); // end of jQuery name space


var Game = function(player1name, player2name){
	this.player1 = {
        slug : 'player1',
		name : player1name
	};
	this.player2 = {
        slug : 'player2',
		name : player2name
	};
    this.selectedSquare = false;
	this.gameTurn = this.player1;

    return this;
}

Game.prototype.init = function() {
    var self = this;
    $('#player1nameholder').html(this.player1.name);
    $('#player2nameholder').html(this.player2.name);
    $('#currentplayernameholder').html(this.player1.name);
    $('.square[data-belong=false]').click(function(){
        self.OnSelectSquare($(this));
    });
    $('#modal1').closeModal();
};


// Setter for selectSquare;
Game.prototype.setSelectedSquare = function($elem) {
    $elem = $elem || null
    if ($elem)
        this.selectSquare = this.getSquareName($elem);
    else
        this.selectSquare = null;

    return this.selectSquare;
};

// Getter for selectSquare;
Game.prototype.getSelectedSquare = function() {
    return this.selectSquare;
};

// Return the name of a clicked element to use it as a slug (sq-x-y)
Game.prototype.getSquareName = function($elem) {
    return "sq-" + $elem.attr('data-x') + "-" + $elem.attr('data-y');
};


Game.prototype.setCurrentTurn = function(player) {
    this.gameTurn = player.slug;
    console.log('The hand is to ' + player.name + '(' + player.slug + ')');
    return this.gameTurn;
};

// Return the slug of current player term
Game.prototype.getCurrentTurn = function()
{
    return this.gameTurn.slug;
}

// Triggered when a square is clicked
Game.prototype.OnSelectSquare = function($elem) {

    if ($elem.attr('data-belong') != "false")
        return false;

    if ($elem.attr('data-selected') == "false")
    {
        // Changing the selectedSquare
        this.setSelectedSquare($elem);
        $('.square:not([data-selected=false])').attr('data-selected', "false");
        $elem.attr('data-selected',this.getCurrentTurn());
        $('#validateTourButton').removeClass('disabled');
    } else {
        // Unselect
        this.setSelectedSquare();
        $('.square:not([data-selected=false])').attr('data-selected', "false");
        $('#validateTourButton').addClass('disabled');
    }
    
    return true;
};