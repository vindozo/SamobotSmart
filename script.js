samobot = {
  lat:0,
  lon:0,
  battery:0,
  imageSrcData:'',
  cameraStopCounter:0,
  connectedLevel:0,
  connected:'',
  magneticHeading:0,
  key:'d728a1e066c15b0f983e8c48f928d86f',
  api:'http://digitalmotor.ru/samobot/api/',

  lifeClock: async function(){
    if(localStorage.getItem('lifeClock') < 1) {
       var api = await fetch(samobot.api + '?action=init&key=' + samobot.key + '&uin=' +device.uuid);
       if (api.ok) { 
          api = await api.json();
          localStorage.setItem('lifeBorn', api.config.born);
          document.getElementById("lifeBorn").innerHTML = api.config.born;
          localStorage.setItem('lifeClock', 1000);
       } 
    } else {
      document.getElementById("lifeBorn").innerHTML = localStorage.getItem('lifeBorn');
      localStorage.setItem('lifeClock', (localStorage.getItem('lifeClock') - 0) + 1000);
    }
    date = new Date(localStorage.getItem('lifeClock')-0);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var str = Math.floor((localStorage.getItem('lifeClock')-0) / (24*60*60*1000)) + ":"
    if(hours < 10) hours = "0" + hours;
    if(minutes < 10) minutes = "0" + minutes;
    if(seconds < 10) seconds = "0" + seconds;
    str += hours + ":" + minutes + ":" + seconds;
    document.getElementById("lifeClock").innerHTML = str;
  },

  geolocation: function(position) {
    samobot.lat = document.getElementById("gpsLat").innerHTML = position.coords.latitude;
    samobot.lon = document.getElementById("gpsLon").innerHTML = position.coords.longitude;
  },
  
  geolocationError: function(error) {
    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
  },
  
  batteryStatus: function(info) { 
    samobot.battery = document.getElementById("bat").innerHTML = info.level; 
  },
  
  cameraPreview: function() {
    var cameraElem = document.getElementById('previewPicture').getBoundingClientRect();
    CameraPreview.startCamera({
      x: cameraElem.left,
      y: cameraElem.top,
      width: cameraElem.width,
      height: cameraElem.heigh,
      camera: CameraPreview.CAMERA_DIRECTION.FRONT, //BACK
      toBack: false,
      tapPhoto: true,
      tapFocus: false,
      previewDrag: false,
      storeToFile: false,
      disableExifHeaderStripping: false
    });
  },
  
  lifeCamera: function(){
    try {   
      //CameraPreview.takePicture({width:240, height:240, quality: 80}, function(base64PictureData) {
      CameraPreview.takeSnapshot({quality: 85}, function(base64PictureData){
        base64PictureData = 'data:image/jpeg;base64,' + base64PictureData
        samobot.imageSrcData = document.getElementById('previewPicture').src = base64PictureData;
      });
    } catch(err) {
      //samobot.cameraPreview();
    } finally {
       setTimeout(samobot.lifeCamera, 500);
    }    
  },
  
  lifeSignal:function(){
    SignalLevel.get(
    function(resp){
      samobot.connected = resp.ConnectedFast;
      if( resp.isConnectedWifi ) {
         samobot.connectedLevel = resp.WifiSignalLevel;
      } else {
         samobot.connectedLevel = resp.MobileSignalLevel;
      }
      document.getElementById("dbm").innerHTML = samobot.connected + '/' + samobot.connectedLevel;
      setTimeout(samobot.lifeSignal, 500);
    }, function(err){
      alert("Error: "+(err));
    });
  },
  
  lifeMagneticHeading:function(heading) {
    samobot.magneticHeading = document.getElementById('compas').innerHTML = heading.magneticHeading;
  },

  magneticHeadingError:function(compassError) {
   alert('Compass error: ' + compassError.code);
  },
  
  lifeOnline: async function(){
     try {
       var api = await fetch(samobot.api + '?action=online&key=' + samobot.key + '&uin=' +device.uuid, {
          method: 'POST',
          body: JSON.stringify({
              lat: samobot.lat,
              lon: samobot.lon,
              battery: samobot.battery,
              imageSrcData: samobot.imageSrcData,
              connectedLevel: samobot.connectedLevel,
              connected: samobot.connected,
              magneticHeading:samobot.magneticHeading,
              lifeClock:(localStorage.getItem('lifeClock')-0)
          })
       });
       if (api.ok) { 
          api = await api.json();
          var e = document.getElementById('previewPicture');
          e.classList.remove('offline');
          e.classList.add('online');
       } else {
          var e = document.getElementById('previewPicture');
          e.classList.remove('online');
          e.classList.add('offline');
       }
    } finally {
       setTimeout(samobot.lifeOnline, 500);
    }
  }
}

function onDeviceReady() { 
  window.plugins.insomnia.keepAwake(); 
  navigator.geolocation.watchPosition(samobot.geolocation, samobot.geolocationError, { timeout: 30000,  maximumAge: 10000, enableHighAccuracy: true });
  window.addEventListener("batterystatus", samobot.batteryStatus, false);
  setInterval(samobot.lifeClock, 1000);
  samobot.cameraPreview();
  samobot.lifeCamera();
  samobot.lifeSignal();
  navigator.compass.watchHeading(samobot.lifeMagneticHeading, samobot.magneticHeadingError, { frequency: 1000});
  document.getElementById('UIN').innerHTML = device.uuid;
  setTimeout(samobot.lifeOnline, 5000);
}

document.addEventListener("deviceready", onDeviceReady, false);
