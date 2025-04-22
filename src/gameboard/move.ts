import {Coords} from "../types";

export interface Movable {
    isValidMove (from : Coords, to : Coords, color? : string) : boolean
    giveValidCoords (currentCoords : Coords, color ?: string) : {x : number, y : number}[]
}

// pawn, rook, knight, bishop, queen, king

export class PawnMovable implements Movable {
    isValidMove(from: Coords, to: Coords, color : string): boolean {
        return to.x >=0 && to.x<8 && to.y>=0 && to.y<8 && ((from.x + 1 == to.x && color==="w") || (from.x - 1 == to.x && color==="b"))
    }
    giveValidCoords(currentCoords: Coords, color : string): { x: number; y: number }[] {
        if (color === "b" && currentCoords.x + 1<8) return [{x : currentCoords.x + 1, y : currentCoords.y}]
        if (color === "w" && currentCoords.x - 1>=0) return [{x : currentCoords.x-1, y : currentCoords.y}]
        return []
    }
}

export class RookMovable implements Movable {
    isValidMove(from: Coords, to: Coords): boolean {
        return from.x == to.x || from.y == to.y && to.x>=0 && to.x<=7
    }
    giveValidCoords (currentCoords : Coords) {
        let res : {x : number, y: number}[] = [];
        for (let y=0; y<8; y++) {
            res.push({x : currentCoords.x, y})
        }
        for (let x =0; x<8; x++) {
            res.push({x,y : currentCoords.y})
        }
        return res;
    }
}

export class KnightMovable implements Movable {
    isValidMove(from: Coords, to: Coords): boolean {
        let dx = Math.abs(from.x - to.x), dy = Math.abs(from.y - to.y);
        return ((dx==2 && dy==1) || (dx==1 || dy==2)) && to.x>=0 && to.x<=7
    }
    giveValidCoords(currentCoords: Coords): { x: number; y: number }[] {
        let res : {x : number, y: number}[] = [];
        let dx = [1,-1]
        let dy = [2,-2];
        for (let x1 of dx) {
            for (let x2 of dy) {
                let xx = currentCoords.x + x1, yy = currentCoords.y + x2;
                if (xx>=0 && xx<8 && yy>=0 && yy<8) {
                    res.push({x : xx, y : yy})
                }
            }
        }
        return res;
    }
}

export class BishopMovable implements Movable {
    isValidMove(from: Coords, to: Coords): boolean {
        const dx = Math.abs(from.x - to.x);
        const dy = Math.abs(from.y - to.y);
        return dx === dy && to.x>=0 && to.x<=7;
    }
    giveValidCoords(currentCoords: Coords): { x: number; y: number }[] {
        let res : {x : number, y: number}[] = [];
        for (let x=-8; x<=8; x++) {
            if (currentCoords.x + x >=0 && currentCoords.y + x >= 0 && currentCoords.x+x<8 && currentCoords.y+x<8) {
                res.push({x : currentCoords.x+x, y : currentCoords.y+x})
            }
        }
        return res;
    }
}

export class QueenMovable implements Movable {
    isValidMove(from: Coords, to: Coords): boolean {
        let dx = from.x - to.x, dy = from.y = to.y
        return ((dx<0 && dy>0 && dx+dy==0) || (dy<0 && dx>0 && dx+dy==0) || (from.x==to.x) || (from.y==to.y)) && to.x>=0 && to.x<=7
    }
    giveValidCoords(currentCoords: Coords): { x: number; y: number }[] {
        let res : {x : number, y: number}[] = [];
        for (let x=-8; x<=8; x++) {
            if (currentCoords.x + x >=0 && currentCoords.y + x >= 0 && currentCoords.x+x<8 && currentCoords.y+x<8) {
                res.push({x : currentCoords.x+x, y : currentCoords.y+x})
            }
        }
        for (let y=0; y<8; y++) {
            res.push({x : currentCoords.x, y})
        }
        for (let x =0; x<8; x++) {
            res.push({x,y : currentCoords.y})
        }
        return res;
    }
}

export class KingMovable implements Movable {
    isValidMove(from: Coords, to: Coords): boolean {
        const dx = Math.abs(from.x - to.x);
        const dy = Math.abs(from.y - to.y);
        return dx <= 1 && dy <= 1 && (dx + dy !== 0) && to.x>=0 && to.x<=7;
    }
    giveValidCoords(currentCoords: Coords): { x: number; y: number }[] {
        let res : {x : number, y: number}[] = [];
        let dx = [-1,1,0];
        for (let x1 of dx) {
            for (let x2 of dx) {
                if (x1==0 && x2==0) continue
                let xx = currentCoords.x + x1, yy = currentCoords.y + x2;
                if (xx>=0 && xx<8 && yy>=0 && yy<8) {
                    res.push({x : xx, y : yy})
                }
            }
        }
        return res;
    }
}

