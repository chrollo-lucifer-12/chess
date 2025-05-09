import {Game} from "./Game";
import {User} from "./user";
import {blue, red, bold} from "colorette"
import dotenv from "dotenv"
dotenv.config();

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
        user.getSocket().addEventListener("message", async (e) => {
            const message = JSON.parse(e.data.toString())
            switch (message.type) {
                case "join_game" : {
                    if (message.gameId) {
                        const game = this.games.get(message.gameId);
                        if (!game) return;
                        game.addObserver(user);
                        user.sendMessage(JSON.stringify({
                            type : "update",
                            board : game.getGameBoard().getBoard()
                        }))
                        return;
                    }
                    if (this.pendingUser) {
                        const game = new Game(this.pendingUser, user, 600,600)
                        const newGameId = crypto.randomUUID()
                        // await axios.post(`${process.env.NEXT_BACKEND_URL}/game/add`, {
                        //     gameId : newGameId
                        // });
                        user.sendMessage(JSON.stringify({
                            type : "gameId",
                            gameId : newGameId
                        }))
                        this.pendingUser.sendMessage(JSON.stringify({
                            type : "gameId",
                            gameId : newGameId
                        }))
                        this.games.set(newGameId,game);
                        this.pendingUser = null
                    }
                    else {
                        this.pendingUser = user
                    }
                    break
                }
                case "make_move" : {
                    console.log("move made")
                    for (let [k,v] of this.games) {
                        if (k===message.gameId) {
                            console.log(message.move);
                            await v.makeMove(user, message.move, message.gameId);
                            break;
                        }
                    }
                    break
                }
                case "resign" : {
                    for (let [k,v] of this.games) {
                        if (k===message.gameId) {
                            v.sendResign(user.getUsername())
                            break;
                        }
                    }
                    break
                }
                case "draw" : {
                    for (let [k,v] of this.games) {
                        if (k===message.gameId) {
                            v.offerDraw(user)
                            break;
                        }
                    }
                    break
                }
                case "draw_result" : {
                    if (message.result) {
                        for (let [k,v] of this.games) {
                            if (k===message.gameId) {
                                v.sendDraw();
                                break
                            }
                        }
                    }
                    break
                }
                case "send_message" : {
                    for (let [k,v] of this.games) {
                        if (k===message.gameId) {
                           v.sendMessage({username : user.getUsername(), message : message.message})
                            break
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
                    break;
                }
                if (v.getPlayer2()?.getSocket() === user.getSocket()) {
                    v.setPlayer2(null);
                    break
                }
                v.observers = v.observers.filter(u => u.getSocket() !== user.getSocket());
            }
            this.users = this.users.filter(u => u.getSocket() !== user.getSocket());
        })
    }
}