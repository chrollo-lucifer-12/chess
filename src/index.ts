import { Gameboard } from './gameboard/gameboard';

const gameBoard = new Gameboard();

// Step 1: Move pawns in front of king and queen (for both white and black)
gameBoard.move({ x: 7, y: 0 }, { x: 6, y: 0 }); // White pawn (e2 -> e4)
gameBoard.printBoard()
