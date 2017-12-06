
import Events = require("events");
import {Client} from "./client";

function App (io) {
    let events = new Events();
    let client = new Client(io,events);
    return client;
}

module.exports.App = App;
(window as any).App = function (io) { App(io) };