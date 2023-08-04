import dotenv from "dotenv";
import { createServer } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { K9SocketServer } from "./k9";

dotenv.config({
    "path": "../.env"
});

const server = createServer();
const wss = new WebSocketServer({ server: server });
const k9SocketServer = new K9SocketServer();

wss.on("connection", (ws: WebSocket) => {
    ws.on("error", () => {
        console.error
        k9SocketServer.removeConnect(ws);
    });
    ws.on("close", () => {
        k9SocketServer.removeConnect(ws);
    })

    k9SocketServer.handleConnection(ws);

    ws.on("message", (data) => {
        k9SocketServer.handleMessage(data.toString(), ws);
    });
});

server.listen(3002);