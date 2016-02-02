
var express = require('express'),
    app = express(),
    twig = require('twig'),
    http = require('http').Server(app),
    io = require('socket.io').listen(http),
    routes = require(__dirname + '/app/routes.json'),
    ON_DEATH = require('death'),
    prompt = require('prompt'),
    utils = require(__dirname + '/app/utils.js'),
    controllers = require(__dirname + '/app/controllers.js');

    //**********************//
    //  NODE/EXPRESS LOGIC  //
    //**********************//

    try {
        var config = require(__dirname + '/app/config.json');
    } catch (e) {
        if (e.code == "MODULE_NOT_FOUND")
            console.log('No config file found in /app/, please use config.exemple.json and rename it in config.json');

        console.log(e);
        process.exit();
    }

    var globalData = {
        "routes" : routes,
        "config" : config
    }

    app.set('views', __dirname + '/views');
    app.set('view engine', 'twig');
    app.engine('html', twig.__express);
    app.use(express.static(__dirname + '/public/assets'));

    app.get(routes.home, function(req, res){
        res.render('index.twig', globalData);
    });

    app.get(routes.game, function(req, res){
        res.render('game.twig', globalData);
    });

    app.get(routes.gameAI, function(req, res){
        res.render('gameAI.twig', globalData);
    });

    app.get(routes.gameOnline, function(req, res){
        var data = controllers.home([req.params.gameid]) || {};
        data.req = req;
        res.render('gameOnline.twig', new utils.injectGlobalData(globalData,{}));
    });


    app.get('*', function(req, res){
        res.status(404);
        res.render('404.twig', new utils.injectGlobalData(globalData,{}));
    });


    http.listen(3000, function(){
        console.log("\n \n  ################################################");
        console.log("  ## Hello, I'm running fast for you :) ♥ nodeJS ");
        console.log("  ## Server is now running on :  " + config.host + ":" + config.port);
        console.log("  ################################################ \n \n");
    });

    ON_DEATH(function(signal, err) {
        new utils.promptExit(prompt,config);
    })

    process.on('uncaughtException', function(err) {
        if(err.errno === 'EADDRINUSE') {
            console.log("  ######################################################");
            console.log("  ## Hmm, something is already running on " + config.host + ":" + config.port);
            console.log("  ###################################################### \n \n");
        } else {
            console.log(err);
        }
        process.exit(1);
    });




    //****************//
    //  SOCKET LOGIC  //
    //****************//

    var rooms = {};
    var players = [];
    var waiting = [];
    var pseudos = [];
    var words = [];
    var countdown;
    var timers = [];
    var template;

    io.sockets.on('connection', function (socket) {
        socket.join(socket.id);

        socket.on('index', function () {
            console.log("Connexion d'un joueur ("+ socket.id + ")");
        });

        socket.on('newClient', function (data) {
            if(typeof rooms[data.room] == 'undefined' ){
                rooms[data.room] = [];
                rooms[data.room]['pseudos'] = [];
                rooms[data.room]['players'] = [];
                rooms[data.room]['timer'] = [];
                console.log("Room " + data.room + " created");
            }

            if (rooms[data.room]['pseudos'].length < 2) {
                socket.join(data.room);
                rooms[data.room]['name'] = data.room;
                rooms[data.room]['pseudos'].push(data.pseudo);
                words[data.pseudo] = [];
                console.log(data.pseudo  + " connected on " + data.room);

                socket.pseudo = data.pseudo;
                socket.ready = false;
                socket.score = 0;
                socket.room = data.room;
                rooms[data.room]['players'].push(socket);
                socket.broadcast.to(data.room).emit('newClient', data.pseudo);
                socket.broadcast.to(data.room).emit('update_joueurs',  rooms[data.room]['pseudos']);
                output = template.render({
                    rooms: rooms
                });
                socket.broadcast.emit('update_list', output);
                if (rooms[data.room]['pseudos'].length == 2) {
                    socket.emit('adversaire_name',  rooms[data.room]['pseudos'][0]);
                    socket.broadcast.to(data.room).emit('game_ready',  rooms[data.room]['pseudos']);
                    socket.emit('game_ready',  rooms[data.room]['pseudos']);
                }
                else socket.emit('wait_joueur');
            }
            else socket.emit('too_much_players');
        });

        socket.on('matchmaking', function (pseudo) {
            console.log("onMatchmaking (" + pseudo + ")");
            client = [socket.id, pseudo];
            waiting.push(client);
            console.log(waiting);
            console.log(socket.connected);
            if(waiting.length >= 2){
                nj1 = Math.floor(Math.random() * waiting.length);
                j1 = waiting[nj1];
                waiting.splice(nj1, 1);
                nj2 = Math.floor(Math.random() * waiting.length);
                j2 = waiting[nj2];
                waiting.splice(nj2, 1);

                var room_name = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for( var i=0; i < 5; i++ )
                    room_name += possible.charAt(Math.floor(Math.random() * possible.length));

                console.log(j1[1] + ' vs ' + j2[1] )
                io.to(j1[0]).emit('matched', {pseudo:j2[1], room:room_name});
                io.to(j2[0]).emit('matched', {pseudo:j1[1], room:room_name});
            }

        });

        socket.on('disconnect', function (pseudo) {
            if (socket.pseudo != null) {
                var i = rooms[socket.room]['players'].indexOf(socket);
                clearInterval(rooms[socket.room]['timer']['timer']);
                console.log(i);
                rooms[socket.room]['pseudos'].splice(i, 1);
                rooms[socket.room]['players'].splice(i, 1);
                socket.ready = false;
                socket.broadcast.to(socket.room).emit('wait_joueur');
                socket.broadcast.to(socket.room).emit('disconnected', socket.pseudo);
                console.log(socket.pseudo + " disconnected from " + socket.room );
                if(rooms[socket.room]['pseudos'].length == 0){
                    clearInterval(rooms[socket.room]['timer']['timer']);
                    delete rooms[socket.room];
                    console.log("Room " + socket.room + " deleted (not enought players)");
                }
                output = template.render({
                    rooms: rooms
                });
                socket.broadcast.emit('update_list', output);
            }
        });


        socket.on('ready', function (ready) {
            gameReady = true;
            console.log(socket.pseudo + " est prêt");
            socket.ready = true;
            console.log(socket.ready);
            rooms[socket.room]['players'].forEach(function (player, index) {
                console.log(player.ready);
                if (gameReady)
                    gameReady = !!player.ready;
            });
            if (gameReady)
                rooms[socket.room]['players'].forEach(function (player, index) {
                    player.ready = false;
                });

                var possible = "abcdefghijklmnopqrstuvwxyz";
                letter = possible.charAt(Math.floor(Math.random() * possible.length));
                console.log(letter);
                io.sockets.to(socket.room).emit('start_game', letter);
                rooms[socket.room]['timer']['countdown'] = 60;

                rooms[socket.room]['timer']['timer'] = setInterval(function() {
                    rooms[socket.room]['timer']['countdown']--;
                    if (rooms[socket.room]['timer']['countdown'] >= 0)
                        io.sockets.to(socket.room).emit('timer', { countdown: rooms[socket.room]['timer']['countdown'] });
                    else {
                        clearInterval(rooms[socket.room]['timer']['timer']);
                        io.sockets.to(socket.room).emit('stop_game');
                    }
                }, 1000);   
        });
    });