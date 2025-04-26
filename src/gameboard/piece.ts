import {BishopMovable, KingMovable, KnightMovable, Movable, PawnMovable, QueenMovable, RookMovable} from "./move";
import {Coords} from "../types";


export class ChessPiece {
    constructor(public color : "b" | "w", public symbol : string, private strategy : Movable, private id : string) {
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
    getId() {
        return this.id
    }
}

export class Pawn extends ChessPiece {
    constructor(color : "b" | "w", symbol : string, id?: string) {
        super(color, symbol, new PawnMovable(), id || crypto.randomUUID())
    }
}

export class Rook extends ChessPiece {
    constructor(color : "b" | "w", symbol : string, id ?: string) {
        super(color, symbol, new RookMovable(), id || crypto.randomUUID());
    }
}

export class Knight extends ChessPiece {
    constructor(color : "b" | "w", symbol : string, id ?: string) {
        super(color, symbol, new KnightMovable(), id || crypto.randomUUID());
    }
}

export class Bishop extends ChessPiece {
    constructor(color : "b" | "w", symbol : string, id?: string) {
        super(color, symbol, new BishopMovable(), id || crypto.randomUUID());
    }
}

export class Queen extends ChessPiece {
    constructor(color : "b" | "w", symbol : string, id?:string) {
        super(color, symbol, new QueenMovable(), id || crypto.randomUUID());
    }
}

export class King extends ChessPiece{
    constructor(color : "b" | "w", symbol : string, id?:string) {
        super(color, symbol, new KingMovable(), id || crypto.randomUUID());
    }
}


