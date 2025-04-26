import {Game} from "./Game";
import {User} from "./user";

export class GameManager {
    private games : Game[]
    private users : User[]
    private pendingUser : User | null

    constructor() {
        this.games = []
        this.users = []
        this.pendingUser = null
    }

    addUser (user : User) {
        this.users.push(user)
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
                        const game = new Game(this.pendingUser, user, 10,10)
                        this.games.push(game);
                    }
                    else {
                        this.pendingUser = user
                    }
                }
                case "make_move" : {
                    const findGame = this.games.find(game => game.getPlayer1Username() === user.getUsername() || game.getPlayer2Username() === user.getUsername())
                }

            }
        })
    }
}