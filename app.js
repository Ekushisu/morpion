
var express = require('express');
var app = express();
var twig = require('twig');
var http = require('http').Server(app);
var routes = require(__dirname + '/app/routes.json');
var globalData = {
    "routes" : routes
}


var injectGlobalData = function(o) {
    for (var key in globalData) {
        o[key] = globalData[key];
    }
    return o;
}

app.set('views', __dirname + '/views');
app.set('view engine', 'twig');
app.engine('html', twig.__express);
app.use(express.static(__dirname + '/public/assets'));

app.get(routes.home, function(req, res){
    res.render('index.twig', new injectGlobalData({
        "test" : "test"
    }));
});

app.get(routes.game, function(req, res){
    res.render('game.twig');
});

app.get(routes.gameAI, function(req, res){
    res.render('gameAI.twig');
});

app.get(routes.gameOnline, function(req, res){
    res.render('gameOnline.twig');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});