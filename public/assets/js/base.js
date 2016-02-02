$(document).ready(function(){
	var gameReady = false;
	var tmp = {};

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

	        	tmp.playerName = $("input[name=playerName]").val();	        	
 

			    var socket = io.connect('http://' + config.host + ':' + config.port);
			        socket.emit('index');
			        socket.on('matched', function (nemesis) {
			            url_room = 'http://' + config.host + ':' + config.port + "/one-o-web/" + nemesis.room;
			            $('.progress-container').find('p').html('We found your challenger !');
			            $('.progress-container').find('p').append('<h5>' + tmp.playerName + ' vs ' + nemesis.pseudo + '</h5>');
			            setTimeout(function(){
				 			$('.progress-container').find('p').append('<h4 class="counting">10</h4>')	 
					 		setTimeout(function(){
					 			$('.progress-container').find(".counting").html("9");
						 		setTimeout(function(){
						 			$('.progress-container').find(".counting").html("8");
							 		setTimeout(function(){
							 			$('.progress-container').find(".counting").html("7");
								 		setTimeout(function(){
								 			$('.progress-container').find(".counting").html("6");
									 		setTimeout(function(){
									 			$('.progress-container').find(".counting").html("5");
										 		setTimeout(function(){
										 			$('.progress-container').find(".counting").html("4");
											 		setTimeout(function(){
											 			$('.progress-container').find(".counting").html("3");
												 		setTimeout(function(){
												 			$('.progress-container').find(".counting").html("2");
													 		setTimeout(function(){
													 			$('.progress-container').find(".counting").html("1");
														 		setTimeout(function(){
														 			$('.progress-container').find(".counting").html("0");
																	window.location.replace(url_room);
														 		},1000); 
													 		},1000); 
												 		},1000); 
											 		},1000); 
										 		},1000); 
									 		},1000); 
								 		},1000); 
							 		},1000); 
						 		},1000); 
					 		},1000); 
				 		},1000); 	 	
			        });

	        	sessionStorage.setItem("localPlayerName", tmp.playerName);
				socket.emit('matchmaking', tmp.playerName);
	        });	        
	    });
   	});
});