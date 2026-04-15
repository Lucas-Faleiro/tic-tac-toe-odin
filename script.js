const GameBoard = () => {
  let board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = i;
    }
  };

  const getBoard = () => board;

  return { resetBoard, getBoard };
};

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
  const { resetCounter } = TurnsCounter;
  const startGameBtn = document.querySelector("#start-game-btn");
  let symbol = "X";
  let winner;
  let isGameOver = false;
  const gameBoard = GameBoard();

  const getBoard = gameBoard.getBoard();
  const getWinner = () => winner;
  const getIsGameOver = () => isGameOver;
  const getSymbol = () => symbol;

  const changeSymbol = () => {
    if (symbol === "X") symbol = "O";
    else symbol = "X";
  };

  const fillTile = (tilePosition) => {
    if (isGameOver) return;

    if (
      gameBoard.getBoard()[tilePosition] === "X" ||
      gameBoard.getBoard()[tilePosition] === "O"
    ) {
      console.log("invalid move");
      return false;
    }

    gameBoard.getBoard()[tilePosition] = getSymbol();
    changeSymbol();

    winner = GameRules.verifyVictory(
      gameBoard.getBoard(),
      TurnsCounter.getCounter(),
    );
    TurnsCounter.addToCounter();

    if (winner === "X" || winner === "O" || winner === "tie") {
      isGameOver = true;
    }
    return true;
  };

  const startGame = (playersList) => {};

  const gameRestart = () => {
    gameBoard.resetBoard();
    resetCounter();
    symbol = "X";
    isGameOver = false;
    winner = null;
  };

  return {
    fillTile,
    gameRestart,
    getIsGameOver,
    getWinner,
    getBoard,
    startGame,
  };
})();

const DisplayController = (function () {
  const {
    fillTile,
    gameRestart,
    getIsGameOver,
    getWinner,
    getBoard,
    startGame,
  } = GameController;
  const gameTable = document.querySelector("#game-table");
  const gameContainer = document.querySelector("#game-container");
  const winnerText = document.querySelector("#winner-text");

  const handleTileClick = (element, index) => {
    const isValidMove = fillTile(Number(index));

    if (isValidMove) {
      element.innerText = getBoard[index];

      if (getIsGameOver()) {
        displayWinner();
      }
    }
  };

  const displayWinner = () => {
    winnerText.setAttribute("id", "winner-text");

    if (getWinner() === "tie") {
      winnerText.innerText = "Its a tie!";
    } else {
      winnerText.innerText = `${getWinner()} Wins!`;
    }
  };

  const displayBoard = (board) => {
    board.forEach((tile, index) => {
      const gameTile = document.createElement("div");
      gameTile.setAttribute("class", "game-tile");

      gameTile.addEventListener("click", () =>
        handleTileClick(gameTile, index),
      );

      gameTable.append(gameTile);
    });
  };

  const grabPlayersNames = () => {
    const players = document.querySelectorAll(".players");
    const playersList = Array.from(players).map(({ value }) => value);
    return playersList;
  };

  const displayStartBtn = () => {
    const startBtn = document.createElement("button");
    startBtn.setAttribute("id", "start-game-btn");
    startBtn.innerText = "Start";
    startBtn.addEventListener("click", () => {
      displayBoard(getBoard);
      startGame(grabPlayersNames());
    });
    gameContainer.insertBefore(startBtn, winnerText);
  };
  displayStartBtn();

  const displayPlayer = (playerOne, playerTwo) => {
    const spanPlayerOne = document.createElement("span");
    spanPlayerOne.innerText = playerOne;
    spanPlayerOne.setAttribute("class", "players");
    gameContainer.insertBefore(spanPlayerOne, winnerText);

    const spanPlayerTwo = document.createElement("span");
    spanPlayerTwo.innerText = playerTwo;
    spanPlayerTwo.setAttribute("class", "players");
    gameContainer.insertBefore(spanPlayerTwo, winnerText);
  };

  const restartBtn = document.createElement("button");
  restartBtn.innerText = "↩ Restart";
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

  return { displayBoard, displayPlayer, grabPlayersNames };
})();

const Player = (name) => {
  const playerName = name;

  const getPlayerName = () => playerName;

  return { getPlayerName };
};
