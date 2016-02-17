module.exports.injectGlobalData = function (globalData,o) {
    for (var key in globalData) {
        o[key] = globalData[key];
    }
    return o;
};

module.exports.promptExit = function (prompt,config) {
    console.log("  \n  ## Mom !! Why do you want to kill me :( ! Look at me mommy !!");
    prompt.message = "";
    prompt.delimiter = "";
    prompt.start();
    prompt.get({
        properties: {
            confirm: {
                description: "  Do you want turn off the server ?[Y/N]"
            }
        }
    }, function (err, result) {
        try {
            switch (result.confirm){
                case "N":
                case "n":
                    console.log("\n  ################################################");
                    console.log("  ## phew, I was scared, don't joke with that !  ");
                    console.log("  ## Server still running on :  " + config.host + ":" + config.port);
                    console.log("  ################################################");
                    break;
                default:
                    console.log("  ################################################");
                    console.log("  ##########    See you next time baby    ########");
                    console.log("  ################################################");
                    process.exit();
            }
        } catch(e){
            process.exit();
        }
    });
};