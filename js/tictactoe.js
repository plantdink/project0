$(document).ready(function(){

    //This is the game status element
    const statusDisplay = document.querySelector('.status-message');

    //these are the scoreboard elements
    const playerXScoreSpan = document.getElementById('playerX-score');
    const playerOScoreSpan = document.getElementById('playerO-score');
    const scoreBoard = document.querySelector('.score-board');

    //these are variables to track the game state & other related parts during each game
    let gameActive = true;
    let currentPlayer = "X";
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let playerXScore = 0;
    let playerOScore = 0;

    //messages to display things to the players
    const winningMessage = () => `${currentPlayer} has won!!`;
    const drawMessage = () => `Tied!! The game is a draw.`;
    const currentPlayerTurn = () => `${currentPlayer}.....your turn`;

    //this creates the animation event for the scoreboard intital load
    scoreBoard.classList.add('animate__animated', 'animate__rubberBand');
    scoreBoard.addEventListener('animationend', () => {
      scoreBoard.classList.remove('animate__animated', 'animate__rubberBand');
    });

    //display a message to let players know whose turn it is
    statusDisplay.innerHTML = currentPlayerTurn();

    //this array holds the different winning combinations to compare against after each turn
    const winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    //this is the function to track what happens when a player interacts with a cell to make their move
    function cellPlayed(clickedCell, clickedCellIndex) {
      //this will update gameState with player move & update UI
      gameState[clickedCellIndex] = currentPlayer;
      clickedCell.innerHTML = currentPlayer;
    }

    //animate.css function to allow animation events to be added to different elements just be calling animateCSS(element, animation)
    const animateCSS = (element, animation, prefix = 'animate__') =>
     new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`;
      const node = document.querySelector(element);

      node.classList.add(`${prefix}animated`, animationName);

      function handleAnimationEnd(event) {
        event.stopPropagation();
        node.classList.remove(`${prefix}animated`, animationName);
        resolve('Animation ended');
      }

      node.addEventListener('animationend', handleAnimationEnd, {once: true});
    });

    //this operator allows the players to automatically "change" after each click on the board
    function playerChange() {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      statusDisplay.innerHTML = currentPlayerTurn();
    }

    //this function will increment the winning players score, & update the scoreBoard to reflect
    function incrementScore() {
      if (currentPlayer === "X"){
        playerXScore++;
      } else {
        playerOScore++;
      }
      playerXScoreSpan.innerHTML = playerXScore;
      playerOScoreSpan.innerHTML = playerOScore;
      return;
    }

    //this function loops through the winningConditions array & compares to see if any of the arrays match
    function resultCheck() {
      let roundWon = false;
      for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
          continue;
        }
        if (a === b && b === c) {
          roundWon = true;
          break
        }
      }
      //this function changes the status message to notify the players, changes the game state, increments the winning players score & triggers a small animation to "celebrate" the win
      if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        animateCSS('.score-board', 'rubberBand');
        incrementScore();
        return;
      }
      // this checks to see if any of the values in the gameState array are empty, & continues the game or declares it a draw
      let roundDraw = !gameState.includes("");
      if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
      }
      //reaching this point means that no players has won yet, and triggers the change automatically
      playerChange();
    }

    //this function detects the cell that is clicked
    function cellClick(clickedCellEvent) {
      const clickedCell = clickedCellEvent.target;
      const clickedCellIndex = parseInt(clickedCell.getAttribute('game-cell-index'));

      //check to see if the cell has been played already or if the game is "paused"
      if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
      }

      //if everything passes the game will continue
      cellPlayed(clickedCell, clickedCellIndex);
      resultCheck();
    }

    //this function resets, & updates, different parts so that another game can continue
    function resetGame() {
      gameActive = true;
      currentPlayer = "X";
      gameState = ["", "", "", "", "", "", "", "", ""];
      statusDisplay.innerHTML = currentPlayerTurn();
      document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
    }

    //this function enables the scoreBoard to be reset if a new player starts playing
    function resetScores() {
      playerXScore = 0;
      playerOScore = 0;
      playerXScoreSpan.innerHTML = 0;
      playerOScoreSpan.innerHTML = 0;
    }

    //this creates the event listener for the game cells
    document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', cellClick));

    //this creates the event listener for the game restart button. It is written in jQuery
    $('.game-reset').click(resetGame);

    //this creates the event listener for the score reset button. It is written in jQuery
    $('.score-reset').click(resetScores);

  });
