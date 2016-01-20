
var game;
jQuery.fn.exists = function(){return this.length>0;}

$(document).ready(function(){
    $('.button-collapse').sideNav();
    $('#modalIntro').openModal({
        dismissible: false, // Modal can be dismissed by clicking outside of the modal
        opacity: .2, // Opacity of modal background
        in_duration: 300, // Transition in duration
        out_duration: 200, // Transition out duration
    });

    $('#modalIntro form').submit(function(e){
        e.preventDefault();
        e.stopPropagation();
        game = new Game($('input[name=player1name]').val(),$('input[name=player2name]').val());
        game.init();
    })
});

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

// Return the name of a clicked element to use it as a slug (sq-x-y)
// Deprecated
/*Game.prototype.getSquareName = function($elem) {
    return "sq-" + $elem.attr('data-x') + "-" + $elem.attr('data-y');
};*/


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
    var freeCaseCount = $('[data-belong=false]').length;

    // Game map full
    if (freeCaseCount == 0) {
        $('#endHeadText').html('Aucun gagnant sur cette partie :/')
        $('#endGameReason').html('La grille a été complété');
        $('#modalEndGame').openModal({
          dismissible: false, // Modal can be dismissed by clicking outside of the modal
          opacity: .2, // Opacity of modal background
          in_duration: 300, // Transition in duration
          out_duration: 200, // Transition out duration
        });
    };

    // Check if player 1 got a line
    var lineFound = false; // initialization

    $('.square').each(function(){
       /* var aligned = 0;
        var currentX = $(this).data('x');
        var currentY = $(this).data('y');

        for (var x = (currentX - 1); x <= (currentX + 1; x++) {
            for (var y = (currentY - 1); y <= (currentX + 1); y++) {
                var testedCase = $(".square[data-x=" + x + "][data-y=" + y + "]");
                if (!testedCase.exists())
                    continue;

                if (testedCase.data('belong') != self.player1.slug)
                    continue;

                if (currentX == x && currentY == y)
                    continue;
                aligned++;
            };
        };

        if (aligned >= 2) {
            alert("WE GOT A WINNEr");
        };*/
    });

    /*for (var x = 0; x <= 2; x++) {
        for (var y = 0; y <= 2; y++) {
            var testedCase = $(".square[data-x=" + x + "][data-y=" + y + "]");
            if (testedCase.data('belong') != self.player1.slug)
                continue;
        };
    };*/
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
    this.findEndGame();
    this.changeTurn();

    return true;
};