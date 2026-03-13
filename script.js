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
      if (board[0] === "cross") return true;
      else return false;
    }
    if (board[3] === board[4] && board[4] === board[5]) {
      if (board[3] === "cross") return true;
      else return false;
    }
    if (board[6] === board[7] && board[7] === board[8]) {
      if (board[6] === "cross") return true;
      else return false;
    }
    if (board[0] === board[3] && board[3] === board[6]) {
      if (board[0] === "cross") return true;
      else return false;
    }
    if (board[1] === board[4] && board[4] === board[7]) {
      if (board[1] === "cross") return true;
      else return false;
    }
    if (board[2] === board[5] && board[5] === board[8]) {
      if (board[2] === "cross") return true;
      else return false;
    }
    if (board[0] === board[4] && board[4] === board[8]) {
      if (board[0] === "cross") return true;
      else return false;
    }
    if (board[2] === board[4] && board[4] === board[6]) {
      if (board[2] === "cross") return true;
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
  let symbol = "cross";
  let victory;

  const fillATile = (tilePosition) => {
    if (board[tilePosition] === "cross" || board[tilePosition] === "circle") {
      console.log("invalid move");
      return false;
    }
    board[tilePosition] = symbol;
    if (symbol === "cross") symbol = "circle";
    else symbol = "cross";
    return true;
  };

  const playRound = () => {
    while (true) {
      const boardPosition = prompt("qual posição?");
      const moveSucessful = fillATile(Number(boardPosition));
      if (moveSucessful) {
        victory = GameRules.verifiyVictory();
        TurnsCounter.addToCounter();
      }
      console.log(TurnsCounter.getCounter());
      console.log(victory);
      console.log(board);

      if (victory === true) {
        console.log("Player 1 Victory");
        break;
      } else if (victory === false) {
        console.log("Player 2 Victoriy");
        break;
      } else if (victory === "tie") {
        console.log("Empate");
        break;
      }
    }
  };

  return { playRound };
})();

GameController.playRound();

console.log(GameBoard.board);
