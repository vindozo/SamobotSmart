samobot = {
  lat:0,
  lon:0,
  battery:0,

  lifeClock: function(){
    if(localStorage.getItem('lifeClock') < 1) {
      date = new Date(0);
      localStorage.setItem('lifeBorn', (new Date()).getTime() )
      localStorage.setItem('lifeClock', 1000);
    } else {
      date = new Date(localStorage.getItem('lifeClock')-0);
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
      localStorage.setItem('lifeClock', (localStorage.getItem('lifeClock') - 0) + 1000)
    }
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var str = Math.floor((localStorage.getItem('lifeClock')-0) / (24*60*60*1000)) + ":"
    if(hours < 10) hours = "0" + hours;
    if(minutes < 10) minutes = "0" + minutes;
    if(seconds < 10) seconds = "0" + seconds;
    str += hours + ":" + minutes + ":" + seconds;

    document.getElementById("lifeClock").innerHTML = str;
    document.getElementById("lifeBorn").innerHTML = new Date(localStorage.getItem('lifeBorn')-0).toLocaleString('ru', {
    day:   '2-digit',
    month: '2-digit',
    year:  'numeric'
  });
    setTimeout(samobot.lifeClock, 1000);
  },

  geolocation: function(position) {
    this.lat = document.getElementById("gpsLat").innerHTML = position.coords.latitude;
    this.lon = document.getElementById("gpsLon").innerHTML = position.coords.longitude;
  },
  
  geolocationError: function(error) {
    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
  },
  
  batteryStatus: function(info) { 
    this.battery = document.getElementById("bat").innerHTML = info.level; 
  },
  
  cameraPreview: function() {
    CameraPreview.startCamera({
      x: 0,
      y: 100,
      width: window.screen.width,
      height: 200,
      camera: CameraPreview.CAMERA_DIRECTION.FRONT, //BACK
      toBack: false,
      tapPhoto: true,
      tapFocus: false,
      previewDrag: false,
      storeToFile: false,
      disableExifHeaderStripping: false
    });
  }
}

function onDeviceReady() { 
  window.plugins.insomnia.keepAwake(); 
  navigator.geolocation.watchPosition(samobot.geolocation, samobot.geolocationError, { timeout: 30000,  maximumAge: 10000, enableHighAccuracy: true });
  window.addEventListener("batterystatus", samobot.batteryStatus, false);
  samobot.lifeClock();
  samobot.cameraPreview();
}

document.addEventListener("deviceready", onDeviceReady, false);
