
jQuery.fn.exists = function(){return this.length>0;}

$(document).ready(function(){

    var modalsOptions = {
                dismissible: false, // Modal can be dismissed by clicking outside of the modal
                opacity: .2, // Opacity of modal background
                in_duration: 300, // Transition in duration
                out_duration: 200, // Transition out duration
            };

    switch($('body').attr('data-gameMode')) {
        case 'AI':
            $('#modalIntro').openModal(modalsOptions);

            $('#modalIntro form').submit(function(e){
                e.preventDefault();
                e.stopPropagation();
                game = new GameAI($('input[name=player1name]').val(),"Ordinateur");
                console.log(game);
                game.init();
            });
            break;

        case 'PVP':
            $('#modalIntro').openModal(modalsOptions);

            $('#modalIntro form').submit(function(e){
                e.preventDefault();
                e.stopPropagation();
                game = new Game($('input[name=player1name]').val(),$('input[name=player2name]').val());
                game.init();
            });
            break;

        case 'online':
            $('#WaitingModal').openModal(modalsOptions);
            socket.emit('ready',{ readyPlayer : sessionStorage.getItem('localPlayerName'), room : currentRoom });
            socket.on('startGame', function (data) {
                Console.log('Start Game okey !');
                game = new Game(data.player1,data.player2);
                game.init();
                $('#WaitingModal').closeModal();
            });        
            break;

        default:
            $('#modalIntro').openModal(modalsOptions);

            $('#modalIntro form').submit(function(e){
                e.preventDefault();
                e.stopPropagation();
                game = new Game($('input[name=player1name]').val(),$('input[name=player2name]').val());
                game.init();
            });

            break;
    }
});