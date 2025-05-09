import {WebSocketServer} from "ws"
import {GameManager} from "./GameManager"
import {User} from "./user";
require("./worker")

const gameManager = new GameManager()

const wss = new WebSocketServer({port : 8080})

wss.on("connection", (websocket) => {
    websocket.on("error", (error) => {
        console.error(error)
    })

    websocket.on("message", async (message) => {
        const data = JSON.parse(message.toString());
        if (data.type === "join_lobby") {
            const user = new User(websocket, data.userId, data.username, data.color)
            await gameManager.addUser(user);
        }
    })

})