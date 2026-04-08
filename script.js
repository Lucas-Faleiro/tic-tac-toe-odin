const GameBoard = (function () {
  const board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  return { board };
})();

const TurnsCounter = (function () {
  let counter = 0;
  const addToCounter = () => {
    counter++;
  };

  const getCounter = () => {
    return counter;
  };

  return { getCounter, addToCounter };
})();

const GameRules = (function () {
  const { board } = GameBoard;

  const verifiyVictory = () => {
    if (board[0] === board[1] && board[1] === board[2]) {
      if (board[0] === "X") return true;
      else return false;
    }
    if (board[3] === board[4] && board[4] === board[5]) {
      if (board[3] === "X") return true;
      else return false;
    }
    if (board[6] === board[7] && board[7] === board[8]) {
      if (board[6] === "X") return true;
      else return false;
    }
    if (board[0] === board[3] && board[3] === board[6]) {
      if (board[0] === "X") return true;
      else return false;
    }
    if (board[1] === board[4] && board[4] === board[7]) {
      if (board[1] === "X") return true;
      else return false;
    }
    if (board[2] === board[5] && board[5] === board[8]) {
      if (board[2] === "X") return true;
      else return false;
    }
    if (board[0] === board[4] && board[4] === board[8]) {
      if (board[0] === "X") return true;
      else return false;
    }
    if (board[2] === board[4] && board[4] === board[6]) {
      if (board[2] === "X") return true;
      else return false;
    }
    if (TurnsCounter.getCounter() === 8) {
      return "tie";
    }
  };

  return { verifiyVictory };
})();

const GameController = (function () {
  const { board } = GameBoard;
  let symbol = "X";
  let victory;
  let isGameOver = false;

  const fillATile = (tilePosition) => {
    if (isGameOver) return;

    if (board[tilePosition] === "X" || board[tilePosition] === "O") {
      console.log("invalid move");
      return "invalid";
    }

    board[tilePosition] = symbol;
    if (symbol === "X") symbol = "O";
    else symbol = "X";

    victory = GameRules.verifiyVictory();
    TurnsCounter.addToCounter();

    if (victory === true) {
      console.log("Player 1 Victory");
      isGameOver = true;
      return "Player 1";
    } else if (victory === false) {
      console.log("Player 2 Victory");
      isGameOver = true;
      return "Player 2";
    } else if (victory === "tie") {
      console.log("That's a tie!");
      isGameOver = true;
      return "Tie";
    }
    return "continue";
  };

  return { fillATile, isGameOver };
})();

const DisplayController = (function () {
  const { board } = GameBoard;
  const { fillATile } = GameController;
  const gameTable = document.querySelector("#game-table");
  const gameContainer = document.querySelector("#game-container");

  const handleTileClick = (element, index) => {
    const sucessfullMove = fillATile(Number(index));
    if (sucessfullMove === "continue") {
      element.innerText = board[index];
      console.log(board);
    } else if (sucessfullMove === "Player 1") {
      element.innerText = board[index];
      displayWinner(true);
    } else if (sucessfullMove === "Player 2") {
      element.innerText = board[index];
      displayWinner(false);
    } else {
      element.innerText = board[index];
      displayWinner("tie");
    }
  };

  const displayWinner = (gameResult) => {
    const winnerText = document.createElement("span");
    if (gameResult === true) {
      winnerText.innerText = "Player 1 Wins!";
    } else if (gameResult === false) {
      winnerText.innerText = "Player 2 Wins!";
    } else {
      winnerText.innerText = "Its a tie!";
    }
    gameContainer.insertBefore(winnerText, gameTable);
  };

  board.forEach((tile, index) => {
    const gameTile = document.createElement("div");
    gameTile.setAttribute("class", "game-tile");

    gameTile.addEventListener("click", () => handleTileClick(gameTile, index));

    gameTable.append(gameTile);
  });
})();

console.log(GameBoard.board);
