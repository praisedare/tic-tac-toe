
    function adjustSoundIcons(){
      if (localStorage.playMusic == "false") {
        musicIcons.getElementsByClassName('ban-icon')[0].classList.add('fa-ban')
      }

      if (localStorage.playSound == "false") {
        soundIcons.getElementsByClassName('ban-icon')[0].classList.add('fa-ban')
      }
    }

    function setTheme(themeName){
      theme.href = "css/themes/"+themeName;
      localStorage.setItem('theme', themeName);
    }

    function setBackground(bgName, bgType){
      //save changes
      localStorage.setItem('background', bgName);
      localStorage.setItem('bgType', bgType);

      if (bgType == "color") {
        document.body.style.background = bgName;
      }//if(color)

      if (bgType == 'picture') {
        document.body.style.background = "url(assets/images/"+ bgName+ ")"

      }//if(picture)

      let bgs = document.getElementsByClassName('image-holder');
      for (var i = 0; i < bgs.length; i++) {
        bgs[i].style.borderColor = "white";
      }

      // elem.style.borderColor = 'darkblue';
      console.log(`${bgName} set as background`);
    }


    function toggleMusicPlayState(elem){
      elem.getElementsByClassName('ban-icon')[0].classList.toggle('fa-ban');
      if (localStorage.playMusic == "false" ) {
        localStorage.setItem("playMusic", true) ;
      } else {
        localStorage.setItem("playMusic", false);
      }

    }

    function toggleSoundPlayState(elem){
      elem.getElementsByClassName('ban-icon')[0].classList.toggle('fa-ban');
      if (localStorage.playSound == "false" ) {
        localStorage.setItem('playSound', true );
      } else {
        localStorage.setItem('playSound', false );
      }
    }

    (function(){
      //Load background
      if (localStorage.background) {
        console.log(`discovered saved background`)
        setBackground(localStorage.background, localStorage.bgType)
        // background(localStorage.background, )
      }

      //Load theme
      if (localStorage.theme) {
        setTheme(localStorage.theme);
      }

    })()
   