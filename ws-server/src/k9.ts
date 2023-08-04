import { WebSocket } from "ws";
import { fetchPersonalUser } from "./api/fetch";

interface Message {
    type: string | undefined,
    data: any
}

export class Channel {
    channel_id: number;
    userOne: User;
    userTwo: User;
}

export class User {
    userID: number;
    token: string;
    subscriptions: Channel[];
    socket: WebSocket;

    constructor(userID: number, token: string, socket: WebSocket) {
        this.userID = userID;
        this.token = token;
        this.subscriptions = [];
    }

    setSocket(socket: WebSocket) {
        this.socket = socket;
    }
}

export class K9SocketServer {
    connectedUsers: User[] = [];
    connectedSockets: WebSocket[] = [];

    async handleMessage(data, ws: WebSocket) {
        const parsed: Message = JSON.parse(data);
        if (parsed.type === null) return;

        switch (parsed.type) {
            case "connect": 
                const userID = parsed.data.user_id;
                const token = parsed.data.token;
                const user = await fetchPersonalUser(token);

                if (user === undefined) return;
                if (user.user.public_id !== userID) return;

                let flag = true;
                for (let i = 0; i < this.connectedUsers.length; i++) {
                    if (this.connectedUsers[i].userID === user.user.public_id) {
                        this.connectedUsers[i].setSocket(ws);
                        flag = false;
                        break;
                    }
                }

                if (flag) {
                    const temp = new User(user.user.public_id, token, ws);
                    this.connectedUsers.push(temp);
                }

                break;
            case "userCount":
                return ws.send(JSON.stringify({
                    "type": "userCount",
                    "count": this.connectedSockets.length
                }));
                break;
            case "disconnect":
                this.removeConnect(ws);
                break;
        }
    }

    async removeConnect(ws: WebSocket) {
        for (let i = 0; i < this.connectedSockets.length; i++) {
            if (this.connectedSockets[i] === ws) {
                this.connectedSockets.splice(i, 1);
                break;
            }
        }

        for (const socket of this.connectedSockets) {
            socket.send(JSON.stringify({
                "type": "userCount",
                "count": this.connectedSockets.length
            }))
        }
    }

    async handleConnection(ws: WebSocket) {
        let flag = true;
        for (let i = 0; i < this.connectedSockets.length; i++) {
            if (this.connectedSockets[i] === ws) 
                flag = false;
        }

        if (flag) {
            this.connectedSockets.push(ws);
        }

        for (const socket of this.connectedSockets) {
            socket.send(JSON.stringify({
                "type": "userCount",
                "count": this.connectedSockets.length
            }))
        }
    }
}