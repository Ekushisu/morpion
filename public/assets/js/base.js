$(document).ready(function(){
	$('.button-collapse').sideNav({
			menuWidth: 300, // Default is 240
			edge: 'left', // Choose the horizontal origin
			closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
		}
	);

	$('.playOnlineButton').click(function(){
    	$('#modalIntro').closeModal();
    	$('#modalEndGame').closeModal();

		$('#modalOnlineForm').openModal({
	        dismissible: false, // Modal can be dismissed by clicking outside of the modal
	        opacity: .2, // Opacity of modal background
	        in_duration: 300, // Transition in duration
	        out_duration: 200, // Transition out duration
	    });

	    $('#modalOnlineForm form').submit(function(e){
	        e.preventDefault();
	        e.stopPropagation();

	        $(this).parent().fadeOut(500,function(){
	        	$('.progress-container').fadeIn(500);

	        	sessionStorage.setItem("localPlayerName",$("input[name=playerName]").val());
	        });	        
	    });
   	});
});