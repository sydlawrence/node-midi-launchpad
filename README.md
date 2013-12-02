
Launchpad Node Module
=====================

Installation
------------

  npm install launchpad

Usage
-----

  var midiConnector = require('launchpad').connect(midiport);

  // wait for the connector to be ready
  midiConnector.on("ready",function(launchpad) {
    console.log("Launchpad ready, let's do something");
  });

Colors
------

  launchpad.colors.off;
  launchpad.colors.red.low;
  launchpad.colors.red.medium;
  launchpad.colors.red.high;
  launchpad.colors.green.low;
  launchpad.colors.green.medium;
  launchpad.colors.green.high;
  launchpad.colors.orange.low;
  launchpad.colors.orange.medium;
  launchpad.colors.orange.high;
  launchpad.colors.yellow.low;
  launchpad.colors.yellow.medium;
  launchpad.colors.yellow.high;

Functions
---------

  // turn off all the lights
  launchpad.clear();


  // light up all buttons
  launchpad.allLight(color);

  // display a chatacter on the launchpad
  launchpad.displayCharacter("S", color);

  // display a string by flashing between the characters
  launchpad.displayString("@sydlawrence", color);

  //use the launchpad as a scrolling display
  launchpad.scrollString("@sydlawrence", color);

  // render specific colors in specific buttons all at once
  // 0 or " " for "off"
  // y for yellow
  // r for red
  // g for green
  // o for orange
  launchpad.renderBytes(
    [
      ["0","g","G"," "," ","g","G","0"],
      ["g"," ","G"," "," ","g"," ","G"],
      ["g","g","g"," "," ","g","g","g"],
      [" "," "," "," ","g"," "," "," "],
      [" "," "," "," ","g"," "," "," "],
      ["g"," "," ","g","g"," "," ","g"],
      [" ","g"," "," "," "," ","g"," "],
      [" "," ","G","g","g","g"," "," "],
      ["r","r","r"," "," ","r","r","r"] // the special row at the top
    ]
  );

Buttons
-------

  // get a button 
  var button = launchpad.getButton(1,1);

  // light up a button
  button.light(color);

  // get the current color
  button.getState();

  button.x; // the x co-ord
  button.y; // the y co-ord
  button.special; // if the button is "special"

Events
------

  button.on("press", callback);
  button.on("release", callback);

  launchpad.on("press", callback);
  launchpad.on("release", callback);



 /\___/\
( o   o )
(  =^=  )
(        )
(         )
(          )))))))))))

e   e  e eeee    eeeeeee eeeee eeeee eeee    eeeee e   e e  eeeee
8   8  8 8       8  8  8 8   8 8   8 8         8   8   8 8  8   "
8e  8  8 8eee    8e 8  8 8eee8 8e  8 8eee      8e  8eee8 8e 8eeee
88  8  8 88      88 8  8 88  8 88  8 88        88  88  8 88    88
88ee8ee8 88ee    88 8  8 88  8 88ee8 88ee      88  88  8 88 8ee88
