import Express = require("express");
import Http = require("http");
import SocketIo = require("socket.io");

export class Server {
    app: Express.Application;
    http: Http.Server;
    io: SocketIO.Server;
    
    constructor (port: number) {
        this.app = Express();
        this.http = new Http.Server(this.app);
        this.io = SocketIo(this.http);

        this.app.use("/", Express.static(process.cwd()+"/build/client/"));

        this.app.get('/', function (req, res) {
            res.redirect("index.html")
        });

        this.io.on("connect", (socket) => {
            this.handler(socket);
        });

        this.http.listen(port, () => { console.log("listening on", port) })
    }

    private handler(socket) {
        console.log("client connected", socket.id);
        socket.on("disconnect", () => { console.log("client disconnected", socket.id) });
    }
}