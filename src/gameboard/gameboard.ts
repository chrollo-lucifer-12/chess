import {Bishop, ChessPiece, King, Knight, Pawn, Queen, Rook} from "./piece";
import {GameBoardCell} from "./gameboarcell";
import {Coords} from "../types";
import {KingMovable} from "./move";

export class Gameboard {

    private grid : GameBoardCell[] = [];
    private currentTurn : "b" | "w"

    constructor() {
        this.setUpBoard();
        this.printBoard()
        this.currentTurn = "w"
    }

    setUpBoard() {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const isBlackCell = (x + y) % 2 === 1;
                const color = isBlackCell ? "b" : "w";
                let piece: ChessPiece | null = null;

                if (x === 1) piece = new Pawn("b", "bp");
                if (x === 6) piece = new Pawn("w", "wp");

                if (x === 0) {
                    if (y === 0 || y === 7) piece = new Rook("b", "br");
                    if (y === 1 || y === 6) piece = new Knight("b", "bn");
                    if (y === 2 || y === 5) piece = new Bishop("b", "bb");
                    if (y === 3) piece = new Queen("b", "bq");
                    if (y === 4) piece = new King("b", "bk");
                }

                if (x === 7) {
                    if (y === 0 || y === 7) piece = new Rook("w", "wr");
                    if (y === 1 || y === 6) piece = new Knight("w", "wn");
                    if (y === 2 || y === 5) piece = new Bishop("w", "wb");
                    if (y === 3) piece = new Queen("w", "wq");
                    if (y === 4) piece = new King("w", "wk");
                }

                this.grid.push(new GameBoardCell(color, { x, y }, piece));

            }
        }
        for (let x=2; x<=5; x++) {
            for (let y=0; y<8; y++) {
                const isBlackCell = (x + y) % 2 === 1;
                const color = isBlackCell ? "b" : "w";
                this.grid.push(new GameBoardCell(color, {x,y}, null))
            }
        }
    }


    getCell (coords : Coords) {
        for (let cell of this.grid) {
            const cellCoords = cell.getCoords()
            if (cellCoords.x === coords.x && cellCoords.y === coords.y) {
                return cell;
            }
        }
    }

    printBoard() {
        for (let x = 0; x < 8; x++) {
            let rowStr = "";
            for (let y = 0; y < 8; y++) {
                const cell = this.getCell({ x, y });
                const symbol = cell!.getPiece()?.symbol || "--";
                rowStr += symbol + " ";
            }
            console.log(rowStr.trim());
        }
        for (let x = 0; x < 8; x++) {
            let rowStr = "";
            for (let y = 0; y < 8; y++) {
                const cell = this.getCell({ x, y });
                const symbol = cell!.getColor();
                rowStr += symbol + " ";
            }
            console.log(rowStr.trim());
        }
    }

    isCheck(color : "b" | "w") {
        let kingCell : GameBoardCell;
        let oppositeColor = color === "b" ? "w" : "b"
        for (let x=0; x<8; x++) {
            for (let y=0; y<8; y++) {
                if (this.getCell({x,y})?.getPiece()?.symbol === `${color}k`) {
                    kingCell = this.getCell({x,y})!;
                }
            }
        }
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const cell = this.getCell({ x, y });

                const piece = cell!.getPiece();
                if (!piece || piece.color === color) continue;

                const { x: cx, y: cy } = cell!.getCoords();
                const { x: kx, y: ky } = kingCell!.getCoords();

                switch (piece.symbol) {
                    case `${oppositeColor}p`: {
                        const dx = oppositeColor === "b" ? 1 : -1;
                        if ((cx + dx === kx) && (cy + 1 === ky || cy - 1 === ky)) {
                            return true;
                        }
                        break;
                    }

                    case `${oppositeColor}r`: {
                        if (cx === kx || cy === ky) return true;
                        break;
                    }

                    case `${oppositeColor}b`: {
                        if (Math.abs(cx - kx) === Math.abs(cy - ky)) return true;
                        break;
                    }

                    case `${oppositeColor}n`: {
                        const dx = Math.abs(cx - kx);
                        const dy = Math.abs(cy - ky);
                        if ((dx === 2 && dy === 1) || (dx === 1 && dy === 2)) return true;
                        break;
                    }

                    case `${oppositeColor}q`: {
                        if (
                            Math.abs(cx - kx) === Math.abs(cy - ky) ||
                            cx === kx ||
                            cy === ky
                        ) return true;
                        break;
                    }
                }
            }
        }
        return false;
    }

    isCheckMate() {
        const color = this.currentTurn === "b" ? "w" : "b";
        const directions = [[1,1], [1,0] , [1,-1], [-1,0], [-1,-1], [-1,1], [0,1],[0,-1]];
        let kingCell : GameBoardCell;
        for (let x=0; x<8; x++) {
            for (let y=0; y<8; y++) {
                if (this.getCell({x,y})?.getPiece()?.symbol === `${color}k`) {
                    kingCell = this.getCell({x,y})!;
                }
            }
        }
        let kCoords = kingCell!.getCoords();
        let kPiece = kingCell!.getPiece()
        for (let d of directions) {
            let xx = kCoords.x + d[0], yy = kCoords.y + d[1];
            let newCell = this.getCell({x : xx, y : yy})!
            if (kPiece?.canMove({x : kCoords.x, y : kCoords.y}, {x : xx, y : yy}) && newCell.getPiece() === null) {
                // move king to newCell
                kingCell!.setPiece(null);
                newCell.setPiece(new King(`${color}`, `${color}k`))
                if (!this.isCheck(color)) {
                    newCell.setPiece(null);
                    kingCell!.setPiece(new King(`${color}`, `${color}k`))
                    return false;
                }
                newCell.setPiece(null);
                kingCell!.setPiece(new King(`${color}`, `${color}k`))
            }
        }
        return true;
    }

    // move (from : Coords, to : Coords, pieceSymbol : string) {
    //     if (this.currentTurn !== pieceSymbol[0]) {
    //         console.log("invalid move")
    //         return;
    //     }
    //     let currentcell : GameBoardCell;
    //     for (let cell of this.grid) {
    //         if (cell.getCoords().x === from.x && cell.getCoords().y === from.y) {
    //             currentcell = cell;
    //             break
    //         }
    //     }
    //     if (currentcell.) {
    //         console.log("invalid move")
    //         return;
    //     }
    //
    // }
}