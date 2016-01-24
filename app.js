
var express = require('express'),
    app = express(),
    twig = require('twig'),
    http = require('http').Server(app),
    routes = require(__dirname + '/app/routes.json'),
    ON_DEATH = require('death'),
    prompt = require('prompt'),
    utils = require(__dirname + '/app/utils.js'),
    controllers = require(__dirname + '/app/controllers.js');

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