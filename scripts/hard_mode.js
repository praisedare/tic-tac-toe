

    var computerMark, 
        doubleWinPositionsFor_x = [],
        doubleWinPositionsFor_o = [],
        doubleWinCompletionStatus /* Possible values are "inProgress", "completed", "terminated"*/,
        indexOfSelectedDoubleWinPattern = null,
        isPlayersTurn = false, //computer gets first move at the beginning of every round.
        isNextMoveWinningMove,
        lastPlayedMark,
        movesToPlayInSelectedWinPattern = undefined,
        nextMove,
        nextMoveFromSelectedWinPattern,
        nextMoveFromSelectedDoubleWinPattern,
        numOfPlays=0,
        playerMark,
        positionToPlayToBlockWin = undefined,
        positionToPlayToBlockDoubleWin,
        positionToPlayToMakeDoubleWin,
        roundNo = 1,
        selectedWinPattern,
        selectedDoubleWinPattern,
        successfullWinPattern,
        winStatus = undefined,
        unplayedTiles = [0,1,2,3,4,5,6,7,8],
        winningMove = undefined,
        winJeopardizedStatus = false,
        x_Score = 0,
        o_Score = 0;

    var tiles = document.querySelector('#board').getElementsByTagName('td');

    var cornerPositions = [0, 2, 6, 8];

    var midColumnOrMidRowPositions = [1, 3, 5, 7]

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

    var winPatternsToSelectFrom = [
      [0,1,2],  //0
      [3,4,5],  //1
      [6,7,8],  //2
      [0,3,6],  //3
      [0,4,8],  //4
      [1,4,7],  //5
      [2,5,8],  //6
      [2,4,6]   //7
    ]

    var doubleWinPatterns = [
      [1,3,4],
      [1,3,0],
      [0,7,6],
      [0,1,4],
      [0,8,6],
      [0,7,1],
      [0,7,4],
      [0,2,8]
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
            if (numOfPlays<9) {
            	checkIfWinStrategyIsJeopardized();
            }

            //remove the tile played on from "unplayedTiles"
            let gridNo = parseInt(dis.target.id.slice(-1));
            unplayedTiles.splice(unplayedTiles.indexOf(gridNo), 1);
            // alert(unplayedTiles)

            if (numOfPlays>2 && numOfPlays < 9) {
              blockWin();
            }

            if (numOfPlays<4){
              setTimeout(function(){computersTurn()}, 650);
              // alert("from humanPlay if numOfPlays<4")
            }


            if (numOfPlays>=4) {
              // alert('if numOfPlays block entered')
              checkWinStatus()
              switch (winStatus) {
                case true:
                  makeTilesGlow();
                  setTimeout(function(){roundIsWon()}, 600);
                  break;
                
                case "draw": 
                  setTimeout(function(){draw()}, 300);             
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

        else{
          alert('It is not yet your turn you impatient boob!!!')
        }
        

      }//tiles[i].onclick 
    
    }//e.o.forLoop allowing human to play


    function findDoubleWinPositions(playerToFindDoubleWinsFor){
      let detectedDoubleWinPositions = [];
      for ( curr_unplayedTile of unplayedTiles ) {

        let noOfPossibleWins = 0; //Stores the no. of wins that can be made by playing at a specific position (indicates a double win).
        let relatedWinPatterns = [];
        /*Loop through each win pattern and push it
         *to "relatedWinPatterns" if it contains the
         *current iteration(i.e curr_unplayedTile) of UnplayedTiles.
        */

        for ( winPattern of winningPatterns ) {
          if ( winPattern.includes(curr_unplayedTile) ) {
            relatedWinPatterns.push(winPattern)
          }
        }//e.o.for(winPattern of winningPatterns)

        /*loop through each winPattern in relatedWinPatterns. Don't get confused by the
        similar variable name in the previous loop*/
        for ( curr_winPattern of relatedWinPatterns ) {
          let otherTiles = [];// OtherTiles represents all tiles in the current iteration of winPattern apart from the currently 
                              // selected unplayed tile i.e if the current iteration of "winPatterns" is "[0,1,2]", and the current 
                              // iteration of  "unplayedTiles" is "1", that means that "otherTiles" is "0,2".

          //add the other tiles in the current winPattern to "otherTiles"
          for ( tileInWinPattern of curr_winPattern ) {
            if( tileInWinPattern != curr_unplayedTile ) { otherTiles.push(tileInWinPattern) }
          }

          //check if win is possible (or feasible) with currently selected winPattern
          if ( checkFeasibilityOfWinPattern(curr_unplayedTile, curr_winPattern, playerToFindDoubleWinsFor) ) {
              /* If the program has made it this far, it means that the current win pattern fulfills 
               * the feasibility test. i.e its possible to make a win using this pattern. 
               * Now It's time to check if another win can also be made by playing at the 
               * currently selected unplayedTile (check if this is a double-win move)
               */
              noOfPossibleWins++;

              /* Next off, find the other related winpatterns (excluding the currently selected winPattern),
               * loop through them, and call the checkFeasibilityOfWinPattern() for each one to see if another
               * winPattern is also feasible (check for a double win).
               */
              let relatedWinPatterns_excluding_currWinPattern = [];
              
              // Get the other related win patterns and store them in the above array.
              for ( otherRelatedWinPattern of relatedWinPatterns ) {
                if (otherRelatedWinPattern.toString() != curr_winPattern.toString()) {
                  relatedWinPatterns_excluding_currWinPattern.push(otherRelatedWinPattern)
                }
              }

              /* Now that's done, it's time to see if another win is possible from the curernt unplayed tiles position. 
               * That means that calling the checkFeasibilityOfWinPattern() function again for each of the other
               * related win patterns
              */
              for ( curr_rltdWinPttrn of relatedWinPatterns_excluding_currWinPattern ) {
                if (checkFeasibilityOfWinPattern(curr_unplayedTile, curr_rltdWinPttrn, playerToFindDoubleWinsFor)) {
                  noOfPossibleWins++;
                }

                if (noOfPossibleWins >= 2) { 
                  //Okay, just a little something before adding the position to the "doubleWinPositions" array.
                  //First check that the position is not already there before adding it.
                  if (!detectedDoubleWinPositions.includes(curr_unplayedTile)){detectedDoubleWinPositions.push(curr_unplayedTile)}; 
                  console.log(`Doublewin possible if move is made at ${curr_unplayedTile}`)
                }
              }//e.o.for(curr_rltdWinPttrn of relatedWinPatterns_excluding_currWinPattern)

          }//if winPattern is feasible


        }//e.o.for(curr_winPattern of relatedWinPatterns)

        // Reset noOfPossibleWins at the end of each iteration.
        noOfPossibleWins = 0;

      }//e.o.for(curr_unplayedTile of unplayedTiles)

      eval("doubleWinPositionsFor_" +playerToFindDoubleWinsFor+ " = detectedDoubleWinPositions") ;
    }//e.o.f()


    function blockWin(){
      for (var i = 0; i < winningPatterns.length; i++) {
        
        var [firstPosition, secondPosition, thirdPosition] = winningPatterns[i];

        //If a win is about to be made...
        if (
          tiles[firstPosition].innerHTML== playerMark && tiles[secondPosition].innerHTML== playerMark 
          && tiles[thirdPosition].className.indexOf('clicked') == -1//also check that the last tile is empty
        ) {
          positionToPlayToBlockWin = thirdPosition;
          // alert(`I'm going to block your win pattern ${firstPosition} ${secondPosition} ${thirdPosition} by playing at ${thirdPosition}`);
          break;
        } else { positionToPlayToBlockWin = undefined; /*alert('position changed to undefined line 367')*/ }

        if(
          tiles[firstPosition].innerHTML== playerMark && tiles[thirdPosition].innerHTML == playerMark
          //also check that the last tile is empty
          && tiles[secondPosition].className.indexOf('clicked') == -1
        ){
          positionToPlayToBlockWin = secondPosition;
          // alert(`I'm going to block your win pattern ${firstPosition} ${secondPosition} ${thirdPosition} by playing at ${secondPosition}`);
          break;
        } else { positionToPlayToBlockWin = undefined; /*alert('position changed to undefined line 377')*/ }

        if (
          tiles[secondPosition].innerHTML== playerMark && tiles[thirdPosition].innerHTML==playerMark 
          //also check that the last tile is empty
          && tiles[firstPosition].className.indexOf('clicked') == -1
        ) {
          positionToPlayToBlockWin = firstPosition;
          // alert(`I'm going to block your win pattern ${firstPosition} ${secondPosition} ${thirdPosition} by playing at ${firstPosition}`);
          break;
        } else { positionToPlayToBlockWin = undefined; /*alert('position changed to undefined line 384')*/ }

        
      }//e.o.for()
    
    }//e.o.f()


    function blockDoubleWin(){
        //execute this block if its the beginning of a round and the human made the first move
        if (numOfPlays==1 && isPlayersTurn==false) {
          for (tile of cornerPositions ) {
            if (tiles[tile].innerHTML == playerMark){ 
              positionToPlayToBlockDoubleWin = 4; //play at center
              if ( tiles[positionToPlayToBlockDoubleWin].className.indexOf('clicked') != -1 ){ 
                positionToPlayToBlockDoubleWin = undefined
              }
            }
          }//for(tile of cornerPositions)
        }

        //Check for right angle triangle double Win Position.
        else if ( numOfPlays == 3 && isPlayersTurn == false ) {
          let noOfOppositeCornerPositions = 0;

          let playedCornerPositions = []
          for ( tile of cornerPositions ){
            if (tiles[tile].innerHTML == playerMark) { playedCornerPositions.push(tile) }
            //Check if the played corner-positions are opposite each other i.e if they form the points for the hypotenuse of 
            //the right-angled-triangle double-win pattern.
            if (playedCornerPositions == rotateArray(180, playedCornerPositions)) {
              positionToPlayToBlockWin == midColumnOrMidRowPositions[randomNumberFromZeroTo(midColumnOrMidRowPositions.length-1)];
            }

          }//e.o.for()
        }
        
        else{
          findDoubleWinPositions(playerMark);
          eval("positionToPlayToBlockDoubleWin = doubleWinPositionsFor_"+ playerMark+"[0]")
        }//e.o.if(numOfPlays==1)_elseif_else

    }//e.o.f()


    //Function checks if a win pattern still holds if a move is made at "selectedTile" for a certain player
    function checkFeasibilityOfWinPattern(selectedTile, winPattern, player){

        let otherTiles = [];
        //add tiles to "otherTiles"
        for (tileInWinPattern of winPattern){
          if (tileInWinPattern != selectedTile) otherTiles.push(tileInWinPattern);
        }
        // console.log(otherTiles);


        if (
          (tiles[otherTiles[0]].innerHTML == '' || tiles[otherTiles[1]].innerHTML == '' )
          &&
          (tiles[otherTiles[1]].innerHTML == player || tiles[otherTiles[0]].innerHTML == player)
        ) {
          // console.log(`tiles[${otherTiles[0]}].innerHTML: ${tiles[otherTiles[0]].innerHTML}, tiles[${otherTiles[1]}].innerHTML = ${tiles[otherTiles[1]].innerHTML}`)
          return true

        }

        else {
          // console.log(`tiles[${otherTiles[0]}].innerHTML: ${tiles[otherTiles[0]].innerHTML}, tiles[${otherTiles[1]}].innerHTML = ${tiles[otherTiles[1]].innerHTML}`)
          return false
        }//e.o.if_else

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

        
      }//e.o.for()
    }//e.o.f()


    function checkIfWinStrategyIsJeopardized(){
      if(selectedWinPattern){
          for ( x of selectedWinPattern ){
            if (tiles[x].innerHTML == playerMark) { winJeopardizedStatus = true; /*alert('WinStrategy has been jeopardized'); break;*/ }
            else { winJeopardizedStatus = false; /*alert('winJeopardizedStatus evaluates to "false" line 478; tile-mark:'+ tiles[x].innerHTML);*/ }
          }//e.o.for()

          if (winJeopardizedStatus) {
            // alert('WinStrategy has been jeopardized');
            removeJeopardizedWinPatternFromWinningPatternsList();
            chooseWinPattern();
          }//e.o.if(winJeopardizedStatus)
      }//e.o.if(selectedWinPattern)

    }//e.o.f()



    function chooseDoubleWinPattern(){
      let randomNo = randomNumberFromZeroTo(doubleWinPatterns.length-1);
      console.log(`randomNo for slctng dblWinPtrn: ${randomNo}`)
      selectedDoubleWinPattern = [...doubleWinPatterns[randomNo]];
      indexOfSelectedDoubleWinPattern = randomNo;
      // alert(`double win pattern ${selectedDoubleWinPattern} chosen`);
      console.log(`double win pattern ${selectedDoubleWinPattern} chosen`);
      doubleWinCompletionStatus = "inProgress";
      // Associated functions : "chooseMoveFromSelectedDoubleWinPattern()"s
      chooseMoveFromSelectedDoubleWinPattern();
    }//e.o.f()


    function chooseWinPattern(){
      let randomNo = randomNumberFromZeroTo(winPatternsToSelectFrom.length-1);
      selectedWinPattern = winPatternsToSelectFrom[randomNo];
      if (selectedWinPattern == undefined) {
        selectedWinPattern = unplayedTiles[0]
      }
      // alert(`I'm choosing win pattern ${selectedWinPattern}, so don't make a move on any of those tiles!`);
      chooseMoveFromSelectedWinPattern();
    }//e.o.f()


    function chooseMoveFromDoubleWinPositions(){
      if ( eval(`doubleWinPositionsFor_${computerMark}.length == 0`) ) { positionToPlayToMakeDoubleWin = undefined;
      } else {
        let randomNo = randomNumberFromZeroTo(eval(`doubleWinPositionsFor_${computerMark}.length-1`));
        positionToPlayToMakeDoubleWin = eval(`doubleWinPositionsFor_${computerMark}[${randomNo}]`);
      }//e.o.if()
    }//e.o.f()


    function chooseMoveFromSelectedWinPattern(){
      // alert('chooseMoveFromSelectedWinPattern() called');
      nextMoveFromSelectedWinPattern  = selectedWinPattern[randomNumberFromZeroTo(selectedWinPattern.length-1)] || randomNumberFromZeroTo(8);
      // alert(`nextMovefrom WIn pattern set to ${nextMoveFromSelectedWinPattern}`);
      
      //check that the tiles in the selectedWinPattern have not all been clicked on to prevent the while
      //loop from occuring indefinitely
      if (
          tiles[selectedWinPattern[0]].className.indexOf("clicked")!=-1 && 
          tiles[selectedWinPattern[1]].className.indexOf("clicked")!=-1 && 
          tiles[selectedWinPattern[2]].className.indexOf("clicked")!=-1
      ) {
          // alert(`selectedWinPattern ${selectedWinPattern} has been jeopardized, next move set to undefined, choosing another win pattern` );
          nextMoveFromSelectedWinPattern = undefined;
          //If all the tile positions in 'selectedWinPattern' have been clicked on, it means that the winStrategy has been jeopardized.
          removeJeopardizedWinPatternFromWinningPatternsList();
          /*Removing the win-pattern from the win-patterns list does not affect the programs' ability to detect
           *a win because the winPatterns array is reset at the beginning of every round. And also because, if
           *a win pattern has been 'jeopardized' it means that no win (for either players) can be made with that pattern 
           *for that round.
          */
          chooseWinPattern();
      } else {

        while ( tiles[nextMoveFromSelectedWinPattern].className.indexOf('clicked') > -1 ) {
            nextMoveFromSelectedWinPattern = selectedWinPattern[randomNumberFromZeroTo(selectedWinPattern.length-1)];
        }//while
        // alert(`nextMoveFromSelectedWinPattern set to ${nextMoveFromSelectedWinPattern}`)

      }//e.o.if()else{}

    }//e.o.f()


    //sets the value of "nextMoveFromSelectedDoubleWinPattern"
    function chooseMoveFromSelectedDoubleWinPattern(){
        //Check that the array isn't empty before picking moves from it
        if (selectedDoubleWinPattern.length>0) {
          nextMoveFromSelectedDoubleWinPattern = selectedDoubleWinPattern.shift();
          console.log("nextMoveFromSelectedDoubleWinPattern", nextMoveFromSelectedDoubleWinPattern);
          //set nextMoveFromSelectedDoubleWinPattern to undefined if the tile it represents has already been played on
          //sometimes
          if (tiles[nextMoveFromSelectedDoubleWinPattern].className.indexOf('clicked')!= -1) {
            nextMoveFromSelectedDoubleWinPattern = undefined;
          }
        } 
        //If the array is empty, choose another double win pattern 
        else {
          console.log('slctdDblWinPttrn empty, choosing another win pattern');
          chooseDoubleWinPattern();
        }
    }//e.o.f()


    function computersTurn(){

        //functions that help to determine move to play and winPattern to make
        if ( numOfPlays==0||numOfPlays==1 ) { 
          //if numOfPlays == 0 
          chooseWinPattern(); 
          chooseDoubleWinPattern(); 
          //If numOfPlays == 1
          blockDoubleWin()
        }//e.o.if(numOfPlays==0)

        /******************************************************************************************************************
          A doubleWinPattern is only selected once at the beginning of every game. Each time the computer is called to play,
          the function "chooseMoveFromSelectedDoubleWinPattern" is called and the size of the array "selectedDoubleWinPattern"
          is reduced by one. Eventually it becomes an empty array, and because there are variables whose valuse depend on 
          the contents of the array, those variables will be set to undefined when the array is empty, and will generate an
          error when a part of the program tries to perform some action using those undefined variables. Because of this,
          the number of times chooseMoveFromSelectedDoubleWinPattern() is called has to be limited to prevent those values
          from being set to undefined.
        ******************************************************************************************************************/
        

        if ( numOfPlays > 1 && numOfPlays < 9){
          chooseMoveFromSelectedWinPattern(); 
          findDoubleWinPositions(computerMark); 
          chooseMoveFromDoubleWinPositions(); 
          chooseMoveFromSelectedDoubleWinPattern();
        }

        //check for incomplete winPatterns 
        if (numOfPlays>3){ checkIfWinIsInSight(); }

        determineNextMove();

        playSound();
        tiles[nextMove].innerHTML = computerMark;
        tiles[nextMove].className += ' clicked';  
        lastPlayedMark = computerMark;
        numOfPlays++;
        isPlayersTurn = true;

        //remove tile played on from "unplayedTiles"
        unplayedTiles.splice(unplayedTiles.indexOf(nextMove), 1);
        // alert(unplayedTiles)

        //If enough moves have been made such that a 
        //win is possible, start checking for one
        if (numOfPlays>=4) {
          checkWinStatus() //sets the value of winStatus
          switch (winStatus) {
            case true:
              makeTilesGlow();
              setTimeout(function(){roundIsWon();}, 599)
              break;
            
            case "draw": 
              // alert('case "draw" executed from computersTurn')
              setTimeout(function(){draw()}, 300);             
              break;

            case false:
             //do nothing
             break;

            }//switch
        }//e.o.if(numOfPlays>=4)
    }//e.o.f()


    function checkWinStatus(){

      for (var i = 0; i < winningPatterns.length; i++) {
        
        var [firstPosition, secondPosition, thirdPosition] = winningPatterns[i];

        //If the game is won...
        if (tiles[firstPosition].innerHTML== lastPlayedMark &&
          tiles[secondPosition].innerHTML== lastPlayedMark && 
          tiles[thirdPosition].innerHTML== lastPlayedMark) {
          winStatus = true;
          successfullWinPattern = [firstPosition, secondPosition, thirdPosition]
          //the return ends the function and consequently the loop. Doing so will prevent the loop from re-evaluating winStatus to false when it tests for a winPattern that has not been matched
          return;
        } else {
          winStatus = false;
          // alert("1st tile is"+ tiles[firstPosition].innerHTML +" 2nd:"+ tiles[secondPosition].innerHTML +" 3rd tile is"+ tiles[thirdPosition].innerHTML)
        }

        //check for a draw
        if (winStatus==false && numOfPlays==9){
          winStatus = "draw"
        }

      }//e.o.for()
    } //e.o.f()


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


    function createMirrorDoubleWinPatterns(){
      var currentRotation = [];
      let rotations = [];
      
      for (let i = 0; i < doubleWinPatterns.length; i++) {
      
          for (let k = 1; k <= 3; k++) {
              let angleToRotate = k * 90;
              // alert(`rotation angle = ${angleToRotate}`)
              currentRotation = rotateArray(angleToRotate, doubleWinPatterns[i])
              // console.log('rotation of', doubleWinPatterns[i], 'by', k, 'degrees =', currentRotation);
              // alert(`${doubleWinPatterns[i]} rotated to ${currentRotation}`)
              
              rotations.push(currentRotation);

          }//for...k
      
      }//for...i

      doubleWinPatterns = doubleWinPatterns.concat(rotations)
    }//e.o.f()


    function determineNextMove(){
      /*
        RANKING OF MOVES
        1. WinningMove
        2. Block-win move
        3. Double-win move
        4. Block double win move
        5. Win Pattern move
      */

      //After determining the value of nextMove, set the var used to determine it's value to undefined cuz it's no longer needed
      //This also prevents the var from being reused when its no longer valid
      if (winningMove != undefined) { nextMove = winningMove; winningMove = undefined;
        console.log('winningMove played') }

      else if ( positionToPlayToBlockWin != undefined && 
                !tiles[positionToPlayToBlockWin].classList.contains('clicked') 
      ) { 
        nextMove = positionToPlayToBlockWin; positionToPlayToBlockWin = undefined;
        console.log('positionToPlayToBlockWin played') 
      }

      else if ( positionToPlayToMakeDoubleWin != undefined &&
                !tiles[positionToPlayToMakeDoubleWin].classList.contains('clicked') 
      ) { 
        nextMove = positionToPlayToMakeDoubleWin; positionToPlayToMakeDoubleWin = undefined;
        console.log('positionToPlayToMakeDoubleWin played') 
      }

      else if ( positionToPlayToBlockDoubleWin != undefined &&
                !tiles[positionToPlayToBlockDoubleWin].classList.contains('clicked')
      ) { 
        nextMove =  positionToPlayToBlockDoubleWin; positionToPlayToBlockDoubleWin = undefined;
        console.log('positionToPlayToBlockDoubleWin played') 
      }

      else if ( nextMoveFromSelectedDoubleWinPattern != undefined &&
                !tiles[nextMoveFromSelectedDoubleWinPattern].classList.contains('clicked')
      ){ 
        nextMove = nextMoveFromSelectedDoubleWinPattern; nextMoveFromSelectedDoubleWinPattern = undefined;
        console.log('nextMoveFromSelectedDoubleWinPattern played')
      }

      else { nextMove = nextMoveFromSelectedWinPattern; nextMoveFromSelectedWinPattern = undefined;
        console.log('nextMoveFromSelectedWinPattern played')}
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
      adjustSoundIcons()
      createMirrorDoubleWinPatterns();
      /*In-game music and sound(s) courtesy of "Smash Hits!"*/
      document.onclick = function(){playMusic()}
    }//e.o.f()


    function makeTilesGlow(){
      var [winningTiles1, winningTiles2, winningTiles3] = successfullWinPattern;
      
            tiles[winningTiles1].style.animation = "flash 0.5s ";
            tiles[winningTiles2].style.animation = "flash 0.5s ";
            tiles[winningTiles3].style.animation = "flash 0.5s ";

            successfullWinPattern = [];
    }//e.o.f()


    function newRound() {
      if (roundNo>1) updateScoreSheetMsgs();

      //empty the board and remove the glow animation
      for (var i = 0; i < tiles.length; i++) {
        tiles[i].innerHTML = null;
        tiles[i].className = '';
        tiles[i].style.animation = null;
      }
      //reset the variables needed per round
      numOfPlays = 0;
      nextMove = undefined;
      selectedWinPattern = undefined;
      winningMove = undefined;
      winStatus = undefined;
      positionToPlayToBlockWin = undefined;
      unplayedTiles = [0,1,2,3,4,5,6,7,8];
      winJeopardizedStatus = false;
      winPatternsToSelectFrom = [
          [0,1,2],  //0
          [3,4,5],  //1
          [6,7,8],  //2
          [0,3,6],  //3
          [0,4,8],  //4
          [1,4,7],  //5
          [2,5,8],  //6
          [2,4,6]   //7
      ]//removeJeopardizedWinPattern() alters the content of winningPatterns, so it needs to be reset at the beginning of every round.

      //Update the scoresheet
      document.getElementById('x-score').innerHTML = x_Score;
      document.getElementById('o-score').innerHTML = o_Score;
      //Show round-no
      currRoundNo.innerHTML = roundNo;

      // make the computer choose another winPattern
      // chooseWinPattern();

      //if the human made the last move on the previous round, then the computer should make the first move on the next round
      if (isPlayersTurn==false && roundNo!=1) {
        // alert('pc makes next move')
        setTimeout(function(){computersTurn()}, 300)
        // alert('from newRound')
      }else{
        // alert('human makes next move')
      }

      //also clear the console
      console.clear();

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


    function randomNumberFromZeroTo (num) {
      let numLength = new String(num);
      numLength = numLength.length;
      let randomNo = Math.floor( 
        ( Math.random() * (10**numLength) ) 
      );
      randomNo = randomNo % (num + 1)
      return randomNo;
    }//e.o.f()


    function resetAllVars(){
      x_Score = 0;
      o_Score = 0;
      roundNo = 1;
      numOfPlays = 0;
      playerMark = null;
      computerMark = null;
      winStatus =  undefined;
      isPlayersTurn = false; //computer gets first move at the beginning of every game in normal mode
      lastPlayedMark = null;
      playersLead.innerHTML = "0";
      playersLead.style.color = "yellow";
      funMsgAboutWinStat.innerHTML = "";
      currRoundNo.innerHTML = "1";
    }//e.o.f()


    function roundIsWon(){
       
        //check who won the round
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


    function rotateArray(angle, array){
      // alert(`rotateArray() called`);
      let noOfRotations = angle/90;
 
      //it's necessary to create rotatedArr using this loop, because
      //simply assigning array to rotatedArr will make rotatedArr a 
      //reference to the array that was passed to the function.
      //Any changes to rotatedArr will reflect on the array passed
      //into the function.
      // --This shitty issue caused me serious troubles :(
      
      let rotatedArr = [];
      for (var i = 0; i < array.length; i++) {
        rotatedArr[i] = array[i]
      }

      let mirrors = {
        "0": 2,
        "1": 5,
        "2": 8,
        "3": 1,
        "4": 4,
        "5": 7,
        "6": 0,
        "7": 3,
        "8": 6,
      }

      for (let i = 0; i < noOfRotations; i++) {
        for (let k = 0; k < rotatedArr.length; k++) {
            let str = String(rotatedArr[k])
            rotatedArr[k] = mirrors[str];
        }        
      }

      return rotatedArr

    }//e.o.f()


    function removeJeopardizedWinPatternFromWinningPatternsList(){
      var indexOfWinPattern = winPatternsToSelectFrom.indexOf(selectedWinPattern);
      winPatternsToSelectFrom.splice(indexOfWinPattern, 1);
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

          //If both players are at a tie
          if (pointsDifference == 0) {
            teasingMsg = tieMsgs[
            randomNumberFromZeroTo( losingMsgs1_3.length  - 1)
            ]
          }

          //If player is in lead
          else if (pointsDifference > 0 && pointsDifference <= 3) {
            teasingMsg = winningMsgs1_3[
            randomNumberFromZeroTo( winningMsgs1_3.length - 1 )
            ]
          }

          else if (pointsDifference > 3 && pointsDifference <=7) {
            teasingMsg = winningMsgs4_7[
            randomNumberFromZeroTo( winningMsgs4_7.length - 1 )
            ]
          }

          else if (pointsDifference > 7){
            teasingMsg = winningMsgs8_10[
            randomNumberFromZeroTo( winningMsgs8_10.length - 1 )
            ]
          }

          //If player is losing
          else if (pointsDifference < 0 && pointsDifference >= -3) {
            teasingMsg = losingMsgs1_3[
            randomNumberFromZeroTo( losingMsgs1_3.length - 1 )
            ]
          }

          else if (pointsDifference < -3 && pointsDifference >= -7) {
            teasingMsg = losingMsgs4_7[
            randomNumberFromZeroTo( losingMsgs4_7.length - 1 )
            ]
          }

          else if (pointsDifference < -7) {
            teasingMsg = losingMsgs8_10[
            randomNumberFromZeroTo( losingMsgs8_10.length - 1 )
            ]
          }

          return teasingMsg;
    }//e.o.f()


    function welcomeScreen(){
      document.querySelector('#boardContainer').style.display = 'none';
      document.querySelector('#modal').style.display = 'block';
      document.querySelector('#chooseMarkMenu').style = 'block';
    }//e.o.f()




    //An explanation of the entire code is available at : "futureFileLocation.org (if the code becomes so popular, that I have to make a website  :) or ticTacToe(Normal).txt"
