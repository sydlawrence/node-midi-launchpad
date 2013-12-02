var _ = require("underscore");
var Backbone = require("backbone");
var Launchpad = require("./launchpad");

/*
 * Button
 * Represents a single button on the Launchpad
 */
var Button = function(launchpad, note, y) {
    this.launchpad = launchpad;


    _.extend(this, Backbone.Events);

    this._grid = launchpad;
    this._state = launchpad.LED_OFF;
    var that = this;

    this._uuid = [];

    this.special = false;

    // Are we being assigned via a note or x, y?
    if(y === undefined) {
        var map = mapButtonToLaunchpad(note);
        this.x = map[0];
        this.y = map[1];
    } else {
        this.x = note;
        this.y = y;
    }

    if (launchpad.specials[this.y][this.x] !== undefined) {
        this.special = launchpad.specials[this.y][this.x];
    }

    this.light = function(color) {
        this.stopBlink();
        if(color === undefined)
            color = launchpad.colors.red.high;
        if (this._state === color) return;

        // Send the instruction to the launchpad
        if(this.y === 8)
            launchpad.output.sendMessage([176, this.toNote(), color]);
        else
            launchpad.output.sendMessage([144, this.toNote(), color]);

        // Save the state
        this._state = color;
        this.trigger("state_change");

    };

    this.setState = function(state) {
        if (this._state === state) return;
        // Send the instruction to the launchpad
        if(this.y === 8)
            launchpad.output.sendMessage([176, this.toNote(), state]);
        else
            launchpad.output.sendMessage([144, this.toNote(), state]);

        // Save the state
        this._state = state;
        this.trigger("state_change");
    };

    this.dark = function() {
        if (this._state === Launchpad.colors.off) return;

        if(this.y === 8)
            launchpad.output.sendMessage([176, this.toNote(), Launchpad.colors.off]);
        else
            launchpad.output.sendMessage([144, this.toNote(), Launchpad.colors.off]);

        this._state = Launchpad.colors.off;
        this.trigger("state_change");
    };

    // this.on("press", function() {
    //     launchpad.trigger("press",that);
    // });

    // this.on("release", function() {
    //     launchpad.trigger("release",that);
    // });

    // this.on("state_change", function() {
    //     launchpad.trigger("state_change",that);
    // });

    this.startBlink = function(color) {
        this._blink_color = color;
        this._grid._blinking.push(this);

        // If we're adding the first blinking LED, start the interval
        if(this._grid._blinking.length == 1)
            this._grid._blink_interval = setInterval(this._grid._tick, 500);
        this.trigger("state_change");
    };

    this.stopBlink = function() {
        if (this._grid._blinking === undefined)
            this._grid._blinking = [];
        var index = this._grid._blinking.indexOf(this);
        if(index === -1)
            return;

        delete this._blink_color;
        this._grid._blinking.splice(index, 1);
        this.trigger("state_change");
    };

    this.getState = function() {
        return this._state;
    };

    // Converts x,y -> MIDI note
    this.toNote = function() {
        if(this.y == 8)
            return 104 + this.x;
        else
            return (this.y * 16) + this.x;
    };
    this.toString = function() {
        return "(" + this.x + ", " + this.y + ")";
    }
};

var mapButtonToLaunchpad = function (note) {
    // For right buttons
    if(note % 8 === 0 && ((note / 8) % 2 == 1))
        return [8, Math.floor(note / 8 / 2)];

    var x = note % 8;
    var y = Math.floor(note / 8) / 2;
    return [x, y];
};

exports.Button = Button;
