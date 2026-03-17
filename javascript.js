const gameBoard = (() => {
  let gameboard = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => {
    return gameboard;
  };

  const placeMark = (index = null, marker = "") => {
    return (gameboard[index] = marker);
  };

  const resetBoard = () => {
    gameboard = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, placeMark, resetBoard};
})();

function Player(name, marker) {
  if (!new.target) {
    throw Error("You must use the 'new' operator to call the constructor");
  }
  this.name = name;
  this.marker = marker;
}

Player.prototype.sayHello = function () {
  console.log("Hello, I'm a player!");
};

const player1 = new Player("Andre", "X");
const player2 = new Player("Also Andre", "O");

const gameController = (() => {
  let currentPlayer = player1;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;

    return currentPlayer;
  };

  const checkWinner = () => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const board = gameBoard.getBoard();

    for (let combo of winningCombos) {
      const [a, b, c] = combo;

      if (board[a] === board[b] && board[b] === board[c] && board[a] !== "") {
        return true;
      }
    }

    return false;
  };

  const checkDraw = () => {
    const board = gameBoard.getBoard();
    if (!board.includes("")) {
      console.log("draw");
      return true;
    }
    return false;
  };

  const playRounds = (index) => {
    const cleanIndex = Number(index);
    if (index === undefined || isNaN(index)) return;

    // The rest of the code only runs if index is a valid number
    console.log("Processing round for:", index);

    // Temporary: flash the button green when clicked
    const btn = document.querySelector(`[data-index="${index}"]`);
    btn.style.backgroundColor = "lightgreen";
    setTimeout(() => (btn.style.backgroundColor = ""), 200);

    gameBoard.placeMark(cleanIndex, currentPlayer.marker);
    let checkWinner = gameController.checkWinner();
    let checkDraw = gameController.checkDraw();

    if (checkWinner == true) {
      console.log("win");
      return `${currentPlayer.name} wins`;
    }

    if (checkDraw == true) {
      console.log("draw");
      return "draw";
    } else {
      console.log("continue");
      gameController.switchPlayer();
      return "continue";
    }
  };

  return { switchPlayer, checkWinner, checkDraw, playRounds };
})();

const displayController = (() => {
  const boardElement = document.querySelector("#game-board");
  const resetBtn = document.querySelector("#reset-btn");

  // Private function: Updates the text inside the buttons based on the game board array
  const render = (boardArray) => {
    const buttons = boardElement.querySelectorAll(".cell");
    buttons.forEach((btn, index) => {
      btn.textContent = boardArray[index];
    });
  };

   const resetRender = () => {
     const buttons = boardElement.querySelectorAll(".cell");
     buttons.forEach((btn) => {
       btn.textContent = "";
     });
   };

  // Public: Bind the click event to the controller
  boardElement.addEventListener("click", (e) => {
    const btn = e.target.closest(".cell");
    if (!btn) return;

    const index = +btn.dataset.index;

    // Check if the cell is empty before playing (logic protection)
    if (btn.textContent === "") {
      gameController.playRounds(index);
      render(gameBoard.getBoard());
    }
  });

  resetBtn.addEventListener("click", () => {
    gameBoard.resetBoard();
    resetRender()
  });

  // Return only what is necessary for other modules to use
  return {
    render, resetRender,
  };
})();


