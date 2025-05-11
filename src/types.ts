export type Coords = {
    x : number,
    y : number
}

export enum moveType {
    NORMAL = "NORMAL",
    CASTLING_KINGSIDE = "CASTLING_KINGSIDE",
    CASTLING_QUEENSIDE = "CASTLING_QUEENSIDE",
    PROMOTION = "PROMOTION"
}