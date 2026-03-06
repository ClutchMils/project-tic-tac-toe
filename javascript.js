const gameboard = (() => {
  let gameboard = ["", "", "", "", "", "", "", "", ""];

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
