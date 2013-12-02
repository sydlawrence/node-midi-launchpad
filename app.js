var launchpadConnect = require('launchpad').connect(1);

launchpadConnect.on("ready",function(launchpad) {
  console.log("Launchpad ready");
  
  // launchpad.allDark();

  // launchpad.allLight(launchpad.colors.green.high);

  // launchpad.getButton(1,1).light(launchpad.colors.red.high)

  // launchpad.displayCharacter("S");

  // launchpad.displayString("@sydlawrence");

  // launchpad.scrollString("@sydlawrence");

// launchpad.colors.off
// launchpad.colors.red.low
// launchpad.colors.red.medium
// launchpad.colors.red.high
// launchpad.colors.green.low
// launchpad.colors.green.medium
// launchpad.colors.green.high
// launchpad.colors.orange.low
// launchpad.colors.orange.medium
// launchpad.colors.orange.high
// launchpad.colors.yellow.low
// launchpad.colors.yellow.medium
// launchpad.colors.yellow.high

  
  launchpad.renderBytes(
    [
      ["0","g","G"," "," ","g","G","0"],  // 0 or " " for "off"
      ["g"," ","G"," "," ","g"," ","G"],  // r for red
      ["g","g","g"," "," ","g","g","g"],  // g for green
      [" "," "," "," ","g"," "," "," "],  // o for orange
      [" "," "," "," ","g"," "," "," "],  // y for yellow
      ["g"," "," ","g","g"," "," ","g"],
      [" ","g"," "," "," "," ","g"," "],
      [" "," ","G","g","g","g"," "," "],
      ["r","r","r"," "," ","r","r","r"],  // the top special row
    ]
  );

  launchpad.getButton(1,1).on("press", function() {
    console.log("****                                                                 ouch, my eye     -_ಠ");
  });
  launchpad.getButton(6,1).on("press", function() {
    console.log("****                                                                 ouch, my eye     ಠ_-");
  });

  launchpad.on("press", function(btn) {
    console.log("Pressed: x:"+btn.x+", y:"+btn.y+", state:"+btn.getState()+", special:"+btn.special);

    if (btn.special) {
      btn.light(launchpad.colors.red.high);
    } else {
      btn.light(launchpad.colors.green.high);
    }
  });

  launchpad.on("release", function(btn) {
    console.log("Released: x:"+btn.x+", y:"+btn.y+", state:"+btn.getState()+", special:"+btn.special);
    
    btn.light(launchpad.colors.off);
  });
});

