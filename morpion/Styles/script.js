var origBoard;
const huPlayer = "X";
const aiPlayer = "O";
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];
var is_won = false;

const cells = document.querySelectorAll(".cell");

startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys());

  // clearing the board
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("color");
    cells[i].addEventListener("click", turnClick, false);
  }

  // reinitialising is_won
  is_won = false;
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] === "number") {
    turn(square.target.id, huPlayer);
    if (
      !checkTie() &&
      !(checkWin(origBoard, huPlayer) || checkWin(origBoard, aiPlayer))
    )
      turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  document.getElementById(squareId).style.color = "lightgrey";
  // check win and act accordingly
  let gameWon = checkWin(origBoard, player);
  if (gameWon) {
    gameOver(gameWon);
  }
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.color =
      gameWon.player == huPlayer ? "red" : "red";
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  // updating is_won
  is_won = true;

  declareWinner(gameWon.player == huPlayer ? "You Win" : "You Lose");
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerHTML = "<h3>" + who + "</h3>";
}

function emptySquares() {
  return origBoard.filter((s) => typeof s === "number");
}

function bestSpot() {
  return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
  if (emptySquares().length == 0) {
    if (!is_won) {
      for (var i = 0; i < cells.length; i++) {
        // cells[i].style.color = "green";
        cells[i].removeEventListener("click", turnClick, false);
      }
      declareWinner("Draw");
    }
    return true;
  }
}

function minimax(newBoard, player) {
  var availSpots = emptySquares();

  if (checkWin(newBoard, huPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
