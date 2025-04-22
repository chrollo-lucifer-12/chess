import {BishopMovable, KingMovable, KnightMovable, Movable, PawnMovable, QueenMovable, RookMovable} from "./move";
import {Coords} from "../types";


export class ChessPiece {
    constructor(public color : "b" | "w", public symbol : string, private strategy : Movable) {
    }
    canMove (from : Coords, to : Coords) : boolean {
        return this.strategy.isValidMove(from,to)
    }
    giveDirections(currentCoords : Coords) {
        return this.strategy.giveValidCoords(currentCoords, this.color)
    }
    getColor () {
        return this.color
    }
    getSymbol () {
        return this.symbol
    }
}

export class Pawn extends ChessPiece {
    constructor(color : "b" | "w", symbol : string) {
        super(color, symbol, new PawnMovable())
    }
}

export class Rook extends ChessPiece {
    constructor(color : "b" | "w", symbol : string) {
        super(color, symbol, new RookMovable());
    }
}

export class Knight extends ChessPiece {
    constructor(color : "b" | "w", symbol : string) {
        super(color, symbol, new KingMovable());
    }
}

export class Bishop extends ChessPiece {
    constructor(color : "b" | "w", symbol : string) {
        super(color, symbol, new BishopMovable());
    }
}

export class Queen extends ChessPiece {
    constructor(color : "b" | "w", symbol : string) {
        super(color, symbol, new QueenMovable());
    }
}

export class King extends ChessPiece{
    constructor(color : "b" | "w", symbol : string) {
        super(color, symbol, new KingMovable());
    }
}


