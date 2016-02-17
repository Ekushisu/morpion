
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
        res.render('gameOnline.twig', new utils.injectGlobalData(globalData,{
            roomID : req.params.gameid
        }));
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

        socket.on('matchmaking', function (pseudo) {
            console.log("onMatchmaking (" + pseudo + ")");
            client = [socket.id, pseudo];
            waiting.push(client);
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

        socket.on('ready', function (data) {
            console.log(data.readyPlayer + " is ready");
            var gameReady = true;

            if (typeof data.room  == 'undefined')
                return false;

            if(typeof rooms[data.room] == 'undefined'){
                rooms[data.room] = [];
                rooms[data.room]['players'] = new Array();
                rooms[data.room]['players'].push([socket.id, data.readyPlayer]);
                gameReady = false;
                console.log("Room " + data.room + " created");
            } else {
                console.log("Room " + data.room + " already exist, " + rooms[data.room]['players'][0] + " is waiting inside");
                rooms[data.room]['players'].push([socket.id, data.readyPlayer]);
                gameReady = true;
            }

            if (!gameReady)
                return false;

            console.log("Everybody is ready");
            console.log(rooms[data.room]['players']);

            rooms[data.room]['players'].forEach(function(player){
                io.to(player[0]).emit('startGame', {player1 : rooms[data.room]['players'][0], player2 : rooms[data.room]['players'][1]});
            });
        });
    });