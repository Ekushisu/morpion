var game;
var gameMap = {
    1 : {
        coord : [0,0],
        hoodies : [2,5,4],
        prob : 3
    },
    2 : {
        coord : [0,1],
        hoodies : [1,4,5,6,3],
        prob : 2
    },
    3 : {
        coord : [0,2],
        hoodies : [2,5,6],
        prob : 3
    },
    4 : {
        coord : [1,0],
        hoodies : [1,2,5,8,7],
        prob : 2
    },
    5 : {
        coord : [1,1],
        hoodies : [1,2,3,4,6,7,8,9],
        prob : 4
    },
    6 : {
        coord : [1,2],
        hoodies : [3,2,5,8,9],
        prob : 2
    },
    7 : {
        coord : [2,0],
        hoodies : [4,5,8],
        prob : 3
    },
    8 : {
        coord : [2,1],
        hoodies : [7,4,5,6,9],
        prob : 2
    },
    9 : {
        coord : [2,2],
        hoodies : [6,5,8],
        prob : 3
    }
};

var gamePiano = {
    1 : null,
    2 : null,
    3 : null,
    4 : null,
    5 : null,
    6 : null,
    7 : null,
    8 : null,
    9 : null
};


var lines = {
    1 : 1,
    2 : 1,
    3 : 1
}

var cols = {
    1 : 1,
    2 : 1,
    3 : 1
}

var diag = {
    1 : 1,
    2 : 1
}

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};