export class User {
    constructor(private ws : WebSocket, private userId : string, private username : string, private color : "b" | "w") {

    }

    getUsername () {
        return this.username
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