samobot = {
  key:'d728a1e066c15b0f983e8c48f928d86f',
  api:'http://samobot.ru/api/',
  command:'',
  
  /* считаем общий моторесурс приложения (возраст) */
  lifeClock: async function(){
    if(localStorage.getItem('lifeClock') < 1) {
       /* роды. создание папки с самоботом на сервере */
       var api = await fetch(samobot.api + '?action=init&key=' + samobot.key + '&uin=' +device.uuid);
       if (api.ok) { 
          api = await api.json();
          localStorage.setItem('lifeBorn', api.config.born);
          document.getElementById("lifeBorn").innerHTML = api.config.born;
          localStorage.setItem('lifeClock', 1000);
       } 
    } else {
      /* обновим возраст */
      document.getElementById("lifeBorn").innerHTML = localStorage.getItem('lifeBorn');
      localStorage.setItem('lifeClock', (localStorage.getItem('lifeClock') - 0) + 1000);
    }
    /* дальше малополезная громоздкая функция, просто показывающая красиво время жизни */
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
    
  /* обмен данными с сервером */
  lifeOnline: async function(){
     try {
       var api = await fetch(samobot.api + '?action=online&key=' + samobot.key + '&uin=' + engine.uin, {
          method: 'POST',
          body: JSON.stringify({
              lat: engine.lat,
              lon: engine.lon,
              battery: engine.battery,
              imageSrcData: engine.cameraBase64jpeg,
              connectedLevel: engine.connectedLevel,
              connected: engine.connected,
              magneticHeading: engine.magneticHeading,
              command: samobot.command,
              lifeClock: (localStorage.getItem('lifeClock')-0)
          })
       });
       samobot.command = '';
       if (api.ok) { 
          api = await api.json();
          var e = document.getElementById('previewPicture');
          e.classList.remove('offline');
          e.classList.add('online');
          samobot.doCommand(api.command);
       } else {
          var e = document.getElementById('previewPicture');
          e.classList.remove('online');
          e.classList.add('offline');
       }
    } finally {
       setTimeout(samobot.lifeOnline, 100);
    }
  },
  
  /* выводим информационное окно */
  showInfo: : function(){
    document.getElementById('screen').style.display = 'none';
    document.getElementById('screenInfo').style.display = 'block';
    setTimeout("samobot.hideInfo()", 5000);
  },
  /* прячем информационное окно */
  showInfo: : function(){
    document.getElementById('screenInfo').style.display = 'none';
    document.getElementById('screen').style.display = 'block';        
  }
  
  /* выполним все входящие команды */
  doCommand: function(str){
    document.getElementById('command').innerHTML = samobot.command = str;
    if(str == '') return;
    var arr = str.split(';');
    arr.map(function(command) {
      eval((''+command+';'));
    });
  }
}

/* запускаем подсчет возраста самобота */
setInterval(samobot.lifeClock, 1000);
/* через 5 сек, за которые должно подключиться оборудование запускаем обмен с сервером */
setTimeout(samobot.lifeOnline, 5000);
