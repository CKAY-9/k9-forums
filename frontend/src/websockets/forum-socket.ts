import * as WebSocket from "websocket";
import { INTERNAL_WS_HOST } from "./resources";
import { getCookie } from "@/utils/cookie";

export class ForumSocket {
    socket: WebSocket.w3cwebsocket; 
    
    constructor() {
        this.socket = new WebSocket.w3cwebsocket(INTERNAL_WS_HOST);
    }

    async send(data: string) {
        this.socket.send(data);
    }

    async connect(userID: string) {
        this.socket.send(JSON.stringify({
            "user_id": userID,
            "token": getCookie("token")
        }));
    }
}