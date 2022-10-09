

    var computerMark, 
        isPlayersTurn = false, //computer gets first move at the beginning of every round.
        isNextMoveWinningMove,
        winningMove = undefined,
        lastPlayedMark,
        movesToPlayInSelectedWinPattern = undefined,
        nextMove,
        nextMoveFromSelectedWinPattern,
        numOfPlays=0,
        playerMark,
        positionToPlayToBlockWin = undefined,
        roundNo = 1,
        selectedWinPattern,
        successfullWinPattern,
        winJeopardizedStatus = false,
        winStatus = undefined,
        x_Score = 0,
        o_Score = 0;

    var tiles = document.querySelector('#board').getElementsByTagName('td');

    var winningPatterns = [
      [0,1,2],  //0
      [3,4,5],  //1
      [6,7,8],  //2
      [0,3,6],  //3
      [0,4,8],  //4
      [1,4,7],  //5
      [2,5,8],  //6
      [2,4,6]   //7
    ]

    var winningMsgs1_3 = [
            "Don't get too cocky simply because you're a few points ahead",
            "I'll catch up soon enough."
    ]

    var  winningMsgs4_7 = [
            "Somebody's on a roll <i class=\"fa fa-laugh-wink\"></i>",
            "So you're more than 3 points ahead huh?  Screw you!!!"
    ]

    var winningMsgs8_10 = [
            "How can you be so far ahead?",
            "I think I need to refresh my tic-tac-toe skills <i class='fa fa-sad-tear'></i>",
            "I'm losing <i class=\"fa fa-sad-cry\"></i>"
    ]

    var tieMsgs = [
            "You are currently in a delicate balance between winning and losing. Play wisely",
            "This game is really tight... (-_-)"
    ]

    var losingMsgs1_3 = [ 
            "Gotta step up your game man!",
            "You're lagging behind"
    ]

    var losingMsgs4_7 = [
            "Eish, this is not good (for you)",
            "Your tactics seem sloppy "          
    ]

    var losingMsgs8_10 = [
            "You are TOAST!!!",
            "You suck at tic-tac-toe <i class=\"fa fa-grin-tears\"></i>",
            "Eat my dust loser <i class='fa fa-grin-tongue'></i>",
            "I smell your defeat",
            "How bad can you be at such a simple game (~_^)"
    ]

    /*****************************
     CAUTION!!! MIND BLOWING
     FUNCTIONS UP-AHEAD
    ******************************/

    //the code block that allows the human to play
    for (var i = 0; i < tiles.length; i++) {

      tiles[i].onclick = function(dis){
        playSound();
        
        //check if it's your turn to play b4 executing code
        if (isPlayersTurn==true) {

          //check if the tile hasn't previously been clicked on
          if ( dis.target.className.indexOf('clicked') == -1 ) {
            dis.target.className+=' clicked';
            dis.target.innerHTML = playerMark;
            lastPlayedMark = playerMark;
            isPlayersTurn = false;
            numOfPlays++;
            checkIfWinStrategyIsJeopardized(i);

            if (numOfPlays>2 && numOfPlays < 9) {
              blockWin();
            }

            if (numOfPlays<4){
              setTimeout(function(){computersTurn()}, 650);
              // alert("from humanPlay if numOfPlays<4")
            }


            if (numOfPlays>=4) {
              // alert('if numOfPlays block entered')
              checkWinStatus();
              switch (winStatus) {
                case true:
                  makeTilesGlow();
                  setTimeout(function(){roundIsWon()}, 599);
                  break;
                
                case "draw": 
                  draw();              
                  break;
                
                case false: 
                  // alert('switch block case false executed')
                  setTimeout(function(){computersTurn()}, 650);
                  // alert('from humanPlay()');
                  break;
              }

            }
        
          } else {
            alert ('This tile has already been played on. Pick another tile');
          }// if (tile hasn't been clicked on) {} else{}

        }

        else {
          alert('It is not yet your turn you impatient boob!')
        }//e.o.if(playersTurn==true)else{}
        

      }//tiles[i].onclick 
    
    }//e.o.forLoop allowing human to play


    function blockWin(){
      for (var i = 0; i < winningPatterns.length; i++) {
        
        var [firstPosition, secondPosition, thirdPosition] = winningPatterns[i];

        //If a win is about to be made...
        if (
          tiles[firstPosition].innerHTML== playerMark && tiles[secondPosition].innerHTML== playerMark 
          //also check that the last tile is empty
          && tiles[thirdPosition].className.indexOf('clicked') == -1
        ) {
          positionToPlayToBlockWin = thirdPosition;
          // alert(`I'm going to block your win pattern ${firstPosition} ${secondPosition} ${thirdPosition} by playing at ${thirdPosition}`);
          break;
        } else { positionToPlayToBlockWin = undefined; /*alert('position changed to undefined')*/ }

        if(
          tiles[firstPosition].innerHTML== playerMark && tiles[thirdPosition].innerHTML == playerMark
          //also check that the last tile is empty
          && tiles[secondPosition].className.indexOf('clicked') == -1
        ){
          positionToPlayToBlockWin = secondPosition;
          // alert(`I'm going to block your win pattern ${firstPosition} ${secondPosition} ${thirdPosition} by playing at ${secondPosition}`);
          break;
        } else { positionToPlayToBlockWin = undefined; /*alert('position changed to undefined')*/ }

        if (
          tiles[secondPosition].innerHTML== playerMark && tiles[thirdPosition].innerHTML==playerMark 
          //also check that the last tile is empty
          && tiles[firstPosition].className.indexOf('clicked') == -1
        ) {
          positionToPlayToBlockWin = firstPosition;
          // alert(`I'm going to block your win pattern ${firstPosition} ${secondPosition} ${thirdPosition} by playing at ${firstPosition}`);
          break;
        } else { positionToPlayToBlockWin = undefined; /*alert('position changed to undefined')*/ }

      }//e.o.for()
    }//e.o.f()


    function  checkIfWinIsInSight(){
      for (var i = 0; i < winningPatterns.length; i++) {
        
        var [firstPosition, secondPosition, thirdPosition] = winningPatterns[i];

        //Check if a win is about to be made
        if (
          tiles[firstPosition].innerHTML== computerMark && tiles[secondPosition].innerHTML== computerMark 
          //also check that the last tile is empty
          && tiles[thirdPosition].className.indexOf('clicked') == -1
        ) {
          winningMove = thirdPosition;
          isNextMoveWinningMove = true
          // alert(`Win about to be made at positions ${firstPosition} ${secondPosition} ${thirdPosition} by playing at ${thirdPosition}`);
          break;
        } else { winningMove = undefined; /*alert('position changed to undefined line 367')*/ }

        if(
          tiles[firstPosition].innerHTML== computerMark && tiles[thirdPosition].innerHTML == computerMark
          //also check that the last tile is empty
          && tiles[secondPosition].className.indexOf('clicked') == -1
        ){
          winningMove = secondPosition;
          isNextMoveWinningMove = true
          // alert(`Win about to be made at positions ${firstPosition} ${secondPosition} ${thirdPosition} by playing at ${secondPosition}`);
          break;
        } else { winningMove = undefined; /*alert('position changed to undefined line 377')*/ }

        if (
          tiles[secondPosition].innerHTML== computerMark && tiles[thirdPosition].innerHTML==computerMark 
          //also check that the last tile is empty
          && tiles[firstPosition].className.indexOf('clicked') == -1
        ) {
          winningMove = firstPosition;
          // alert(`Win about to be made at positions ${firstPosition} ${secondPosition} ${thirdPosition} by playing at ${firstPosition}`);
          break;
        } else { winningMove = undefined; /*alert('position changed to undefined line 384')*/ }

        
      }//for..

    }//e.o.f()


    function checkIfWinStrategyIsJeopardized(i){
      for ( x in selectedWinPattern ){
        if (i == x) { winJeopardizedStatus = true; /*alert('WinStrategy has been jeopardized');*/ break; }
        else { winJeopardizedStatus = false}
      }//e.o.for

      if (winJeopardizedStatus) {
        removeJeopardizedWinPatternFromWinningPatternsList();
        chooseWinPattern();
      }//e.o.if()

    }//e.o.f()


    function chooseWinPattern(){
      let randomNo = randomNumberFronZeroTo(winningPatterns.length-1);
      selectedWinPattern = winningPatterns[randomNo];
      // alert(`I'm choosing win pattern ${selectedWinPattern}, so don't make a move on any of those tiles!`);
      chooseMoveFromSelectedWinPattern();
    }//e.o.f()


    function chooseMoveFromSelectedWinPattern(){
      // alert('chooseMoveFromSelectedWinPattern() called');
      nextMoveFromSelectedWinPattern  = selectedWinPattern[randomNumberFronZeroTo(selectedWinPattern.length-1)];
      // alert(`nextMovefrom WIn pattern set to ${nextMoveFromSelectedWinPattern}`);
      let noOfUnavailableTiles = 0;
      
      //keep on choosing another nextMove if the selected nextMove has already been played on
      for ( x in selectedWinPattern ){
        if ( tiles[x].className.indexOf('clicked') != -1 ) {
         noOfUnavailableTiles++; /*alert(`tile ${selectedWinPattern[x]} in selected-win-pattern ${selectedWinPattern} already clicked on,`)*/ 
        } //e.o.if()
      }//e.o.for()

      //check that the tiles in the selectedWinPattern have not all been clicked on to prevent the while
      //loop from occuring infinitely
      if (
          tiles[selectedWinPattern[0]].className.indexOf("clicked")!=-1 && 
          tiles[selectedWinPattern[1]].className.indexOf("clicked")!=-1 && 
          tiles[selectedWinPattern[2]].className.indexOf("clicked")!=-1
      ) {
          // alert(` is tile ${ tiles[selectedWinPattern[0]] } clicked on ${tiles[selectedWinPattern[0]].className.indexOf("clicked")}    `);
          // alert(`selectedWinPattern ${selectedWinPattern} has been jeopardized, next move set to undefined, choosing another win pattern` );
          nextMoveFromSelectedWinPattern = undefined;
          //if all the tile positions is selectedWinPattern have been clicked on, it means that the winStrategy has been jeopardized
          removeJeopardizedWinPatternFromWinningPatternsList();
          chooseWinPattern();
      } else {

        while ( tiles[nextMoveFromSelectedWinPattern].className.indexOf('clicked') > -1 ) {
            nextMoveFromSelectedWinPattern = selectedWinPattern[randomNumberFronZeroTo(selectedWinPattern.length-1)];
        }//while
        // alert(`nextMoveFromSelectedWinPattern set to ${nextMoveFromSelectedWinPattern}`)

      }//if...else

      noOfUnavailableTiles = 0;

    }//e.o.f()


    function computersTurn(){

        //check for incomplete winPatterns 
        if (numOfPlays>3){ checkIfWinIsInSight(); }

        //functions that help to determine move to play and winPattern to make
        if ( numOfPlays==0||numOfPlays==1 ) {  chooseWinPattern(); }
        if ( numOfPlays > 1 ){ chooseMoveFromSelectedWinPattern(); }
        determineNextMove();


        playSound();
        tiles[nextMove].innerHTML = computerMark;
        tiles[nextMove].className += ' clicked';
        
        
        lastPlayedMark = computerMark;
        numOfPlays++;
        isPlayersTurn = true;

        /*If enough moves have been made such that a win is possible, start checking for one*/
        if (numOfPlays>=4) {
          checkWinStatus();
          // alert('if numOfPlays block for computersTurn entered')
          switch (winStatus) {
            case true:
              makeTilesGlow();
              setTimeout(function(){roundIsWon();}, 599)
              break;
            
            case "draw": 
              // alert('case draw executed from computersTurn')
              draw();              
              break;
            }//switch
        }//if(numOfPlays>=4)


    }//e.o.f()


    function checkWinStatus(){
      for (var i = 0; i < winningPatterns.length; i++) {
        
        var [firstPosition, secondPosition, thirdPosition] = winningPatterns[i];

        //If the game is won...
        if (tiles[firstPosition].innerHTML == lastPlayedMark &&
          tiles[secondPosition].innerHTML == lastPlayedMark && 
          tiles[thirdPosition].innerHTML == lastPlayedMark) {
          winStatus = true;
          successfullWinPattern = [firstPosition, secondPosition, thirdPosition]

          // alert('WinStat = true')
          //the return ends the function and consequently the loop. Doing so will prevent the loop from reevaluating winStatus to false when it tests for a winPattern that has not been matched
          return
        } else {
          winStatus = false;
          // alert('winStatus = false');
          // alert("1st tile is"+ tiles[firstPosition].innerHTML +" 2nd:"+ tiles[secondPosition].innerHTML +" 3rd tile is"+ tiles[thirdPosition].innerHTML)
        }

        //check for a draw
        if (winStatus==false && numOfPlays==9){
          winStatus = "draw"
        }


      }//e.o.for(i)
    }//e.o.f()


    function chooseO(){
      playerMark = 'o';
      computerMark='x' ;
      //hide the 'choose mark' modal and show the board
      document.querySelector('#modal').style.display='none';
      document.getElementById('whoIsPlayer').innerHTML = playerMark;
      boardContainer.style.display = 'block';
      setTimeout(function(){computersTurn()}, 1300)
    }//e.o.f()


    function chooseX(){
      playerMark = 'x'; 
      computerMark='o' ; 
      //hide the 'choose mark' modal and show the board
      document.querySelector('#modal').style.display='none'; 
      document.getElementById('whoIsPlayer').innerHTML = playerMark;
      boardContainer.style.display = 'block';
      setTimeout(function(){computersTurn()}, 1300)
    }//e.o.f()


    function determineNextMove(){

      if (winningMove != undefined) { nextMove = winningMove; }

      else if (positionToPlayToBlockWin != undefined ) { nextMove = positionToPlayToBlockWin; }

      else {nextMove = nextMoveFromSelectedWinPattern;}

    }//e.o.f()


    function draw(){
      alert('Draw');
      x_Score++;
      o_Score++;
      roundNo++;
      if (roundNo<6) {
        newRound();
      } else {
        gameOver();
      }
    }//e.o.f()


    function determineWhetherToPlayAgain(ans){
      chooseMarkMenu.style.display = "none";
      pauseMenu.style.display = "none";
      modal.style.display = "none";
      playAgainMenu.style.display = "none";
      if (ans) {
        startOver();
      } else {
        window.location.assign("index.html");
      }
    }//e.o.f()


    function gameOver(){

      alert(` x has a total of ${x_Score} points \n o has a total of ${o_Score} points `);
      alert('That means...');

      //If winner is "x"
      if ( x_Score > o_Score ) {
        if (playerMark == 'x'){
          alert("You win!!!")
        } else {
          alert("You lose!!!")
        }
      }

      //if winner is "o"
      else if (o_Score > x_Score ) {
        if (playerMark == 'o'){
          alert("You win!!!")
        } else {
          alert("You lose!!!")   
        }
      }

      //Draw
      else {
        alert("It's  a draw");
        alert("Nobody wins :(");
        alert("You're both losers.")
        alert("Boooooooo")
      }

      alert('Game over');

      //Ask player if he/she wants to play again
      pauseMenu.style.display = "none";
      chooseMarkMenu.style.display = "none";
      modal.style.display = "block";
      playAgainMenu.style.display = "block";     
    }//e.o.f()


    function loadFuncs(){
      adjustSoundIcons();
      document.onclick = function(){playMusic()}
    }//e.o.f()


    function makeTilesGlow(){

      var [winningTiles1, winningTiles2, winningTiles3] = successfullWinPattern;
 
            tiles[winningTiles1].style.animation = "flash 0.5s ";
            tiles[winningTiles2].style.animation = "flash 0.5s ";
            tiles[winningTiles3].style.animation = "flash 0.5s ";

            successfullWinPattern = []
    }//e.o.f()


    function newRound() {
      if (roundNo > 1) updateScoreSheetMsgs();

      //empty the board
      for (var i = 0; i < tiles.length; i++) {
        tiles[i].innerHTML = null;
        tiles[i].className = '';
        tiles[i].style.animation = null;
      }
      //reset the variables needed per round
      numOfPlays = 0;
      winStatus = undefined;
      nextMove = undefined;
      selectedWinPattern = undefined;
      winningMove = undefined;
      positionToPlayToBlockWin = undefined;
      winningPatterns = [
          [0,1,2],  //0
          [3,4,5],  //1
          [6,7,8],  //2
          [0,3,6],  //3
          [0,4,8],  //4
          [1,4,7],  //5
          [2,5,8],  //6
          [2,4,6]   //7
      ]//removeJeopardizedWinPattern alters the content of winningPatterns, so it needs to be reset at the beginning of every round.
      winJeopardizedStatus = false;

      //Update the scoresheet
      document.getElementById('x-score').innerHTML = x_Score;
      document.getElementById('o-score').innerHTML = o_Score;
      //show round-no
      currRoundNo.innerHTML = roundNo;

      // make the computer choose another winPattern
      chooseWinPattern();

      //if the human made the last move on the previous round, then the computer should make the first move on the next round
      if (isPlayersTurn==false && roundNo!=1) {
        setTimeout(function(){computersTurn()}, 300)
        // alert('from newRound')
      }
    }//e.o.f()


    function pauseGame(){
      chooseMarkMenu.style.display = 'none';
      modal.style.display = 'block';
      pauseMenu.style.display = 'block';
    }//e.o.f()


    function hidePause(){
      pauseMenu.style.display = 'none';
      modal.style.display = 'none';
    }//e.o.f()


    function play_or_pauseMusic(){
      if (game_music.paused) {
        game_music.play()
      } else {
        game_music.pause()
      }
    }//e.o.f()


    function playMusic(){
      if (localStorage.playMusic == "false") {
        //do nothing
      } else {
        game_music.play();
      }
    }//e.o.f()


    function playSound(){
      if (localStorage.playSound == "false") {
        //do nothing
      } else {
        hit_sound.play();
      }
    }//e.o.f()


    function randomNumberFronZeroTo (num) {
      let numLength = new String(num);
      numLength = numLength.length;
      let randomNo = Math.floor( 
        ( Math.random() * (10**numLength) ) 
      );
      randomNo = randomNo % (num + 1)
      return randomNo;
    }//e.o.f()


    function resizeFuncs(){
      let wndwWidth = window.innerWidth;
      let wndwHeight = window.innerHeight;

      if (wndwHeight >= 650) {
        chooseMarkMenu.classList.remove('overflow-y')
      } else {
        chooseMarkMenu.classList.add('overflow-y')
      }        
    }//e.o.f()


    function resetAllVars(){
      x_Score = 0;
      o_Score = 0;
      roundNo = 1;
      numOfPlays = 0;
      playerMark = null;
      computerMark = null;
      isPlayersTurn = false; //computer gets first move at the beginning of every game in normal mode
      lastPlayedMark = null;
      playersLead.innerHTML = "0";
      playersLead.style.color = "yellow";
      funMsgAboutWinStat.innerHTML = "";
      currRoundNo.innerHTML = "1";
    }//e.o.f()


    function roundIsWon(){
       
        //check who roundIsWon
        if(lastPlayedMark==playerMark){
          alert(`${playerMark} wins this round`);
          eval(playerMark+"_Score+=2");
        }else{
          alert(`${computerMark} wins this round`);
          eval(computerMark+"_Score+=2");
        }//who won
        roundNo++;
        if (roundNo<6) {
          newRound();
        } else {
          gameOver()
        }
    }//e.o.f()


    function removeJeopardizedWinPatternFromWinningPatternsList(){
      var indexOfWinPattern = winningPatterns.indexOf(selectedWinPattern);
      winningPatterns.splice(indexOfWinPattern, 1);
    }//e.o.f()


    function startOver(){
      resetAllVars();
      welcomeScreen();
      newRound();
    }//e.o.f()


    function updateScoreSheetMsgs(){
      let pointsDifference = ( eval(playerMark+'_Score') - eval(computerMark+'_Score') );

      playersLead.innerHTML = pointsDifference;

      if (pointsDifference > 0) playersLead.style.color = "lightgreen"
      else if (pointsDifference < 0) playersLead.style.color = "tomato"
      else { playersLead.style.color = '' }

      funMsgAboutWinStat.innerHTML =  updateTeasingWinStatMsg(pointsDifference);
    }//e.o.f()


    function updateTeasingWinStatMsg(pointsDifference){
          let teasingMsg = "";

          if (pointsDifference == 0) {
            teasingMsg = tieMsgs[
            randomNumberFronZeroTo( losingMsgs1_3.length  - 1)
            ]
          }

          //If player is in lead
          else if (pointsDifference > 0 && pointsDifference <= 3) {
            teasingMsg = winningMsgs1_3[
            randomNumberFronZeroTo( winningMsgs1_3.length - 1 )
            ]
          }

          else if (pointsDifference > 3 && pointsDifference <=7) {
            teasingMsg = winningMsgs4_7[
            randomNumberFronZeroTo( winningMsgs4_7.length - 1 )
            ]
          }

          else if (pointsDifference > 7){
            teasingMsg = winningMsgs8_10[
            randomNumberFronZeroTo( winningMsgs8_10.length - 1 )
            ]
          }

          //If player is losing
          else if (pointsDifference < 0 && pointsDifference >= -3) {
            teasingMsg = losingMsgs1_3[
            randomNumberFronZeroTo( losingMsgs1_3.length - 1 )
            ]
          }

          else if (pointsDifference < -3 && pointsDifference >= -7) {
            teasingMsg = losingMsgs4_7[
            randomNumberFronZeroTo( losingMsgs4_7.length - 1 )
            ]
          }

          else if (pointsDifference < -7) {
            teasingMsg = losingMsgs8_10[
            randomNumberFronZeroTo( losingMsgs8_10.length - 1 )
            ]
          }

          return teasingMsg;
    }//e.o.f()


    function welcomeScreen(){
      document.querySelector('#boardContainer').style.display = 'none';
      document.querySelector('#modal').style.display = 'block';
      document.querySelector('#chooseMarkMenu').style = 'block';
    }

    // chooseX() / chooseO() calls the computersTurn()
    /*In-game music and sound(s) courtesy of "Smash Hits!"*/
