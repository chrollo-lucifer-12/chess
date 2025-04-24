import {Bishop, ChessPiece, King, Knight, Pawn, Queen, Rook} from "./piece";
import {GameBoardCell} from "./gameboarcell";
import {Coords} from "../types";

export class Gameboard {

    private grid: GameBoardCell[] = [];
    private currentTurn: "b" | "w"
    private previousMoves: { from: Coords, to: Coords, piece: ChessPiece }[] = []

    constructor() {
        this.setUpBoard();
        this.printBoard()
        this.previousMoves = []
        this.currentTurn = "w"
    }

    destroy() {
        this.grid = [];
        this.currentTurn = "w"
        this.previousMoves = []
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

                this.grid.push(new GameBoardCell(color, {x, y}, piece));

            }
        }
        for (let x = 2; x <= 5; x++) {
            for (let y = 0; y < 8; y++) {
                const isBlackCell = (x + y) % 2 === 1;
                const color = isBlackCell ? "b" : "w";
                this.grid.push(new GameBoardCell(color, {x, y}, null))
            }
        }
    }

    setUpBoardManually(previousMoves: { from: Coords; to: Coords; piece: ChessPiece }[]) {
        // Clear the board
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                this.getCell({x: row, y: col}).setPiece(null);
            }
        }

        // Place all moved pieces based on final positions
        previousMoves.forEach(({to, piece}) => {
            const toCell = this.getCell(to);
            toCell.setPiece(piece);
        });

        // Save the history
        this.previousMoves = previousMoves;

        // Optionally set turn based on move history
        this.currentTurn = previousMoves.length % 2 === 0 ? "w" : "b";
    }

    getCell(coords: Coords) {
        let result;
        for (let cell of this.grid) {
            const cellCoords = cell.getCoords()
            if (cellCoords.x === coords.x && cellCoords.y === coords.y) {
                result = cell;
                break
            }
        }
        return result!
    }

    getCurrentTurn() {
        return this.currentTurn;
    }

    printBoard() {
        for (let x = 0; x < 8; x++) {
            let rowStr = "";
            for (let y = 0; y < 8; y++) {
                const cell = this.getCell({x, y});
                const symbol = cell!.getPiece()?.symbol || "--";
                rowStr += symbol + " ";
            }
            console.log(rowStr.trim());
        }
    }

    isCheck(color: "b" | "w") {
        let kingCell: GameBoardCell;
        let oppositeColor = color === "b" ? "w" : "b"
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                if (this.getCell({x, y})?.getPiece()?.symbol === `${color}k`) {
                    kingCell = this.getCell({x, y})!;
                }
            }
        }
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const cell = this.getCell({x, y});

                const piece = cell!.getPiece();
                if (!piece || piece.color === color) continue;

                const {x: cx, y: cy} = cell!.getCoords();
                const {x: kx, y: ky} = kingCell!.getCoords();

                switch (piece.symbol) {
                    case `${oppositeColor}p`: {
                        const dx = oppositeColor === "b" ? 1 : -1;
                        if ((cx + dx === kx) && (cy + 1 === ky || cy - 1 === ky)) {

                            return true;
                        }
                        break;
                    }

                    case `${oppositeColor}r`: {
                        if (cx === kx || cy === ky) {
                            let stepX = 0, stepY = 0;
                            if (cx === kx) stepY = cy < ky ? 1 : -1;
                            if (cy === ky) stepX = cx < kx ? 1 : -1;

                            let xCheck = cx + stepX, yCheck = cy + stepY;
                            while (xCheck !== kx || yCheck !== ky) {
                                if (this.getCell({ x: xCheck, y: yCheck })?.getPiece()) {
                                    return false; // Obstruction found
                                }
                                xCheck += stepX;
                                yCheck += stepY;
                            }
                            return true;
                        }
                        break;
                    }

                    case `${oppositeColor}b`: {
                        if (Math.abs(cx - kx) === Math.abs(cy - ky)) {
                            let stepX = cx < kx ? 1 : -1;
                            let stepY = cy < ky ? 1 : -1;

                            let xCheck = cx + stepX, yCheck = cy + stepY;
                            while (xCheck !== kx || yCheck !== ky) {
                                if (this.getCell({ x: xCheck, y: yCheck })?.getPiece()) {
                                    return false; // Obstruction found
                                }
                                xCheck += stepX;
                                yCheck += stepY;
                            }
                            return true;
                        }
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
                        )  {
                            let stepX = 0, stepY = 0;
                            if (cx === kx) stepY = cy < ky ? 1 : -1;
                            if (cy === ky) stepX = cx < kx ? 1 : -1;
                            if (Math.abs(cx - kx) === Math.abs(cy - ky)) {
                                stepX = cx < kx ? 1 : -1;
                                stepY = cy < ky ? 1 : -1;
                            }

                            let xCheck = cx + stepX, yCheck = cy + stepY;
                            while (xCheck !== kx || yCheck !== ky) {
                                if (this.getCell({ x: xCheck, y: yCheck })?.getPiece()) {
                                    return false; // Obstruction found
                                }
                                xCheck += stepX;
                                yCheck += stepY;
                            }
                            return true;
                        }
                        break;
                    }
                }
            }
        }
        return false;
    }

    isCheckMate() {
        const color = this.currentTurn;
        if (!this.isCheck(color)) return false;

        const directions = [
            [1, 1], [1, 0], [1, -1],
            [-1, 0], [-1, -1], [-1, 1],
            [0, 1], [0, -1]
        ];

        let kingCell: GameBoardCell | undefined;
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const piece = this.getCell({x, y})?.getPiece();
                if (piece?.symbol === `${color}k`) {
                    kingCell = this.getCell({x, y});
                    break;
                }
            }
        }

        if (!kingCell) return false;
        const kCoords = kingCell.getCoords();
        const kPiece = kingCell.getPiece();

        for (let [dx, dy] of directions) {
            const xx = kCoords.x + dx;
            const yy = kCoords.y + dy;

            if (xx < 0 || xx >= 8 || yy < 0 || yy >= 8) continue;

            const newCell = this.getCell({x: xx, y: yy});
            const targetPiece = newCell?.getPiece();

            if (
                kPiece?.canMove(kCoords, {x: xx, y: yy}) &&
                (!targetPiece || targetPiece.color !== color)
            ) {
                // simulate move
                kingCell.setPiece(null);
                newCell.setPiece(new King(color, `${color}k`));

                const stillInCheck = this.isCheck(color);

                // revert move
                newCell.setPiece(targetPiece);
                kingCell.setPiece(kPiece);

                if (!stillInCheck) return false;
            }
        }

        // Try moving other pieces
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const fromCell = this.getCell({x, y});
                const piece = fromCell?.getPiece();
                if (!piece || piece.color !== color) continue;

                const possibleMoves = piece.giveDirections({x, y});
                for (let coords of possibleMoves) {
                    const toCell = this.getCell(coords);
                    if (!toCell) continue;
                    const target = toCell.getPiece();
                    if (target && target.color === color) continue;
                    if (!piece.canMove({x, y}, coords)) continue;
                    fromCell.setPiece(null);
                    toCell.setPiece(piece);
                    const stillInCheck = this.isCheck(color);
                    toCell.setPiece(target);
                    fromCell.setPiece(piece);

                    if (!stillInCheck) return false;
                }
            }
        }

        return true; // no valid moves => checkmate
    }


    checkKingSideCastling (fromCell : GameBoardCell , toCell: GameBoardCell, piece: ChessPiece, targetPiece : ChessPiece) {
    //    console.log("king castle");
        let newCell1, newCell2;
        let x = 7;
        if (this.currentTurn === "b") x = 0;
        newCell1 = this.getCell({x, y: 5});
        newCell2 = this.getCell({x, y: 6});
        if (newCell1.getPiece() !== null || newCell2.getPiece()!== null) {
            console.log("something betwwen king and rook")
            return false;
        }
        fromCell.setPiece(null);
        toCell.setPiece(null);
        newCell1.setPiece(targetPiece);
        newCell2.setPiece(piece);
        if (this.isCheck(this.currentTurn)) {
            newCell1.setPiece(null);
            newCell2.setPiece(null);
            fromCell.setPiece(piece);
            toCell.setPiece(targetPiece);
           console.log("king will be in check")
            return false;
        }
        return true;
    }

    checkQueenSideCastling (fromCell : GameBoardCell , toCell: GameBoardCell, piece: ChessPiece, targetPiece : ChessPiece) {
        let newCell1, newCell2, newCell3;
        let x = 7;
        if (this.currentTurn === "b") x = 0;
        newCell1 = this.getCell({x, y: 1}), newCell2 = this.getCell({x, y: 2}),
            newCell3 = this.getCell({x, y: 3})
        if (newCell1.getPiece() !== null || newCell2.getPiece() !== null || newCell3.getPiece() !== null) return false;
        fromCell.setPiece(null);
        toCell.setPiece(null);
        newCell3.setPiece(targetPiece);
        newCell2.setPiece(piece);
        if (this.isCheck(this.currentTurn)) {
            newCell1.setPiece(null);
            newCell2.setPiece(null);
            newCell3.setPiece(null);
            fromCell.setPiece(targetPiece);
            toCell.setPiece(piece);
            return false;
        }
        return true;
    }

    checkObstruction(fromCell: GameBoardCell, toCell: GameBoardCell): boolean {
        const fromCoords = fromCell.getCoords();
        const toCoords = toCell.getCoords();
        const piece = fromCell.getPiece();

        if (!piece) return false;


        switch (piece.symbol[1]) {
            case "r": {
                if (fromCoords.x === toCoords.x) {

                    const step = fromCoords.y < toCoords.y ? 1 : -1;
                    for (let y = fromCoords.y + step; y !== toCoords.y; y += step) {
                        if (this.getCell({ x: fromCoords.x, y })?.getPiece()) {
                            return true;
                        }
                    }
                } else if (fromCoords.y === toCoords.y) {

                    const step = fromCoords.x < toCoords.x ? 1 : -1;
                    for (let x = fromCoords.x + step; x !== toCoords.x; x += step) {
                        if (this.getCell({ x, y: fromCoords.y })?.getPiece()) {
                            return true; // Obstruction found
                        }
                    }
                }
                break;
            }

            case "b": {
                const dx = Math.abs(fromCoords.x - toCoords.x);
                const dy = Math.abs(fromCoords.y - toCoords.y);
                if (dx === dy) { // Diagonal movement
                    const stepX = fromCoords.x < toCoords.x ? 1 : -1;
                    const stepY = fromCoords.y < toCoords.y ? 1 : -1;

                    let x = fromCoords.x + stepX;
                    let y = fromCoords.y + stepY;
                    while (x !== toCoords.x && y !== toCoords.y) {
                        if (this.getCell({ x, y })?.getPiece()) {
                            return true; // Obstruction found
                        }
                        x += stepX;
                        y += stepY;
                    }
                }
                break;
            }

            case "q": {
                if (fromCoords.x === toCoords.x) {
                    const step = fromCoords.y < toCoords.y ? 1 : -1;
                    for (let y = fromCoords.y + step; y !== toCoords.y; y += step) {
                        if (this.getCell({ x: fromCoords.x, y })?.getPiece()) {
                            return true; // Obstruction found
                        }
                    }
                } else if (fromCoords.y === toCoords.y) {
                    const step = fromCoords.x < toCoords.x ? 1 : -1;
                    for (let x = fromCoords.x + step; x !== toCoords.x; x += step) {
                        if (this.getCell({ x, y: fromCoords.y })?.getPiece()) {
                            return true; // Obstruction found
                        }
                    }
                }

                // Check for diagonal (like bishop)
                const dx = Math.abs(fromCoords.x - toCoords.x);
                const dy = Math.abs(fromCoords.y - toCoords.y);
                if (dx === dy) {
                    const stepX = fromCoords.x < toCoords.x ? 1 : -1;
                    const stepY = fromCoords.y < toCoords.y ? 1 : -1;

                    let x = fromCoords.x + stepX;
                    let y = fromCoords.y + stepY;
                    while (x !== toCoords.x && y !== toCoords.y) {
                        if (this.getCell({ x, y })?.getPiece()) {
                            return true; // Obstruction found
                        }
                        x += stepX;
                        y += stepY;
                    }
                }
                break;
            }

            case "k": {
                // King moves one square at a time, no obstructions to check
                return false;
            }

            default:
                return false;
        }

        return false; // No obstruction found
    }


    checkIfMoved (piece : ChessPiece | null) {
        if (!piece) return true;
        for (let move of this.previousMoves) {
            if (move.piece === piece) {
                return true;
            }
        }
        return false;
    }


    move(from: Coords, to: Coords) {
        const fromCell = this.getCell(from);
        const toCell = this.getCell(to);
        const piece = fromCell.getPiece();
        const targetPiece = toCell.getPiece();


        //     console.log(piece);

        if (!piece) return false;

        if (piece.symbol === `${this.currentTurn}k` && Math.abs(from.y - to.y)==2) {
            if (this.checkIfMoved(piece)) { console.log("already moved");  return false;}
            if (this.isCheck(this.currentTurn)) { console.log("king is in check"); return false;}
            let res;
            if (this.currentTurn === "w" && from.x === 7 && to.x === 7) {
                if (to.y === 6) { // king-side
                    const rookCell = this.getCell({ x: 7, y: 7 });
                    if (this.checkIfMoved(rookCell.getPiece())) return false;
                    res = this.checkKingSideCastling(fromCell, rookCell, piece, rookCell.getPiece()!);
                } else if (to.y === 2) { // queen-side
                    const rookCell = this.getCell({ x: 7, y: 0 });
                    if (this.checkIfMoved(rookCell.getPiece())) return false;
                    res = this.checkQueenSideCastling(fromCell, rookCell, piece, rookCell.getPiece()!);
                }
            } else if (this.currentTurn === "b" && from.x === 0 && to.x === 0) {
                if (to.y === 6) { // king-side
                    const rookCell = this.getCell({ x: 0, y: 7 });
                    if (this.checkIfMoved(rookCell.getPiece())) return false;
                    res = this.checkKingSideCastling(fromCell, rookCell, piece, rookCell.getPiece()!);
                } else if (to.y === 2) { // queen-side
                    const rookCell = this.getCell({ x: 0, y: 0 });
                    if (this.checkIfMoved(rookCell.getPiece())) return false;
                    res = this.checkQueenSideCastling(fromCell, rookCell, piece, rookCell.getPiece()!);
                }
            }
            if (res) {
                this.previousMoves.push({from, to, piece})
                this.currentTurn = this.currentTurn === "w" ? "b" : "w";
                return true;
            }
            else {
                console.log("hattt")
                return false;
            }
        }

        if (piece.symbol[1] === "p") {
            if (this.currentTurn === "w") {
                if (from.x - 2 === to.x && from.y === to.y && !targetPiece && fromCell.getCoords().x === 6) {
                    if (targetPiece!==null) return false;
                    fromCell.setPiece(null);
                    toCell.setPiece(piece);
                    if (this.isCheck(this.currentTurn)) {
                        toCell.setPiece(null);
                        fromCell.setPiece(piece)
                        return false
                    }
                    this.previousMoves.push({from, to, piece})
                    this.currentTurn = "b"
                    return true;
                }
                if (from.x - 1 === to.x && from.y === to.y && !targetPiece) {
                    if (targetPiece!==null) return false;
                    fromCell.setPiece(null);
                    toCell.setPiece(piece);
                    if (this.isCheck(this.currentTurn)) {
                        toCell.setPiece(null);
                        fromCell.setPiece(piece)
                        return false
                    }
                    this.previousMoves.push({from, to, piece})
                    this.currentTurn = "b"
                    return true;
                }
                if (from.x - 1 === to.x && (from.y - 1 === to.y || from.y + 1 === to.y) && targetPiece) {
                //    if (targetPiece!==null) return false;
                    this.previousMoves.push({from, to, piece})
                    fromCell.setPiece(null);
                    toCell.setPiece(piece);
                    this.currentTurn = "b"
                    return true;
                }
                if (from.x-1===to.x && from.y===to.y && to.x === 0) {
                    if (targetPiece!==null) return false;
                    fromCell.setPiece(null);
                    toCell.setPiece(new Queen(this.currentTurn, `${this.currentTurn}q`));
                    if (this.isCheck(this.currentTurn)) {
                        toCell.setPiece(null);
                        fromCell.setPiece(piece)
                        return false
                    }
                    this.previousMoves.push({from, to, piece})
                    this.currentTurn = "b"
                    return true;
                }
            } else if (this.currentTurn === "b") {
                if (from.x + 2 === to.x && from.y === to.y && !targetPiece && fromCell.getCoords().x === 1) {
                    fromCell.setPiece(null);
                    toCell.setPiece(piece);
                    this.previousMoves.push({from, to, piece})
                    this.currentTurn = "w"
                    return true;
                }
                if (from.x + 1 === to.x && from.y === to.y && !targetPiece) {
                    fromCell.setPiece(null);
                    toCell.setPiece(piece);
                    this.previousMoves.push({from, to, piece})
                    this.currentTurn = "w"
                    return true;
                }
                if (from.x + 1 === to.x && (from.y + 1 === to.y || from.y - 1 === to.y) && targetPiece) {
                    this.previousMoves.push({from, to, piece})
                    fromCell.setPiece(null);
                    toCell.setPiece(piece);
                    this.currentTurn = "w"
                    return true;
                }
            }
        //    console.log("wrong move")
            return false;
        }

        const validPositions = piece.giveDirections(from);
     //   console.log(validPositions);

        const isValid = validPositions.some(pos => pos.x === to.x && pos.y === to.y);
        if (!isValid) {
         //   console.log("obstruction for", piece.symbol)
            return false;
        }

        if (targetPiece?.color === piece.color) return false;

    // if (this.checkObstruction(fromCell,toCell)) {
    //     return false;
    // }


        fromCell.setPiece(null);
        toCell.setPiece(piece);

        const isKingInCheck = this.isCheck(this.currentTurn);

        if (isKingInCheck) {
            toCell.setPiece(targetPiece);
            fromCell.setPiece(piece);
            return false;
        }
        if (this.currentTurn === "b") this.currentTurn = "w";
        else this.currentTurn = "b";
        this.previousMoves.push({from, to, piece})
        return true;
    }
}