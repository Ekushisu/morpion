
jQuery.fn.exists = function(){return this.length>0;}

$(document).ready(function(){
    switch($('body').attr('data-gameMode')) {
        case 'AI':
            $('#modalIntro').openModal({
                dismissible: false, // Modal can be dismissed by clicking outside of the modal
                opacity: .2, // Opacity of modal background
                in_duration: 300, // Transition in duration
                out_duration: 200, // Transition out duration
            });

            $('#modalIntro form').submit(function(e){
                e.preventDefault();
                e.stopPropagation();
                game = new GameAI($('input[name=player1name]').val(),"Ordinateur");
                console.log(game);
                game.init();
            });
            break;

        case 'PVP':
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
            });
            break;

        default:
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
            });

            break;
    }
});