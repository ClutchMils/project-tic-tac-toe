const gameBoard = (() => {
  let gameboard = ["x", "o", "x", "x", "o", "o", "o", "o", ""];

  const getBoard = () => {
    return gameboard;
  };

  const placeMark = (index = null, marker = "") => {
    return gameboard.splice(index, 1, marker);
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

const gameController = ((Player1, Player2) => {
  let currentPlayer = Player1;
  let flag = 0;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === Player1 ? Player2 : Player1;

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

    let currentBoard = gameBoard.getBoard();

    winningCombos.forEach((element) => {
      let testWin = [];
      element.forEach((element) => {
        testWin.push(currentBoard[element]);
      });

      const winCondtion1 = ["x", "x", "x"];
      const winCondtion2 = ["o", "o", "o"];

      

      const arraysEqual = (testWin, winCondtion1, winCondtion2) => {
        // First, check if the lengths are the same. If not, they're not equal.
        if (testWin.length !== winCondtion1.length) {
          return false;
        }

        // Then, check if every element in arr1 strictly matches the element
        // at the same index in arr2 or arr3.
        return (
          testWin.every((value, index) => value === winCondtion1[index]) ||
          testWin.every((value, index) => value === winCondtion2[index])
        );
      };

      console.log(testWin);
      console.log(arraysEqual(testWin, winCondtion1, winCondtion2));
      if (arraysEqual(testWin, winCondtion1, winCondtion2) == true){
        console.log("winner");
        flag = 1;
      }
      return flag;
    });
  };

  const checkDraw = () => {
   
  };

  return { switchPlayer, checkWinner };
})();
