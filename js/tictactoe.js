//console.log("Hello world");
$(document).ready(function(){

    //This is the game status element
    const statusDisplay = document.querySelector('.status-message');

    //these are variables to track the game state during each game
    let gameActive = true;
    let currentPlayer = "X";
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let playerXScore = 0;
    let playerOScore = 0;

    //these are the scoreboard elements
    const playerXScoreSpan = document.getElementById('playerX-score');
    const playerOScoreSpan = document.getElementById('playerO-score');
    const scoreBoard = document.querySelector('.score-board');

    //messages to display to the players
    const winningMessage = () => `${currentPlayer} has won!!`;
    const drawMessage = () => `Tied!! The game is a draw.`;
    const currentPlayerTurn = () => `${currentPlayer}.....your turn`;

    //animation event for the scoreboard intital load
    scoreBoard.classList.add('animate__animated', 'animate__rubberBand');
    scoreBoard.addEventListener('animationend', () => {
      scoreBoard.classList.remove('animate__animated', 'animate__rubberBand');
    });


    //display the initial message to let players know whose turn it is
    statusDisplay.innerHTML = currentPlayerTurn();

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

    function cellPlayed(clickedCell, clickedCellIndex) {
      //update gameState with player move & update UI
      gameState[clickedCellIndex] = currentPlayer;
      clickedCell.innerHTML = currentPlayer;
    }

    //animate.css function to allow animation events to be added
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

    function playerChange() {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      statusDisplay.innerHTML = currentPlayerTurn();
    }

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

      if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        animateCSS('.score-board', 'rubberBand');
        incrementScore();
        return;
      }

      let roundDraw = !gameState.includes("");
      if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
      }

      playerChange();

    }

    function cellClick(clickedCellEvent) {
      const clickedCell = clickedCellEvent.target;
      const clickedCellIndex = parseInt(clickedCell.getAttribute('game-cell-index'));

      //check to see if the cell has been played already or if the game is paused
      if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
      }

      //if everything passes the game will continue
      cellPlayed(clickedCell, clickedCellIndex);
      resultCheck();
    }

    function resetGame() {
      gameActive = true;
      currentPlayer = "X";
      gameState = ["", "", "", "", "", "", "", "", ""];
      statusDisplay.innerHTML = currentPlayerTurn();
      document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
    }

    function resetScores() {
      playerXScore = 0;
      playerOScore = 0;
      playerXScoreSpan.innerHTML = 0;
      playerOScoreSpan.innerHTML = 0;
    }

    //event listeners for the game cells
    document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', cellClick));
    //event listener for the restart button
    $('.game-reset').click(resetGame);

    //event listener for the score reset button
    $('.score-reset').click(resetScores);

  });

// });
