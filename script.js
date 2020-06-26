samobot = {
  lat:0,
  lon:0,

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
  }
}

function onLoad() { 
  document.addEventListener("deviceready", onDeviceReady, false);
} 

function onDeviceReady() { 
  window.plugins.insomnia.keepAwake(); 
  navigator.geolocation.watchPosition(samobot.geolocation)
  samobot.lifeClock(); 
}
