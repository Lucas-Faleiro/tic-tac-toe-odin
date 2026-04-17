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
  let activePlayers;
  const getBoard = gameBoard.getBoard();

  const getWinner = () => winner;
  const getIsGameOver = () => isGameOver;
  const getSymbol = () => symbol;
  const getActivePlayers = () => activePlayers;

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

    if (winner === "X" || winner === "O") {
      const winnerPlayer = getActivePlayers().find(
        (player) => player.getPlayerMarker() === getWinner(),
      );
      winnerPlayer.incrementScore();
      isGameOver = true;
    } else if (winner === "tie") {
      isGameOver = true;
    }

    return true;
  };

  const startGame = (playersList) => {
    activePlayers = playersList.map((player, index) => {
      if (index === 0) return Player(player, "X");
      else return Player(player, "O");
    });
  };

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
    getActivePlayers,
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
    getActivePlayers,
  } = GameController;
  const gameContainer = document.querySelector("#game-container");
  const winnerText = document.querySelector("#winner-text");
  const playersInputContainer = document.querySelector(
    "#player-input-container",
  );
  const playersInfoContainer = document.querySelector(
    "#players-info-container",
  );

  const handleTileClick = (element, index) => {
    const isValidMove = fillTile(Number(index));

    if (isValidMove) {
      element.innerText = getBoard[index];
      element.classList.add(`game-tile-${getBoard[index]}`);

      if (getIsGameOver()) {
        updateScore();
        displayWinner();
      }
    }
  };

  const displayWinner = () => {
    winnerText.setAttribute("id", "winner-text");

    if (getWinner() === "tie") {
      winnerText.innerText = "Its a tie!";
    } else {
      const winnerName = getActivePlayers().find(
        (player) => player.getPlayerMarker() === getWinner(),
      );
      winnerText.innerText = `${winnerName.getPlayerName()} Wins!`;
    }
  };

  const displayBoard = (board) => {
    const gameTable = document.createElement("div");
    gameTable.setAttribute("id", "game-table");
    gameContainer.insertBefore(gameTable, playersInfoContainer);
    board.forEach((tile, index) => {
      const gameTile = document.createElement("div");
      gameTile.setAttribute("class", "game-tile");

      gameTile.addEventListener("click", () =>
        handleTileClick(gameTile, index),
      );

      gameTable.append(gameTile);
    });
  };

  const getPlayersNames = () => {
    const players = document.querySelectorAll(".playersInput");
    const playersList = Array.from(players).map(({ value }, index) => {
      if (index === 0) {
        return value || "Player 1";
      } else {
        return value || "Player 2";
      }
    });
    return playersList;
  };

  const displayStartBtn = () => {
    const startBtn = document.createElement("button");
    startBtn.setAttribute("id", "start-game-btn");
    startBtn.innerText = "START GAME";

    startBtn.addEventListener("click", () => {
      const playerNames = getPlayersNames();
      displayBoard(getBoard);
      startGame(playerNames);
      displayPlayerInfo();
      createRestartBtn();
      startBtn.remove();
      playersInputContainer.remove();
    });
    gameContainer.insertBefore(startBtn, winnerText);
  };
  displayStartBtn();

  const createRestartBtn = () => {
    const restartBtn = document.createElement("button");
    restartBtn.innerText = "↩ Restart";
    restartBtn.setAttribute("id", "restart-btn");
    gameContainer.insertBefore(restartBtn, playersInfoContainer);
    restartBtn.addEventListener("click", () => {
      gameRestart();
      resetBoard();
      resetWinner();
    });
  };

  const resetBoard = () => {
    const allTiles = document.querySelectorAll(".game-tile");
    allTiles.forEach((tile) => {
      tile.innerText = "";
      tile.classList.remove("game-tile-X", "game-tile-O");
    });
  };

  const resetWinner = () => {
    const findWinnerText = document.querySelector("#winner-text");
    if (findWinnerText) {
      findWinnerText.innerText = "";
    }
  };

  const displayPlayerInfo = () => {
    const activePlayers = getActivePlayers();

    activePlayers.forEach((player, index) => {
      const playerInfoDiv = document.createElement("div");
      playerInfoDiv.setAttribute("class", "player-info");
      playerInfoDiv.setAttribute("id", `player-info${index + 1}`);
      playersInfoContainer.append(playerInfoDiv);

      const spanPlayer = document.createElement("span");
      spanPlayer.innerText = player.getPlayerName();
      spanPlayer.setAttribute("class", "players");
      playerInfoDiv.append(spanPlayer);

      const scoreSpan = document.createElement("span");
      scoreSpan.innerText = `${player.getScore()}`;
      scoreSpan.setAttribute("class", "score-text");
      playerInfoDiv.append(scoreSpan);
    });
  };

  const updateScore = () => {
    const activePlayers = getActivePlayers();
    const listScore = document.querySelectorAll(".score-text");
    for (let i = 0; i < activePlayers.length; i++) {
      listScore[i].innerText = `${activePlayers[i].getScore()}`;
    }
  };

  return { displayBoard, grabPlayersNames: getPlayersNames };
})();

const Player = (name, marker) => {
  const playerName = name;
  const playerMarker = marker;
  let score = 0;

  const getPlayerName = () => playerName;
  const getPlayerMarker = () => playerMarker;
  const getScore = () => score;

  const incrementScore = () => (score += 1);

  return { getPlayerName, getPlayerMarker, getScore, incrementScore };
};
