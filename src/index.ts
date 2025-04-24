import { Gameboard } from "./gameboard/gameboard"
import {Coords} from "./types";

const gameboard = new Gameboard();
let moveCount = 1;

function tryMove(from : Coords, to : Coords) {
    console.log(`\nMove ${moveCount}: (${from.x}, ${from.y}) → (${to.x}, ${to.y})`);

    const success = gameboard.move(from, to);

    if (!success) {
        console.log("❌ Invalid move");
    } else {
        console.log("✅ Move successful");
    }

    gameboard.printBoard();
    moveCount++;
}

// Moves
tryMove({ x: 6, y: 4 }, { x: 5, y: 4 });
tryMove({ x: 1, y: 4 }, { x: 2, y: 4 });
tryMove({ x: 7, y: 5 }, { x: 6, y: 4 });
tryMove({ x: 0, y: 5 }, { x: 1, y: 4 });
tryMove({ x: 7, y: 6 }, { x: 5, y: 7 });
tryMove({ x: 0, y: 6 }, { x: 2, y: 7 });
tryMove({ x: 7, y: 4 }, { x: 7, y: 6 });
tryMove({ x: 0, y: 4 }, { x: 0, y: 6 });
