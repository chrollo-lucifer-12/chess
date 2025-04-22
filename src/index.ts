import {Gameboard} from "./gameboard/gameboard";

const gameBoard = new Gameboard()

gameBoard.move({x : 6, y : 0}, {x: 5, y : 0})
console.log(gameBoard.printBoard());
gameBoard.move({x : 1, y:0},{x : 2, y : 0})
console.log(gameBoard.printBoard());