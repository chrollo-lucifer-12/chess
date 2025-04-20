import {Coords} from "../types";
import {ChessPiece} from "./piece";

export class GameBoardCell {

    constructor(private color : "b" | "w", private coords : Coords, private piece : ChessPiece | null) {
    }

    getColor () {
        return this.color
    }

    getCoords () {
        return this.coords
    }

    getPiece () {
        return this.piece
    }

    setPiece (piece : ChessPiece | null) {
        this.piece = piece
    }
}