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

  return { getBoard, placeMark, resetBoard };
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

const players = [];

const gameController = (() => {
  let currentPlayer = null;
  let gameActive = false;

  const startGame = (name1, name2) => {
    players.length = 0; //  clear old players

    addPlayers(name1, "X");
    addPlayers(name2, "O");

    currentPlayer = players[0];
    gameActive = true;

    gameBoard.resetBoard();

    return `${currentPlayer.name} starts`;
  };

  const addPlayers = (name, marker) => {
    const player = new Player(name, marker);

    players.push(player);
  };
 
  const switchPlayer = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
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
      // console.log("draw");
      return true;
    }
    return false;
  };

  const playRounds = (index) => {
    if (!gameActive) return; // blocks play before new game

    const cleanIndex = Number(index);
    if (index === undefined || isNaN(index)) return;

    const board = gameBoard.getBoard();
    if (board[cleanIndex] !== "") return; // prevent overwriting

    // The rest of the code only runs if index is a valid number
    console.log("Processing round for:", index);

    // Temporary: flash the button green when clicked
    const btn = document.querySelector(`[data-index="${index}"]`);
    btn.style.backgroundColor = "lightgreen";
    setTimeout(() => (btn.style.backgroundColor = ""), 200);

    gameBoard.placeMark(cleanIndex, currentPlayer.marker);
    // let checkWinner = gameController.checkWinner();
    // let checkDraw = gameController.checkDraw();

    if (checkWinner()) {
      gameActive = false;
      return `${currentPlayer.name} wins`;
    }

    if (checkDraw()) {
      gameActive = false;
      return "Draw";
    }
    switchPlayer();
    return `${currentPlayer.name} turn`;
  };

  return { switchPlayer, checkWinner, checkDraw, playRounds, startGame };
})();

const displayController = (() => {
  const boardElement = document.querySelector("#game-board");
  const resetBtn = document.querySelector("#reset-btn");
  const newGameBtn = document.querySelector("#new-btn");

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
    const boardText = document.querySelector("#game-instr");

    // Check if the cell is empty before playing (logic protection)
    if (btn.textContent === "" && gameController.checkWinner() === false) {
      boardText.textContent = gameController.playRounds(index);
      render(gameBoard.getBoard());
    }

  });


  resetBtn.addEventListener("click", () => {
    gameBoard.resetBoard();
    resetRender();

    if (players.length > 0) {
      gameController.startGame(players[0].name, players[1].name);
    }
  });

  newGameBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

 let modal; // 👈 store reference

 const signUpForm = () => {
   modal = document.createElement("div");
   modal.classList.add("modal");

   const modalContent = document.createElement("div");
   modalContent.classList.add("modal-content");

   const closeBtn = document.createElement("span");
   closeBtn.textContent = "×";
   closeBtn.classList.add("close-btn");

   const form = document.createElement("form");

   const input = document.createElement("input");
   input.placeholder = "Enter Player1 name";

   const input2 = document.createElement("input");
   input2.placeholder = "Enter Player2 name";

   const submit = document.createElement("button");
   submit.textContent = "Start Game";

   form.append(input, input2, submit);
   modalContent.append(closeBtn, form);
   modal.appendChild(modalContent);
   document.body.appendChild(modal);

   // CLOSE
   closeBtn.addEventListener("click", () => {
     modal.style.display = "none";
   });

   modal.addEventListener("click", (e) => {
     if (e.target === modal) modal.style.display = "none";
   });

   // SUBMIT
   form.addEventListener("submit", (e) => {
     e.preventDefault();

     const message = gameController.startGame(input.value, input2.value);

     document.querySelector("#game-instr").textContent = message;

     modal.style.display = "none";
   });

   
 };

 signUpForm();

  // Return only what is necessary for other modules to use
  return {
    render,
    resetRender,
  };
})();
