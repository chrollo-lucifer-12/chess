import {WebSocket} from "ws"

export class User {

    private color : "b" | "w" | undefined

    constructor(private ws : WebSocket, private userId : string, private username : string) {

    }

    getUsername () {
        return this.username
    }

    getSocket () {
        return this.ws
    }

    sendMessage (message : string) {
        this.ws.send(message);
    }

    setColor (color : "b" | "w") {
        this.color = color
    }

    getColor () {
        return this.color
    }
}