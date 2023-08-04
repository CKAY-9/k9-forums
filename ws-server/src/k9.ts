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
    connectUsers: User[] = [];

    async handleMessage(data, ws) {
        const parsed: Message = JSON.parse(JSON.stringify(data));
        if (parsed.type === undefined) return;

        switch (parsed.type) {
            case "connect": 
                const userID = parsed.data.user_id;
                const token = parsed.data.token;
                const user = await fetchPersonalUser(token);

                if (user === undefined) return;
                if (user.user.public_id !== userID) return;

                let flag = true;
                for (let i = 0; i < this.connectUsers.length; i++) {
                    if (this.connectUsers[i].userID === user.user.public_id) {
                        this.connectUsers[i].setSocket(ws);
                        flag = false;
                        break;
                    }
                }

                if (flag) {
                    const temp = new User(user.user.public_id, token, ws);
                    this.connectUsers.push(temp);
                }

                break;
        }
    }
}