var Game = function(player1name, player2name){
	this.player1 = {
        slug : 'player1',
		name : player1name,
        turnNumber : 0
	};
	this.player2 = {
        slug : 'player2',
		name : player2name,
        turnNumber : 0
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
        self.onSelectSquare($(this));
    });
    $('#validateTourButton').click(function(){
        self.onValidateTour();
    });
    $('#restartGameButton').click(function(){
        var $toastContent = $('#restarToastContent').html();
        Materialize.toast($toastContent, 5000);
    });
    $('#modalIntro').closeModal();
};


// Setter for selectedSquare;
Game.prototype.setSelectedSquare = function($elem) {
    $elem = $elem || null
    if ($elem)
        //this.selectedSquare = this.getSquareName($elem);
        this.selectedSquare = $elem;
    else
        this.selectedSquare = null;

    return this.selectedSquare;
};

// Getter for selectedSquare;
Game.prototype.getSelectedSquare = function() {
    return this.selectedSquare;
};

Game.prototype.increasePlayerTurnNumber = function() {
    this.getCurrentTurn().turnNumber++;
    return true;
};

Game.prototype.getCurrentPlayerTurnNumber = function() {
    return this.getCurrentTurn().turnNumber;
};

Game.prototype.setCurrentTurn = function(player) {
    this.gameTurn = player;
    return this.gameTurn;
};

// Return the slug of current player term
Game.prototype.getCurrentTurn = function()
{
    return this.gameTurn;
}

Game.prototype.changeTurn = function() {
    if (this.getCurrentTurn().slug == "player1")
    {
        this.setCurrentTurn(this.player2);
        $('body').attr("data-currentTurn", this.getCurrentTurn().slug);
    } else {
        this.setCurrentTurn(this.player1);
        $('body').attr("data-currentTurn", this.getCurrentTurn().slug);
        $('#currentplayernameholder').html(this.getCurrentTurn().name);
    }

    return true;
};

Game.prototype.findEndGame = function() {
    var self = this;

    if (this.getCurrentPlayerTurnNumber() < 3)
        return false;

    // Check if player 1 got a line
    var lineFound = false; // initialization

    if (gamePiano[1] != null && gamePiano[1] == gamePiano[4] && gamePiano[1] == gamePiano[7])  
        lineFound = [1,4,7];
    if (gamePiano[2] != null && gamePiano[2] == gamePiano[5] && gamePiano[2] == gamePiano[8])  
        lineFound = [2,5,8];
    if (gamePiano[3] != null && gamePiano[3] == gamePiano[6] && gamePiano[3] == gamePiano[9])  
        lineFound = [3,6,9];
    if (gamePiano[1] != null && gamePiano[1] == gamePiano[2] && gamePiano[1] == gamePiano[3])  
        lineFound = [1,2,3];
    if (gamePiano[5] != null && gamePiano[5] == gamePiano[6] && gamePiano[5] == gamePiano[4])  
        lineFound = [5,6,4];
    if (gamePiano[8] != null && gamePiano[8] == gamePiano[9] && gamePiano[8] == gamePiano[7])  
        lineFound = [8,9,7];
    if (gamePiano[1] != null && gamePiano[1] == gamePiano[5] && gamePiano[1] == gamePiano[9])  
        lineFound = [1,5,9];
    if (gamePiano[3] != null && gamePiano[3] == gamePiano[5] && gamePiano[3] == gamePiano[7])  
        lineFound = [3,5,7];
    if (gamePiano[3] != null && gamePiano[3] == gamePiano[5] && gamePiano[3] == gamePiano[7])  
        lineFound = [3,5,7];


    if (!lineFound) {
        var freeCaseCount = $('[data-belong=false]').length;
        if (freeCaseCount == 0) {
            $('#endHeadText').html('Aucun gagnant sur cette partie :/')
            $('#endGameReason').html('La grille a été complétée');
            $('#modalEndGame').openModal({
              dismissible: false, // Modal can be dismissed by clicking outside of the modal
              opacity: .2, // Opacity of modal background
              in_duration: 300, // Transition in duration
              out_duration: 200, // Transition out duration
            });

        };
        return false;
    }

    var winner = $('.square[data-id=' + lineFound[0] + ']').data('belong');
    
    $('#endHeadText').html(this[winner].name + ' a gagné la partie !');
    $('#endGameReason').html('Une ligne a été complétée');
    $('#modalEndGame').openModal({
      dismissible: false, // Modal can be dismissed by clicking outside of the modal
      opacity: .2, // Opacity of modal background
      in_duration: 300, // Transition in duration
      out_duration: 200, // Transition out duration
    });

    return true;
};

// Triggered when a square is clicked
Game.prototype.onSelectSquare = function($elem) {

    if ($elem.attr('data-belong') != "false") {
        Materialize.toast("La case est déjà marqué par " + this[$elem.attr('data-belong')].name, 5000);
        return false;
    }

    if ($elem.attr('data-selected') == "false")
    {
        // Changing the selectedSquare
        this.setSelectedSquare($elem);
        $('.square:not([data-selected=false])').attr('data-selected', "false");
        $elem.attr('data-selected',this.getCurrentTurn().slug);
        $('#validateTourButton').removeClass('disabled');
    } else {
        // Unselect
        this.setSelectedSquare();
        $('.square:not([data-selected=false])').attr('data-selected', "false");
        $('#validateTourButton').addClass('disabled');
    }

    return true;
};

Game.prototype.onValidateTour = function() {
    if ($('#validateTourButton').hasClass('disabled'))
        return false;

    if($('[data-selected=false]').length == 9)
        return false;

    $('#validateTourButton').addClass('disabled');
    this.getSelectedSquare().attr('data-selected', false);
    this.getSelectedSquare().attr('data-belong', this.getCurrentTurn().slug);
    gamePiano[this.getSelectedSquare().data('id')] = this.getCurrentTurn().slug;
    this.increasePlayerTurnNumber();
    this.findEndGame();
    this.changeTurn();

    return true;
};