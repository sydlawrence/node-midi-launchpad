var _ = require("underscore");
var Backbone = require("backbone");
var Button = require("./button").Button;
var LawrenceSans = require("./lawrencesans").LawrenceSans;
var midi = require('midi');

/*
 * Launchpad
 * Represents the launchpad as a whole
 */
var Launchpad = function(port, initAnimation) {
    if (initAnimation === undefined) initAnimation = true;
    var name = 0;
    var row = 0;
    var column = 0;
    this.name = name;

    this.row = row;
    this.column = column;

    _.extend(this, Backbone.Events);

    // Some variables
    this._grid = [];
    var that = this;


    this.specials = {
        0:{ 8: ["right","vol"] },
        1:{ 8: ["right","pan"] },
        2:{ 8: ["right","snd A"] },
        3:{ 8: ["right","snd B"] },
        4:{ 8: ["right","stop"] },
        5:{ 8: ["right","trk on"] },
        6:{ 8: ["right","solo"] },
        7:{ 8: ["right","arm"] },
        8:{
            0:["up","page"],
            1:["down","page"],
            2:["left","page"],
            3:["right","page"],
            4:["session","inst"],
            5:["user 1","fx"],
            6:["user 2","user"],
            7:["mixer","mixer"],
            8:null
        }
    };

    this.createButtons = function() {
        // Initialize all of the buttons
        for(var y = 0; y < 9; y++) {
            for(var x = 0; x < 9; x++) {
                if (that._grid[x] === undefined) that._grid[x] = [];
                that._grid[x][y] = new Button(that, x, y);
                (function(x,y) {
                    //that._grid[x][y].dark();
                })(x,y);

            }
        }
    };



    /*
     * Gets a button object from this._grid
     */
    this.getButton = function(x, y) {
        if (y === undefined) {
            y = Math.floor(x/16);
            x = x % 16;
        }

        if (this._grid[x] === undefined || this._grid[x][y] === undefined) {
            return undefined;
        }

        if(y !== undefined)
            return this._grid[x][y];

        var map = mapButtonToLaunchpad(x);
        return this._grid[map[0]][map[1]];
    };

    /*
     * Turns all LEDs off
     */
    this.allDark = function() {
        // Reset the state on all buttons
        for(var x = 0; x < 9; x++) {
            for(var y = 0; y < 9; y++) {
                this._grid[x][y].dark();
            }
        }
    };

    this.clear = this.allDark;

    /*
     * Turns all LEDs on
     */
    this.allLight = function(color) {
        // Reset the state on all buttons
        for(var x = 0; x < 9; x++) {
            for(var y = 0; y < 9; y++) {
                this._grid[x][y].light(color);
            }
        }
    };

    /*
     * Event handler for button press
     */
    this.receiveMessage = function(deltaTime, msg) {
        // We have to do something special for the top buttons
        var button = that.getButton(msg[1]);
        if(msg[0] == "176")
            button = that.getButton(parseInt(msg[1],10) % 8, 8);


        // On or off?
        var state = (parseInt(msg[2], 10) == 127) ? true : false;

        // Emit an event
        if(state) {
            button.trigger("press",deltaTime);
            button.trigger("state_change");
            this.trigger("press", button);
            if (button.special !== false) this.trigger("special_press", button);

        } else {
            button.trigger("release",deltaTime);
            button.trigger("state_change");
            that.trigger("release", button);
            if (button.special !== false) that.trigger("special_release", button);
        }
    };

    this.randomColor = function() {
        var options = [3, 48, 18, 49];
        var rand = Math.floor(Math.random() * options.length);
        return options[rand];
    };

    this.initialize = function() {
        if (!initAnimation) {
            // console.log("hi");
            // that.clear();
            setTimeout(function() {
                that.trigger("ready", that);
                that.ready = true;
            },0);
            return;
        }


        var colors = [
            3, 48, 18, 49, 0
        ];

        for (var j = 0; j < colors.length;j++) {
            var i = colors[j];
            (function(i){
                setTimeout(function() {
                    for(var x = 0; x < 9; x++) {
                        for(var y = 0; y < 9; y++) {
                            (function(x,y){
                                var t = setTimeout(function() {
                                    try {
                                        that._grid[x][y].light(i);
                                        if (i === 0 && x === 8 && y === 8) {
                                            that.trigger("ready", that);
                                            that.ready = true;
                                        }
                                    }
                                    catch (e) {
                                        console.log(x+" "+y);
                                    }
                                },(x+y)*100);
                            })(x,y);
                        }
                    }
                }, 500 * j);
            })(i);
        }
    };


    this.ready = false;
    this.init = function() {
            // Set up a new output.
        this.output = new midi.output();
        // Set up a new input.
        this.input = new midi.input();

        this.createButtons();

        // Open the first available output port.
        this.output.openPort(port);
        this.input.openPort(port);

        // Configure a callback.
        this.input.on('message', function(deltaTime, message) {
            that.receiveMessage(deltaTime, message);
        });

        console.log("running launchpad: "+this.output.getPortName(port));

        this.initialize();
    };

    console.log("setting up Launchpad on port:"+port);
    this.init();

};



