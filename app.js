var launchpadConnect = require('./launchpad').connect(1);

launchpadConnect.on("ready",function(launchpad) {
  console.log("Launchpad ready");
  
  // launchpad.allDark();

  // launchpad.allLight(launchpad.colors.green.high);

  // launchpad.getButton(1,1).light(launchpad.colors.red.high)

  // launchpad.displayCharacter("S");

  // launchpad.displayString("@sydlawrence");

  // launchpad.scrollString("@sydlawrence");
  
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

  launchpad.on("press", function(btn) {
    if (btn.special) {
      btn.light(launchpad.colors.red.high);
    } else {
      btn.light(launchpad.colors.green.high);
    }
    console.log("Pressed: x:"+btn.x+", y:"+btn.y+", state:"+btn.getState()+", special:"+btn.special);
  });

  launchpad.on("release", function(btn) {
    btn.light(launchpad.colors.off);
    console.log("Released: x:"+btn.x+", y:"+btn.y);
  });
});

