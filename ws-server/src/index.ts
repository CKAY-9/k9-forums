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
    ws.on("error", console.error);

    ws.on("message", (data) => {
        k9SocketServer.handleMessage(data, ws);
    });
});

server.listen(3002);