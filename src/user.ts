export class User {
    constructor(private ws : WebSocket, private userId : string, private username : string, private color : "b" | "w") {

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