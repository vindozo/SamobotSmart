commands = {
  /* timers */
  driveTimerId: 0,
  motorTimerId: 0,
  
  /* вспышки смартфоном */
  flash: function(arr){
    engine.flash(arr);
  },
  /* вибрация смартфоном */
  vibrate: function(arr){
    engine.vibrate(arr);
  },
  /* аним.привод вперед */
  driveForward: function(param){
    clearTimeout(commands.driveTimerId);
    engine.arduinoWrite('D1');
    commands.driveTimerId = setTimeout("engine.arduinoWrite('D0');", param*1000);
  },
  /* аним.привод вперед */
  driveBack: function(param){
    clearTimeout(commands.driveTimerId);
    engine.arduinoWrite('D2');
    commands.driveTimerId = setTimeout("engine.arduinoWrite('D0');", param*1000);
  },
  /* привод вперед */
  forward: function(param){
    clearTimeout(commands.motorTimerId);
    engine.arduinoWrite('M1');
    commands.motorTimerId = setTimeout("engine.arduinoWrite('M0');", param*3);
  },
  /* привод назад */
  back: function(param){
    clearTimeout(commands.motorTimerId);
    engine.arduinoWrite('M2');
    commands.motorTimerId = setTimeout("engine.arduinoWrite('M0');", param*3);
  },
  /* привод влево */
  left: function(param){
    var angle = Math.floor(45 + (45 / param ));
    engine.arduinoWrite('S'+ angle);
  },
  /* привод вправо */
  right: function(param){
    var angle = Math.floor(45 - (45 / param ));
    engine.arduinoWrite('S'+ angle);
  },
  /* привод вперед и влево */
  forwardLeft: function(param1, param2){
    commands.left(param1);
    commands.forward(param2);
  },
  /* привод вперед и вправо */
  forwardRight: function(param1, param2){
    commands.right(param1);
    commands.forward(param2);
  },
  /* привод назад и влево */
  backLeft: function(param1, param2){
    commands.left(param1);
    commands.back(param2);
  },
  /* привод назад и вправо */
  backRight: function(param1, param2){
    commands.left(param1);
    commands.right(param2);
  },
  /* светодиод */
  led: function(param){
   engine.arduinoWrite('L'+param);
  }
}
