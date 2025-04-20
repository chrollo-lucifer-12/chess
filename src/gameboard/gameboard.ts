import {Bishop, ChessPiece, King, Knight, Pawn, Queen, Rook} from "./piece";
import {GameBoardCell} from "./gameboarcell";
import {Coords} from "../types";

export class Gameboard {

    private grid : GameBoardCell[] = [];

    constructor() {
        this.setUpBoard();
        this.printBoard()
    }

    setUpBoard () {

        for (let j=0; j<8; j++) {
            const isBlackCell = (1 + j)%2 === 0;
            const color = isBlackCell ? "b" : "w";
            const gameBoardCell = new GameBoardCell(color, {x : 1, y : j}, new Pawn("w", "wp"))
            this.grid.push(gameBoardCell)
        }

        for (let j=0; j<8; j++) {
            const isBlackCell = (1 + j)%2 === 1;
            const color = isBlackCell ? "b" : "w";
            const gameBoardCell = new GameBoardCell(color, {x : 6, y : j}, new Pawn("b", "bp"))
            this.grid.push(gameBoardCell)
        }

        this.grid.push(new GameBoardCell("b", { x: 0, y: 0 }, new Rook("w", "wr")));
        this.grid.push(new GameBoardCell("w", { x: 0, y: 1 }, new Knight("w", "wn")));
        this.grid.push(new GameBoardCell("b", { x: 0, y: 2 }, new Bishop("w", "wb")));
        this.grid.push(new GameBoardCell("w", { x: 0, y: 3 }, new Queen("w", "wq")));
        this.grid.push(new GameBoardCell("b", { x: 0, y: 4 }, new King("w", "wk")));
        this.grid.push(new GameBoardCell("w", { x: 0, y: 5 }, new Bishop("w", "wb")));
        this.grid.push(new GameBoardCell("b", { x: 0, y: 6 }, new Knight("w", "wn")));
        this.grid.push(new GameBoardCell("w", { x: 0, y: 7 }, new Rook("w", "wr")));

        this.grid.push(new GameBoardCell("w", { x: 7, y: 0 }, new Rook("b", "br")));
        this.grid.push(new GameBoardCell("b", { x: 7, y: 1 }, new Knight("b", "bn")));
        this.grid.push(new GameBoardCell("w", { x: 7, y: 2 }, new Bishop("b", "bb")));
        this.grid.push(new GameBoardCell("b", { x: 7, y: 3 }, new Queen("b", "bq")));
        this.grid.push(new GameBoardCell("w", { x: 7, y: 4 }, new King("b", "bk")));
        this.grid.push(new GameBoardCell("b", { x: 7, y: 5 }, new Bishop("b", "bb")));
        this.grid.push(new GameBoardCell("w", { x: 7, y: 6 }, new Knight("b", "bn")));
        this.grid.push(new GameBoardCell("b", { x: 7, y: 7 }, new Rook("b", "br")));
    }

    getPiece (coords : Coords) {
        for (let cell of this.grid) {
            const cellCoords = cell.getCoords()
            if (cellCoords.x === coords.x && cellCoords.y === coords.y) {
                return cell;
            }
        }
        return null;
    }

    printBoard() {
        for (let x = 0; x < 8; x++) {
            let rowStr = "";
            for (let y = 0; y < 8; y++) {
                const cell = this.getPiece({ x, y });
                const symbol = cell?.getPiece()?.symbol || "--";
                rowStr += symbol + " ";
            }
            console.log(rowStr.trim());
        }
    }

}