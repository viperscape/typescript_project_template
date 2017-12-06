export class Client {
    socket;
    id: string;
    events;
    connected = false;

    constructor (io, events) {
        this.socket = io;
        this.events = events;
        this.handler(io);
    }

    private handler(socket) {
        socket.on("connect", () => { 
            this.connected = true;
            this.id = socket.id;
            console.log("connected", this.id);
        });
        socket.on("disconnect", () => { 
            this.connected = false;
            console.log("disconnected", this.id);
        });
    }
}
