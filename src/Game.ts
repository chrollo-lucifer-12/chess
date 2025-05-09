import {User} from "./user";
import {Gameboard} from "./gameboard/gameboard"
import {Coords} from "./types";
import dotenv from "dotenv"
dotenv.config();

export class Game {
    private player1: User | null
    private player2: User | null
    private player1Time: number
    private player2Time: number
    public observers : User[]
    private gameBoard: Gameboard

    constructor(player1: User, player2: User, player1Time: number, player2Time: number) {
        this.observers = []
        this.player1 = player1
        this.player2 = player2
        this.player1Time = player1Time
        this.player2Time = player2Time
        this.gameBoard = new Gameboard()
        this.player1.setColor("w");
        this.player2.setColor("b");
        this.player1.sendMessage(JSON.stringify({
            type : "init_game",
            payload : {
                color : "w",
                opponent : this.player2.getUsername()
            }
        }))
        this.player2.sendMessage(JSON.stringify({
            type : "init_game",
            payload : {
                color : "b",
                opponent : this.player1.getUsername()
            }
        }))
    }

    getGameBoard () {
        return this.gameBoard;
    }

    addObserver (user : User) {
        this.observers.push(user);
    }

    setPlayer1(user : User | null) {
        if (user) {
            console.log(user.getUsername() + "reconnected")
            this.player1 = user
            this.player1.setColor("w");
        }
        else {
            this.player1 = null
        }
    }

    setPlayer2 (user : User | null) {
        if (user) {
            console.log(user.getUsername() + "reconnected")
            this.player2 = user
            this.player2.setColor("b");
        }
        else {
            this.player2 = null
        }
    }

    getPlayer1 () {
        return this.player1
    }

    getPlayer2() {
        return this.player2
    }

    async makeMove(player: User, move: { from: Coords, to: Coords }, gameId : string) {
        if (this.gameBoard.getCurrentTurn() !== player.getColor()) {
            return;
        }
        const {success, capturedPiece, piece, isCastling} = this.gameBoard.move(move.from, move.to);
        if (this.gameBoard.isCheckMate()) {
            const winner = this.gameBoard.getCurrentTurn() === "w" ? "b" : "w"
            this.sendDefeat(winner)
            return;
        }
        if (this.gameBoard.isStalemate()) {
            this.sendStalemate()
            return;
        }
        if (!success) return;
        this.gameBoard.printBoard();
        this.sendMove(move, capturedPiece, piece!, isCastling)
        // await axios.post(`${process.env.NEXT_BACKEND_URL}/move/add`, {
        //     gameId,
        //     username : player.getUsername(),
        //   from :  move.from,
        //     to :move.to
        // })
    }

    coordsToAlgebraic(x: number, y: number ): string {
        const file = String.fromCharCode(97 + x);
        const rank = 8 - y;
        return `${file}${rank}`;
    }

    sendMove(move: { from: Coords, to: Coords }, capturedPiece : string | null | undefined, piece : string, isCastling : boolean | undefined) {
        const toSquare = this.coordsToAlgebraic(move.to.x, move.to.y);
        const pieceLetter = piece.toUpperCase() === 'P' ? '' : piece.toUpperCase();
        const captureMarker = capturedPiece ? 'x' : '';
        let finalMove;
        if (piece.toUpperCase() === 'P' && capturedPiece) {
            const fromFile = this.coordsToAlgebraic(move.from.x, move.from.y)[0];
            finalMove = `${fromFile}x${toSquare}`;
        }
        else finalMove = `${pieceLetter}${captureMarker}${toSquare}`;
        this.player1?.sendMessage(JSON.stringify({
            type: "move_made",
            payload: {
                board : this.gameBoard.getBoard(),
                capturedPiece,
                move : finalMove,
                currentTurn : this.gameBoard.getCurrentTurn()
            }
        }))
        this.player2?.sendMessage(JSON.stringify({
            type: "move_made",
            payload: {
                board : this.gameBoard.getBoard(),
                capturedPiece,
                move : finalMove,
                currentTurn : this.gameBoard.getCurrentTurn()
            }
        }))
        this.notifyObservers()
    }

    notifyObservers () {
        this.observers.map((observer) => {
            observer.sendMessage(JSON.stringify({
                type : "update",
                board : this.gameBoard.getBoard(),
            }))
        })
    }

    sendStalemate() {
        this.player1?.sendMessage(JSON.stringify({
            type: "stalemate",
        }))
        this.player2?.sendMessage(JSON.stringify({
            type: "stalemate",
        }))
        this.observers.map((observer) => {
            observer.sendMessage(JSON.stringify({
                type : "observer_game_over",
                result : "stalemate"
            }))
        })
        this.gameBoard.destroy();
    }

    sendDefeat(winner : string) {
        this.player1?.sendMessage(JSON.stringify({
            type : "game_over",
            payload : {
                winner
            }
        }))
        this.player2?.sendMessage(JSON.stringify({
            type : "game_over",
            payload : {
                winner
            }
        }))
        this.observers.map((observer) => {
            observer.sendMessage(JSON.stringify({
                type : "observer_game_over",
                winner
            }))
        })
        this.gameBoard.destroy();
    }

    sendResign (loser : string) {
        this.player1?.sendMessage(JSON.stringify({
            type : "resign",
            payload : {
                loser
            }
        }))
        this.player2?.sendMessage(JSON.stringify({
            type : "resign",
            payload : {
                loser
            }
        }))
        this.observers.map((observer) => {
            observer.sendMessage(JSON.stringify({
                type : "observer_game_over",
                result : "resign",
                loser
            }))
        })
        this.gameBoard.destroy();
    }

    offerDraw (user : User) {
        if (user.getUsername() === this.player1?.getUsername()) {
            this.player2?.sendMessage(JSON.stringify({
                type : "draw_offered",
                payload : {
                    username : this.player1.getUsername()
                }
            }))
        }
        else {
            this.player1?.sendMessage(JSON.stringify({
                type : "draw_offered",
                payload : {
                    username : this.player2?.getUsername()
                }
            }))
        }
    }

    sendDraw () {
        this.player1?.sendMessage(JSON.stringify({
            type : "draw"
        }))
        this.player2?.sendMessage(JSON.stringify({
            type : "draw"
        }))
        this.observers.map((observer) => {
            observer.sendMessage(JSON.stringify({
                type : "observer_game_over",
                result : "draw"
            }))
        })
        this.gameBoard.destroy()
    }

    sendMessage (payload : {username : string, message : string}) {
        this.player1?.sendMessage(JSON.stringify({
            type : "message_delivered",
            payload
        }))
        this.player2?.sendMessage(JSON.stringify({
            type : "message_delivered",
            payload
        }))
    }
}