Launchpad.prototype.renderBytes = function(bytes, color) {
    if (bytes === undefined) return;
        for (var x = 0; x < bytes.length; x++) {
        var byt = bytes[x];
        for (var y = 0; y < byt.length; y++) {
            if (!this._grid[y][x]) {
                console.log("Button not found: x:"+x+", y:"+y);
                return;
            }
            byt[y] = byt[y].toLowerCase();
            switch (byt[y]) {
                case "1":
                    this._grid[y][x].light(color);
                    break;
                case "r":
                    this._grid[y][x].light(exports.colors.red.high);
                    break;
                case "o":
                    this._grid[y][x].light(exports.colors.orange.high);
                    break;
                case "y":
                    this._grid[y][x].light(exports.colors.yellow.high);
                    break;
                case "g":
                    this._grid[y][x].light(exports.colors.green.high);
                    break;
                case "0":
                    this._grid[y][x].light(exports.colors.off);
                    break;
            }
        }
    }
};

Launchpad.prototype.displayCharacter = function(letter, color) {
  var bytes = LawrenceSans(letter);
  this.renderBytes(bytes, color);
};

Launchpad.prototype.displayString = function(str, delay, callback, color) {
  if (delay === undefined) delay = 500;
  var that = this;
  for (var j = 0; j < str.length; j++) {
    (function(j){
      setTimeout(function() {
        that.displayCharacter(str[j], color);
        if (j+1 === str.length && callback !== undefined) setTimeout(callback, delay);
      }, j*delay);
    })(j);
  }
};

Launchpad.prototype.scrollString = function(str,delay, color, onFinished) {
    var bytes = [];
    for(var i = 0; i < str.length; i++) {
        bytes.push(LawrenceSans(str[i]));
        bytes.push(["0","0","0","0","0","0","0","0"]);
    }
    this.scrollBytes(bytes, delay, color, onFinished);
}

Launchpad.prototype.colorize = function(bytes, colorStr, nullColorStr) {
    for (var i = 0; i < bytes.length; i++) {
        var str = "";
        for (var j = 0; j < bytes[i].length; j++) {
            if (bytes[i][j] === "1") str += colorStr;
            else  str += nullColorStr;
        }
        bytes[i] = str;
    }
    return bytes;
}

Launchpad.prototype.clearScroll = function() {
    clearInterval(this.scrollInterval);
}

Launchpad.prototype.scrollBytes = function(bytes, delay, color, onFinished) {
    var perScreen = 8;
    var charPos = 0;
    var overallBytes = [];
    for (var i= 0; i < bytes[0].length; i++) {
        var toAdd = "";
        for (var j = 0; j < bytes.length;j++) {
            toAdd += bytes[j][i];
        }
        overallBytes.push(toAdd);
    }

    this.scrollInterval;
    var that = this;

    if (delay === undefined) delay = 200;

    var visibleSet = function() {
        var toReturn = [];
        for (var i = 0; i < overallBytes.length; i++) {
            toReturn[i] = new Array(perScreen);
            var str = "";
            for (var j = charPos; j < charPos+perScreen; j++) {
                if (overallBytes[i][j] !== undefined)
                    str += overallBytes[i][j];
                else {
                    clearInterval(interval);
                    return;
                }
            }
            toReturn[i] = str;
        }
        charPos++;
        return toReturn;
    };

    interval = setInterval(function() {
        var set = visibleSet();
        if (set === undefined && typeof onFinished == "function") onFinished();
        else
            that.renderBytes(set, color);
    }, delay);

};



exports.colors = Launchpad.prototype.colors = {
    off: 0,
    red: {
        low: 1,
        medium:2,
        high:3
    },
    yellow: {
        low: 17,
        medium:34,
        high:54
    },
    orange: {
        low: 45,
        medium:46,
        high:23
    },
    green: {
        low: 16,
        medium:32,
        high:48
    }
};

exports.Launchpad = Launchpad;

exports.connect = function(port, initAnimation) {
    return new Launchpad(port, initAnimation);
};