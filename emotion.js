  emotion = {
    audioPath: 'http://samobot.ru/data/audio/',
    
    status: 0,
    
    loop: function(){
      emotion.status = Math.floor(Math.random() * 5);
      switch (emotion.status) {
          case 1:
            emotion.sad();
          break;
          case 2:
            emotion.like();
          break;
          case 3:
            emotion.attack();
          break;
          case 4:
            emotion.surprise();
          break;
          default:
            emotion.neutral();
      }
      /* повторим эту функцию чезез 3-15 сек */
      setTimeout(emotion.loop, Math.floor(Math.random() * 12000) + 3000);
    },

    e: function () { 
      return document.querySelector('#emotion') 
    },

    audio: function (file) {
      this.audioElem = new Audio(); 
      this.audioElem.src = this.audioPath + file; 
      this.audioElem.autoplay = true; 
    },

    color: function (color) {
      this.e().classList.remove('eye-black', 'eye-red', 'eye-blue', 'eye-green');
      this.e().classList.add('eye-' + color);
    },

    off: function () { /* выключить */
      this.color('black');
      this.audio('powerdown.mp3');
      this.e().innerHTML =
        '<rect class="eye-left" x="55" y="50" width="90" height="90" rx="20" ry="20"/>'+
        '<rect class="eye-right" x="155" y="50" width="90" height="90" rx="20" ry="20"/>';
    },

    neutral: function () { /* нейтральный */
      this.color('blue');
      this.audio('neutral.mp3');
      this.e().innerHTML =
        '<rect class="eye-left" x="55" y="50" width="90" height="90" rx="20" ry="20">'+
        '<animate dur="1s" repeatCount="indefinite" attributeName="y" values="50;55;50"/><animate dur="1s" repeatCount="indefinite" attributeName="height" values="90;85;90"/></rect>'+  
        '<rect class="eye-right" x="155" y="50" width="90" height="90" rx="20" ry="20">'+
        '<animate dur="1s" repeatCount="indefinite" attributeName="y" values="50;45;50"/><animate dur="1s" repeatCount="indefinite" attributeName="height" values="90;95;90"/></rect>';      
    },

    surprise: function () { /* нейтральный */
      this.color('green');
      this.audio('surprise.mp3');
      this.e().innerHTML =
        '<rect class="eye-left" x="55" y="50" width="90" height="90" rx="100" ry="100">'+
        '<animate dur="1s" repeatCount="indefinite" attributeName="x" values="55;50;45;55"/></rect>'+  
        '<rect class="eye-right" x="155" y="50" width="90" height="90" rx="100" ry="100">'+
        '<animate dur="1s" repeatCount="indefinite" attributeName="x" values="155;150;145;155"/></rect>';      
    },

    attack: function () { /* нейтральный */
      this.color('red');
      this.audio('attack.mp3');
      this.e().innerHTML =
        '<path class="eye-left" d="m54.36719,98.79297c0,-10.86758 4.38632,-15.57031 15.2539,-15.57031l60.75782,15.1875c10.86758,3.79688 14.9375,5.96835 14.9375,16.83593l-0.31641,4.75391c0,10.86758 -9.13242,20 -20,20l-50,0c-10.86758,0 -20,-9.13242 -20,-20l-0.63281,-21.20703z" >'+
        '<animateTransform attributeName="transform" type="scaleY" dur="1s" repeatCount="indefinite" values="1 1;1 1.05;1 1"></path>'+
        '<path class="eye-right" d="m245.18944,99.79102c0,-10.86758 -4.31172,-15.57031 -14.99446,-15.57031l-59.72443,15.1875c-10.68274,3.79688 -14.68344,5.96835 -14.68344,16.83593l0.31103,4.75391c0,10.86758 8.97709,20 19.65983,20l49.14959,0c10.68274,0 19.65983,-9.13242 19.65983,-20l0.62205,-21.20703z" >'+
        '<animateTransform attributeName="transform" type="scaleY" dur="1s" repeatCount="indefinite" values="1 1.05;1 1;1 1.05;"></path>';
    },

    sad: function () { /* нейтральный */
      this.color('blue');
      this.audio('sad.mp3');
      this.e().innerHTML =
        '<path class="eye-left" d="m144.57226,39.35743c0,-10.86758 -4.31172,-15.57031 -14.99446,-15.57031l-59.72443,15.1875c-10.68274,3.79688 -14.68344,5.96835 -14.68344,16.83593l0.31103,4.75391c0,10.86758 8.97709,20 19.65983,20l49.14959,0c10.68274,0 19.65983,-9.13242 19.65983,-20l0.62205,-21.20703z" >'+
        '<animateTransform attributeName="transform" type="translate" calcMode="paced" dur="4s" repeatCount="indefinite" keyTimes="0; 0.5; 0.6; 0.9; 1" values="0 0;5 0;0 100;5 100;0 0"></path>'+
        '<path class="eye-right" d="m153.11523,39.04102c0,-10.86758 4.38632,-15.57031 15.2539,-15.57031l60.75782,15.1875c10.86758,3.79688 14.9375,5.96835 14.9375,16.83593l-0.31641,4.75391c0,10.86758 -9.13242,20 -20,20l-50,0c-10.86758,0 -20,-9.13242 -20,-20l-0.63281,-21.20703" >'+
        '<animateTransform attributeName="transform" type="translate" calcMode="paced" dur="4s" repeatCount="indefinite" keyTimes="0; 0.5; 0.6; 0.9; 1" values="0 0;5 0;0 100;5 100;0 0"></path>';
    },

    like: function () { /* нейтральный */
      this.color('green');
      this.audio('like.mp3');
      this.e().innerHTML =
        '<path class="eye-left" d="m55,39.94141c0,-10.86758 9.13242,-20 20,-20l50,0c10.86758,0 20,9.13242 20,20l-1.58204,9.1836c-42.89883,-7.21095 -44.7539,-6.21837 -86.20312,-0.00001l-2.21484,-9.18359z" >'+
        '<animateTransform attributeName="transform" type="translate" calcMode="paced" dur="4s" repeatCount="indefinite" keyTimes="0; 0.5; 0.6; 0.9; 1" values="0 0;0 5;0 0;-5 0;0 0"></path>'+
        '<path class="eye-right" d="m155,39.94141c0,-10.86758 9.13242,-20 20,-20l50,0c10.86758,0 20,9.13242 20,20l-2.21484,9.8164c-41.63321,-5.6289 -42.22266,-5.58554 -85.57032,-0.63281l-2.21484,-9.18359z" >'+
        '<animateTransform attributeName="transform" type="translate" calcMode="paced" dur="4s" repeatCount="indefinite" keyTimes="0; 0.5; 0.6; 0.9; 1" values="0 0;0 5;0 0;-5 0;0 0"></path>';
    }
  }

setTimeout(emotion.loop, 10000);
