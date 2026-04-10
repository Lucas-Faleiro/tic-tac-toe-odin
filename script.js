const GameBoard = (function () {
  let board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = i;
    }
  };

  return { board, resetBoard };
})();

const TurnsCounter = (function () {
  let counter = 0;

  const addToCounter = () => {
    counter++;
  };

  const getCounter = () => {
    return counter;
  };

  const resetCounter = () => {
    counter = 0;
  };

  return { getCounter, addToCounter, resetCounter };
})();

const GameRules = (function () {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const verifyVictory = (board, currentTurn) => {
    for (let i = 0; i < winningCombinations.length; i++) {
      if (winningCombinations[i].every((tile) => board[tile] === "X")) {
        return "X";
      } else if (winningCombinations[i].every((tile) => board[tile] === "O")) {
        return "O";
      }
    }
    if (currentTurn === 8) {
      return "tie";
    }
  };
  return { verifyVictory };
})();

const GameController = (function () {
  const { board, resetBoard } = GameBoard;
  const { resetCounter } = TurnsCounter;
  let symbol = "X";
  let winner;
  let isGameOver = false;

  const getWinner = () => winner;

  const getIsGameOver = () => isGameOver;

  const getSymbol = () => symbol;

  const changeSymbol = () => {
    if (symbol === "X") symbol = "O";
    else symbol = "X";
  };

  const fillTile = (tilePosition) => {
    if (isGameOver) return;

    if (board[tilePosition] === "X" || board[tilePosition] === "O") {
      console.log("invalid move");
      return false;
    }

    board[tilePosition] = getSymbol();
    changeSymbol();

    winner = GameRules.verifyVictory(board, TurnsCounter.getCounter());
    TurnsCounter.addToCounter();

    if (winner === "X" || winner === "O" || winner === "tie") {
      isGameOver = true;
    }
    return true;
  };

  const gameRestart = () => {
    resetBoard();
    resetCounter();
    symbol = "X";
    isGameOver = false;
    winner = null;
  };

  return { fillTile, gameRestart, getIsGameOver, getWinner };
})();

const DisplayController = (function () {
  const { board } = GameBoard;
  const { fillTile, gameRestart, getIsGameOver, getWinner } = GameController;
  const gameTable = document.querySelector("#game-table");
  const gameContainer = document.querySelector("#game-container");

  const handleTileClick = (element, index) => {
    const isValidMove = fillTile(Number(index));

    if (isValidMove) {
      element.innerText = board[index];

      if (getIsGameOver()) {
        displayWinner();
      }
    }
  };

  const displayWinner = () => {
    const winnerText = document.querySelector("#winner-text");
    winnerText.setAttribute("id", "winner-text");

    if (getWinner() === "tie") {
      winnerText.innerText = "Its a tie!";
    } else {
      winnerText.innerText = `${getWinner()} Wins!`;
    }
  };

  board.forEach((tile, index) => {
    const gameTile = document.createElement("div");
    gameTile.setAttribute("class", "game-tile");

    gameTile.addEventListener("click", () => handleTileClick(gameTile, index));

    gameTable.append(gameTile);
  });

  const restartBtn = document.createElement("button");
  restartBtn.innerText = "Restart";
  restartBtn.setAttribute("id", "restart-btn");
  gameContainer.append(restartBtn);
  restartBtn.addEventListener("click", () => {
    gameRestart();

    const allTiles = document.querySelectorAll(".game-tile");
    allTiles.forEach((tile) => {
      tile.innerText = "";
    });

    const findWinnerText = document.querySelector("#winner-text");
    if (findWinnerText) {
      findWinnerText.innerText = "";
    }
  });
})();

console.log(GameBoard.board);
