import {User} from "./user";
import {Gameboard} from "./gameboard/gameboard"
import {Coords} from "./types";

export class Game {
    private player1: User
    private player2: User
    private player1Time: number
    private player2Time: number
    private gameBoard: Gameboard

    constructor(player1: User, player2: User, player1Time: number, player2Time: number) {
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
            }
        }))
        this.player2.sendMessage(JSON.stringify({
            type : "init_game",
            payload : {
                color : "b",
            }
        }))
        this.sendNames()
    }

    getPlayer1Username () {
        return this.player1.getUsername()
    }

    getPlayer2Username() {
        return this.player2.getUsername()
    }

    sendNames () {
        this.player1.sendMessage(JSON.stringify({
            type : "opponent",
            payload : {
                username : this.player2.getUsername()
            }
        }))
        this.player2.sendMessage(JSON.stringify({
            type : "opponent",
            payload : {
                username : this.player1.getUsername()
            }
        }))
    }

    makeMove(player: User, move: { from: Coords, to: Coords }) {
        if (this.gameBoard.getCurrentTurn() !== player.getColor()) {
            return;
        }
        const {success, capturedPiece} = this.gameBoard.move(move.from, move.to);
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
        this.sendMove(move, capturedPiece)
    }

    sendMove(move: { from: Coords, to: Coords }, capturedPiece : string | null | undefined) {
        this.player1.sendMessage(JSON.stringify({
            type: "move_made",
            payload: {
                move,
                currentTurn: this.gameBoard.getCurrentTurn(),
                capturedPiece
            }
        }))
        this.player2.sendMessage(JSON.stringify({
            type: "move_made",
            payload: {
                move,
                currentTurn: this.gameBoard.getCurrentTurn(),
                capturedPiece
            }
        }))
    }

    sendStalemate() {
        this.player1.sendMessage(JSON.stringify({
            type: "stalemate",
        }))
        this.player2.sendMessage(JSON.stringify({
            type: "stalemate",
        }))
        this.gameBoard.destroy();
    }

    sendDefeat(winner : string) {
        this.player1.sendMessage(JSON.stringify({
            type : "game_over",
            payload : {
                winner
            }
        }))
        this.player2.sendMessage(JSON.stringify({
            type : "game_over",
            payload : {
                winner
            }
        }))
        this.gameBoard.destroy();
    }
}