//console.log("Hello world");

//This is the game status element

const statusDisplay = document.querySelector('.game-status');

//these are variables to track the game state during each game
let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let currentScore = 0;
let playerXScore = 0;
let playerOScore = 0;

//these are the scoreboard elements
const playerXScore_span = document.getElementById('playerX-score');
const playerOScore_span = document.getElementById('playerO-score');

//messages to display to the players
const winningMessage = () => `Player ${currentPlayer} has won!!`;
const drawMessage = () => `Tied!! The game is a draw.`;
const currentPlayerTurn = () => `It is ${currentPlayer}'s turn`;

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

function playerChange() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusDisplay.innerHTML = currentPlayerTurn();
}

function incrementScore() {
  currentScore = currentPlayer === "X" ? playerXScore : playerOScore;
  currentStore++;
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
    // playerXScore++;
    // playerXScore_span.innerHTML = playerXScore;
    statusDisplay.innerHTML = winningMessage();
    gameActive = false;
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
  playerXScore_span.innerHTML = 0;
  playerOScore_span.innerHTML = 0;
}

//event listeners for the game cells
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', cellClick));
//event listener for the restart button
document.querySelector('.game-reset').addEventListener('click', resetGame);
//event listener for the score reset button
document.querySelector('.score-reset').addEventListener('click', resetScores);

// document.querySelector('.score-plus').addEventListener('click', incrementScore)