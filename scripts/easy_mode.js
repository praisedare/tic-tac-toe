

    var playerMark,
        randomTile = generateRandomNumberFromZeroTo(8), 
        computerMark, 
        lastPlayedMark,
        isPlayersTurn = true, //human always plays first
        winStatus = undefined,
        x_Score = 0,
        o_Score = 0, 
        numOfPlays=0,
        roundNo = 1,
        successfullWinPattern;

    
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
            "Somebody's on a roll <span style='font-size: 20px'>😉</span>",
            "Haba! You're leading with more than 3 points, cut me some slack"
    ]

    var winningMsgs8_10 = [
            "How can you be so far ahead?<span style='font-size:20px'>😨</span>",
            "I think I need to refresh my tic-tac-toe skills ",
            "I'm losing <span style='font-size:20px'>😭</span>!!!"
    ]

    var tieMsgs = [
            "You are currently in a delicate balance between winning and losing. Play wisely",
            "Hmmm... This game is really tight <span 'font-size:20px'>😑</span>"
    ]

    var losingMsgs1_3 = [ 
            "Gotta step up your game man!",
            "You're lagging behind"
    ]

    var losingMsgs4_7 = [
            "Eish, this is not good (for you)",
            "I think you're failing so badly because your tactics are sloppy "          
    ]

    var losingMsgs8_10 = [
            "Oluwa iye 🙆!!!See the gap I've given you<span style='font-size: 20px'>😂</span>",
            "You suck at tic-tac-toe <span style='font-size: 20px'>😂</span>",
            "Eat my dust loser <i class='fa fa-grin-tongue'></i>",
            "This is you at tic-tac-toe <span style='font-size: 20px'>💩</span>",
            "How bad can you be at such a simple game? <span style='font-size:20px'>😕</span>"
    ]

    //the code block that allows the human to play
    for (var i = 0; i < tiles.length; i++) {

      tiles[i].onclick = function(dis){
        playSound();
        
        //check if it's your turn to play b4 executing code
        if (isPlayersTurn==true && numOfPlays < 9) {

          //check if the tile hasn't previously been clicked on
          if ( dis.target.className.indexOf('clicked') == -1 ) {
            dis.target.className+=' clicked';
            dis.target.innerHTML = playerMark;
            lastPlayedMark = playerMark;
            isPlayersTurn = false;
            numOfPlays++;

            if (numOfPlays<4){
              setTimeout(function(){computersTurn()}, 650);
              // alert("from humanPlay if numOfPlays<4")
            }

            if (numOfPlays>=4) {
              // alert('if numOfPlays block entered')
              checkWinStatus();
              switch (winStatus) {
                case true:
                  numOfPlays = 9;
                  makeTilesGlow();
                  setTimeout(function(){roundIsWon()}, 600);
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

        }//if playersTurn==true

        else {
          alert('It is not yet your turn you impatient boob!')
        }
        

      }//tiles[i].onclick 
    
    }//forLoop allowing human to play



    function computersTurn(){
        //If the chosen random tile has been clicked on, pick another one
        while( tiles[randomTile].className.indexOf('clicked')>-1 ){
          // alert(`I picked ${randomTile}, but it's already taken, so I'm picking another random tile`);
          randomTile = generateRandomNumberFromZeroTo(8);
        }

        playSound();
        tiles[randomTile].innerHTML = computerMark;
        tiles[randomTile].className += ' clicked';
        lastPlayedMark = computerMark;
        numOfPlays++;
        isPlayersTurn = true;

        //If enough moves have been made such that a 
        //win is possible, start checking for one
        if (numOfPlays>=4) {
          checkWinStatus();
          // alert('if numOfPlays block for computersTurn entered')
          switch (winStatus) {
            case true:
              makeTilesGlow();
              setTimeout(function(){roundIsWon()}, 600);
              break;
            
            case "draw": 
              // alert('case draw executed from computersTurn')
              setTimeout(function(){draw()}, 600);              
              break;
            }//switch
        }//e.o.if(numOfPlays>=4)
    }//computersTurn()   


    function checkWinStatus(){
      for (var i = 0; i < winningPatterns.length; i++) {
        
        var [firstPosition, secondPosition, thirdPosition] = winningPatterns[i];

        //If the game is won...
        if (tiles[firstPosition].innerHTML== lastPlayedMark &&
          tiles[secondPosition].innerHTML== lastPlayedMark && 
          tiles[thirdPosition].innerHTML== lastPlayedMark) {
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


      }//for...loop
    } //checkWin()


    function chooseO(){
      playerMark = 'o';
      computerMark='x' ;
      //hide the 'choose mark' modal and show the board
      document.querySelector('#modal').style.display='none';
      document.getElementById('whoIsPlayer').innerHTML = playerMark;
      boardContainer.style.display = 'block';
    }//e.o.f()


    function chooseX(){
      playerMark = 'x'; 
      computerMark='o' ; 
      //hide the 'choose mark' modal and show the board
      document.querySelector('#modal').style.display='none';
      document.getElementById('whoIsPlayer').innerHTML = playerMark;

      boardContainer.style.display = 'block' 
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

    }//gameOver()


    function makeTilesGlow(){
      var [winningTiles1, winningTiles2, winningTiles3] = successfullWinPattern;

            tiles[winningTiles1].style.animation = "flash 0.5s ";
            tiles[winningTiles2].style.animation = "flash 0.5s ";
            tiles[winningTiles3].style.animation = "flash 0.5s ";

            successfullWinPattern = [];
    }//e.o.f()


    function loadFuncs(){
      adjustSoundIcons();
      document.onclick = function(){playMusic()}
    }//e.o.f()


    function newRound() {
      if (roundNo > 1)updateScoreSheetMsgs();
      
      //empty the board
      for (var i = 0; i < tiles.length; i++) {
        tiles[i].innerHTML = null;
        tiles[i].className = '';
        tiles[i].style.animation = null;
      }
   
      //reset the num. of moves made
      numOfPlays = 0;
      winStatus = undefined;
      //Update the scoresheet
      document.getElementById('x-score').innerHTML = x_Score;
      document.getElementById('o-score').innerHTML = o_Score;
      //Show round-no 
      currRoundNo.innerHTML = roundNo;
      

      //if the human made the last move on the previous round, then the computer should make the first move on the next round
      if (isPlayersTurn==false) {
        setTimeout(function(){computersTurn()}, 300)
        // alert('from newRound')
      }
    }//e.o.f()


    function updateScoreSheetMsgs(){
      let pointsDifference = ( eval(playerMark+'_Score') - eval(computerMark+'_Score') );

      playersLead.innerHTML = pointsDifference;

      if (pointsDifference > 0) playersLead.style.color = "lightgreen"
      else if (pointsDifference < 0) playersLead.style.color = "tomato"
      else { playersLead.style.color = '' }

      funMsgAboutWinStat.innerHTML =  updateTeasingWinStatMsg(pointsDifference);
    }//e.o.f()


    function pauseGame(){
      chooseMarkMenu.style.display = 'none';
      modal.style.display = 'block';
      pauseMenu.style.display = 'block';
    }//e.o.f()


    function generateRandomNumberFromZeroTo (num) {
      let numLength = new String(num);
      numLength = numLength.length;
      let randomNo = Math.floor( 
        ( Math.random() * (10**numLength) ) 
      );
      randomNo = randomNo % (num + 1)
      return randomNo;
    }//e.o.f()


    function hidePause(){
      pauseMenu.style.display = 'none';
      modal.style.display = 'none';
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


    function play_or_pauseMusic(){
      if (game_music.paused) {
        game_music.play()
      } else {
        game_music.pause()
      }
    }//e.o.f()

  
    function updateTeasingWinStatMsg(pointsDifference){
          let teasingMsg = "";

          if (pointsDifference == 0) {
            teasingMsg = tieMsgs[
            randomNumberWithinRange( losingMsgs1_3.length  - 1)
            ]
          }

          //If player is in lead
          else if (pointsDifference > 0 && pointsDifference <= 3) {
            teasingMsg = winningMsgs1_3[
            randomNumberWithinRange( winningMsgs1_3.length - 1 )
            ]
          }

          else if (pointsDifference > 3 && pointsDifference <=7) {
            teasingMsg = winningMsgs4_7[
            randomNumberWithinRange( winningMsgs4_7.length - 1 )
            ]
          }

          else if (pointsDifference > 7){
            teasingMsg = winningMsgs8_10[
            randomNumberWithinRange( winningMsgs8_10.length - 1 )
            ]
          }

          //If player is losing
          else if (pointsDifference < 0 && pointsDifference >= -3) {
            teasingMsg = losingMsgs1_3[
            randomNumberWithinRange( losingMsgs1_3.length - 1 )
            ]
          }

          else if (pointsDifference < -3 && pointsDifference >= -7) {
            teasingMsg = losingMsgs4_7[
            randomNumberWithinRange( losingMsgs4_7.length - 1 )
            ]
          }

          else if (pointsDifference < -7) {
            teasingMsg = losingMsgs8_10[
            randomNumberWithinRange( losingMsgs8_10.length - 1 )
            ]
          }

          return teasingMsg;
    }//e.o.f()


    function resetAllVars(){
      x_Score = 0;
      o_Score = 0;
      roundNo = 1;
      numOfPlays = 0;
      playerMark = null;
      computerMark = null;
      isPlayersTurn = true; //remember, human always has first move at the beginning of a game
      lastPlayedMark = null;
      playersLead.innerHTML = "0";
      playersLead.style.color = "yellow";
      funMsgAboutWinStat.innerHTML = "";
      currRoundNo.innerHTML = "1";
    }//e.o.f()


    function roundIsWon(){
       
        //check who won
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

    }//roundIsWon()


    function randomNumberWithinRange(zeroToX) {

      let zeroToXlength = new String(zeroToX);
      zeroToXlength = zeroToXlength.length;

      let randomNo = Math.floor( 
        ( Math.random() * (10**zeroToXlength) ) 
      );
      randomNo = randomNo % (zeroToX + 1)

      return randomNo;

    }//e.o.f()  


    function startOver(){
      resetAllVars();
      welcomeScreen();
      newRound();
    }//e.o.f()

 
    function welcomeScreen(){
      document.querySelector('#boardContainer').style.display = 'none';
      document.querySelector('#modal').style.display = 'block';
      document.querySelector('#chooseMarkMenu').style = 'block';
    }//e.o.f()

    
