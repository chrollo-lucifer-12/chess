import {WebSocketServer} from "ws"
import {GameManager} from "./GameManager"
import {User} from "./user";

const gameManager = new GameManager()

const wss = new WebSocketServer({port : 8080})

wss.on("connection", (websocket) => {
    websocket.on("error", (error) => {
        console.error(error)
    })

    websocket.on("message", (message) => {
        const data = JSON.parse(message.toString());
        if (data.type === "join_lobby") {
            const user = new User(websocket, data.userId, data.username)
            gameManager.addUser(user);
        }
    })

})