import {Game} from "./Game";
import {User} from "./user";
import {blue, red, bold} from "colorette"

export class GameManager {
    private games : Map<string, Game>
    private users : User[]
    private pendingUser : User | null

    constructor() {
        this.games = new Map<string, Game>()
        this.users = []
        this.pendingUser = null
    }

    async addUser (user : User) {
        console.log(blue("new user added"), bold(user.getUsername()))
        this.users.push(user)
        this.initHandler(user);
    }

    removeUser (user : User) {
        this.users = this.users.filter(user => user.getUsername()!==user.getUsername());
    }

    private initHandler (user : User) {
        user.getSocket().addEventListener("message", (e) => {
            const message = JSON.parse(e.data.toString())
            const gameId = message.gameId
            switch (message.type) {
                case "join_game" : {

                    if (this.pendingUser) {
                        console.log(red("starting new game") + bold(user.getUsername() + " " + "vs" + " " + this.pendingUser.getUsername()));
                        const game = new Game(this.pendingUser, user, 10,10)
                        if (!this.games.get(gameId)) {
                            game.setUpBoard(message.previousMoves);
                            this.games.set(gameId,game)
                        }
                    }
                    else {
                        this.pendingUser = user
                    }
                }
                case "make_move" : {
                    for (let [k,v] of this.games) {
                        if (k===gameId) {
                            v.makeMove(user, message.move);
                            break;
                        }
                    }
                }
            }
        })
    }
}