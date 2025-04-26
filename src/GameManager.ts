import {Game} from "./Game";
import {User} from "./user";
import {blue, red, bold} from "colorette"

export class GameManager {
    private games : Game[]
    private users : User[]
    private pendingUser : User | null

    constructor() {
        this.games = []
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
            switch (message.type) {
                case "join_game" : {
                    if (this.pendingUser) {
                        console.log(red("starting new game") + bold(user.getUsername() + "vs" + this.pendingUser.getUsername()));
                        const game = new Game(this.pendingUser, user, 10,10)
                        this.games.push(game);
                    }
                    else {
                        this.pendingUser = user
                    }
                }
                case "make_move" : {
                    const findGame = this.games.find(game => game.getPlayer1Username() === user.getUsername() || game.getPlayer2Username() === user.getUsername())
                    if (findGame) {
                        findGame.makeMove(user, message.move)
                    }
                }

            }
        })
    }
}