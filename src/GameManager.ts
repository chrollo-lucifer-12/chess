import {Game} from "./Game";
import {User} from "./user";
import {blue, red, bold} from "colorette"

export class GameManager {
    private readonly games : Map<string, Game>
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
           // const gameId = message.gameId
            switch (message.type) {
                case "join_game" : {
                    if (message.gameId) {
                      //  console.log(message.gameId);
                        const game = this.games.get(message.gameId);
                        if (game?.getPlayer1() === null) {
                            game.setPlayer1(user)
                            return
                        }
                        if (game?.getPlayer2() === null) {
                            game.setPlayer2(user);
                            return;
                        }
                        return;
                    }
                    if (this.pendingUser) {
                        console.log(red("starting new game") + bold(user.getUsername() + " " + "vs" + " " + this.pendingUser.getUsername()));
                        const game = new Game(this.pendingUser, user, 10,10)
                        const newGameId = crypto.randomUUID()
                        console.log(newGameId);
                        this.games.set(newGameId,game);
                    }
                    else {
                        this.pendingUser = user
                    }
                    break
                }
                case "make_move" : {
                    for (let [k,v] of this.games) {
                        if (k===message.gameId) {
                            v.makeMove(user, message.move);
                            break;
                        }
                    }
                    break
                }
            }
        })
        user.getSocket().on("close", () => {
            for (let [k,v] of this.games) {
                if (v.getPlayer1()?.getSocket() === user.getSocket()) {
                    v.setPlayer1(null);
                    console.log(user.getUsername() + "disconnected")
                    break;
                }
                if (v.getPlayer2()?.getSocket() === user.getSocket()) {
                    v.setPlayer2(null);
                    console.log(user.getUsername() + "disconnected")
                    break
                }
            }
            this.users = this.users.filter(u => u.getSocket() !== user.getSocket());
        })
    }
}