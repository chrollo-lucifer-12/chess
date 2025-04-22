import {Coords} from "../types";

export interface Movable {
    isValidMove (from : Coords, to : Coords) : boolean
}

// pawn, rook, knight, bishop, queen, king

export class PawnMovable implements Movable {
    isValidMove(from: Coords, to: Coords): boolean {
        return from.x + 1 == to.x
    }
}

export class RookMovable implements Movable {
    isValidMove(from: Coords, to: Coords): boolean {
        return from.x == to.x || from.y == to.y && to.x>=0 && to.x<=7
    }
}

export class KnightMovable implements Movable {
    isValidMove(from: Coords, to: Coords): boolean {
        let dx = Math.abs(from.x - to.x), dy = Math.abs(from.y - to.y);
        return ((dx==2 && dy==1) || (dx==1 || dy==2)) && to.x>=0 && to.x<=7
    }
}

export class BishopMovable implements Movable {
    isValidMove(from: Coords, to: Coords): boolean {
        const dx = Math.abs(from.x - to.x);
        const dy = Math.abs(from.y - to.y);
        return dx === dy && to.x>=0 && to.x<=7;
    }
}

export class QueenMovable implements Movable {
    isValidMove(from: Coords, to: Coords): boolean {
        let dx = from.x - to.x, dy = from.y = to.y
        return ((dx<0 && dy>0 && dx+dy==0) || (dy<0 && dx>0 && dx+dy==0) || (from.x==to.x) || (from.y==to.y)) && to.x>=0 && to.x<=7
    }
}

export class KingMovable implements Movable {
    isValidMove(from: Coords, to: Coords): boolean {
        const dx = Math.abs(from.x - to.x);
        const dy = Math.abs(from.y - to.y);
        return dx <= 1 && dy <= 1 && (dx + dy !== 0) && to.x>=0 && to.x<=7;
    }
}

