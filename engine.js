/*
  Работа с оборудованием
*/

engine = {
  /* GPS */
  lat:0,
  lon:0,
  gpsError:0,
  watchIDgps:0,
  
  /* батареи */
  battery:0,
  
  /* камера */
  cameraBase64jpeg:'',
  
  /* уровень сигнала и тип подключения к интернету */
  connectedLevel:0,
  connected:'',
  
  /* компас */
  magneticHeading:0,
  watchIDcompass:0,
  
  /* вспышка */
  isSwitchedOn:false,
  
  /* вибратор */
  isVibration:false,
  
  /* uin оборудования */
  uin:'',

  /* обновление GPS */
  lifeGeolocation: function(position) {
    engine.lat = document.getElementById("gpsLat").innerHTML = position.coords.latitude;
    engine.lon = document.getElementById("gpsLon").innerHTML = position.coords.longitude;
  },
  
  /* ошибки GPS */
  errorGeolocation: function(error) {
    if (engine.gpsError != error.code) {
      engine.alert('GPS Error. code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
      navigator.geolocation.clearWatch(engine.watchIDgps);
    }
    engine.gpsError = error.code;
  },
  
  /* обновление компаса */
  lifeMagneticHeading:function(heading) {
    engine.magneticHeading = document.getElementById('compas').innerHTML = heading.magneticHeading;
  },
  
  /* ошибки компаса */
  errorMagneticHeading:function(error) { 
    if (engine.magneticHeading != error.code) {
     engine.alert('Compass error: ' + error.code);
     navigator.compass.clearWatch(engine.watchIDcompass);
    } 
     engine.magneticHeading = error.code;
  },
  
  /* статус батареи */
  batteryStatus: function(info) { 
    engine.battery = document.getElementById("bat").innerHTML = info.level; 
  },
  
  /* обновление камеры */
  lifeCamera: function(){ 
      CameraPreview.takeSnapshot({quality: 80}, function(base64PictureData){
        engine.cameraBase64jpeg = document.getElementById('previewPicture').src = 'data:image/jpeg;base64,' + base64PictureData;
      });
  },
  
  /* обновление сигнала интернета */
  lifeSignal:function(){
    SignalLevel.get(
    function(resp){
      engine.connected = resp.ConnectedFast;
      if( resp.isConnectedWifi ) {
         engine.connectedLevel = resp.WifiSignalLevel;
      } else {
         engine.connectedLevel = resp.MobileSignalLevel;
      }
      document.getElementById("dbm").innerHTML = engine.connected + '/' + engine.connectedLevel;
      setTimeout(engine.lifeSignal, 500);
    }, function(err){
      engine.alert("signal error: "+(err));
    });
  },
    
  /* выполняет последовательность вспышек на смартфоне, аналогично вибратору */
  flash: function (arr){
    if(arr.length > 0) {
      var time = arr.shift(arr);
      setTimeout('engine.flash(' + JSON.stringify(arr) + ')', time);
    } else {
      engine.isSwitchedOn = true;
    } 
    if(engine.isSwitchedOn){
      engine.isSwitchedOn = false;
      cordova.exec(successCallback, errorCallback, "Flashlight", "switchOff", []);
    } else {
      engine.isSwitchedOn = true;
      cordova.exec(successCallback, errorCallback, "Flashlight", "switchOn", []);
    }
  },
  
  /* выполняет последовательность вибраций. массив в милисекундах [вкл.на мил.сек, выкл.и ждать мил.сек., ...] */
  vibrate: function (arr){
    engine.isVibration = navigator.vibrate(arr);
  },
  
  /* стартуем */
  init: function() { 
    /* отключаем спящий режим смартфона */
    window.plugins.insomnia.keepAwake(); 
    /* получаем уникальный номер устройства */
    engine.uin = document.getElementById('UIN').innerHTML = device.uuid;
    /* подвешиваем обработчик gps */
    engine.watchIDgps = navigator.geolocation.watchPosition(engine.lifeGeolocation, engine.errorGeolocation, { timeout: 30000,  maximumAge: 10000, enableHighAccuracy: true });
    /* подвешиваем обработчик батареи */
    window.addEventListener("batterystatus", engine.batteryStatus, false);
    /* включаем камеру в режиме превью*/
    var cameraElem = document.getElementById('previewPicture').getBoundingClientRect();
    CameraPreview.startCamera({
        x: cameraElem.left,
        y: cameraElem.top,
        width: 1,
        height: 1,
        camera: CameraPreview.CAMERA_DIRECTION.FRONT, //BACK
        toBack: false,
        tapPhoto: true,
        tapFocus: false,
        previewDrag: false,
        storeToFile: false,
        disableExifHeaderStripping: false
      });
    /* подвешиваем съем фоток с камеры со скоростью 20 кадров в сек*/
    setInterval(engine.lifeCamera, 1000 / 20);
    /* подвешиваем сьем сигнала интернета */
    engine.lifeSignal();
    /* подвешиваем обработчик компаса */
    engine.watchIDcompass = navigator.compass.watchHeading(samobot.lifeMagneticHeading, samobot.magneticHeadingError, { frequency: 1000});
  }
}

document.addEventListener("deviceready", engine.init, false);
