"use client";

import { Forum } from "@/api/forum/interfaces";
import { PublicUser, PublicUserResponse, User } from "@/api/user/interfaces";
import style from "./messages.module.scss";
import Image from "next/image";
import { BaseSyntheticEvent, Component, useEffect, useState } from "react";
import { Channel } from "@/api/messages/interfaces";
import { INTERNAL_API_URL, INTERNAL_CDN_URL } from "@/api/resources";
import MDEditor from "@uiw/react-md-editor";
import axios, { AxiosResponse } from "axios";
import { w3cwebsocket } from "websocket";
import { INTERNAL_WS_HOST } from "@/websockets/resources";
import { getCookie } from "@/utils/cookie";
import { postNotification } from "@/components/notifications/notification";
import {createNewDM} from "@/api/messages/post";

export class MessagesClient extends Component<{
    forum: Forum,
    user: User,
    perms: number,
    channels: Channel[] | undefined
}, {
    showingNewMessage: boolean,
    newMessageToUser: number,
    newMessageContent: string,
    dms: Channel[]
}> {
    constructor(props: {
        forum: Forum,
        user: User,
        perms: number,
        channels: Channel[] | undefined
    }) {
        super(props);
        this.state = {
            showingNewMessage: false,
            newMessageToUser: -1,
            newMessageContent: "",
            dms: this.props.channels || []
        }

        this._sendDM = this._sendDM.bind(this);
    }

    async _sendDM(e: BaseSyntheticEvent) {
        e.preventDefault();
        const res = await createNewDM({
            content: this.state.newMessageContent,
            receiver_id: this.state.newMessageToUser,
            sender_id: this.props.user.public_id
        });
    }

    render() {
        return (
            <>
                <div className={style.container}>
                    <nav className={style.nav}>
                        <h2>Messages</h2>
                        <button onClick={() => this.setState({showingNewMessage: !this.state.showingNewMessage})}>
                            <Image src="/svgs/plus.svg" alt="New Usergroup" sizes="100%" width={0} height={0} style={{
                                "width": "1.5rem",
                                "height": "1.5rem",
                                "filter": "invert(1)"
                            }}></Image>
                        </button>
                        {(this.props.channels === undefined || this.props.channels.length <= 0) &&
                            <span>Chat history not found</span>
                        }
                        {(this.props.channels !== undefined && this.props.channels.length >= 1) &&
                            <>
                                {this.props.channels.map(async (channel: Channel, index: number) => {
                                    const [userOne, setUserOne] = useState<PublicUser | undefined>(undefined);
                                    const [userTwo, setUserTwo] = useState<PublicUser | undefined>(undefined);

                                    useEffect(() => {
                                        if (userOne === undefined) {
                                            (async () => {
                                                const uotemp: AxiosResponse<PublicUserResponse> = await axios({
                                                    "url": INTERNAL_API_URL + "/user/public",
                                                    "method": "GET"
                                                });
                                                setUserOne(uotemp.data.userData);
                                            })();
                                        }
                                        if (userTwo === undefined) {
                                            (async () => {
                                                const uttemp: AxiosResponse<PublicUserResponse> = await axios({
                                                    "url": INTERNAL_API_URL + "/user/public",
                                                    "method": "GET"
                                                });
                                                setUserTwo(uttemp.data.userData);
                                            })();
                                        }
                                    })

                                    if (userOne === undefined || userTwo === undefined || this.props.channels === undefined) {
                                        return (
                                            <></>
                                        );
                                    }

                                    return (
                                        <div key={index}>
                                            <button>
                                                {userOne.public_id === this.props.user.public_id ?
                                                    <div key={index} style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                                                        <div>
                                                            <Image src={INTERNAL_CDN_URL + userTwo.profile_picture} alt="Profile Picture" sizes="100%" width={0} height={0} style={{
                                                                "width": "2rem",
                                                                "height": "2rem",
                                                                "borderRadius": "50%"
                                                            }}></Image>
                                                        </div>
                                                        <span>{userTwo.username}</span>
                                                    </div> :
                                                    <div style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                                                        <div>
                                                            <Image src={INTERNAL_CDN_URL + userOne.profile_picture} alt="Profile Picture" sizes="100%" width={0} height={0} style={{
                                                                "width": "2rem",
                                                                "height": "2rem",
                                                                "borderRadius": "50%"
                                                            }}></Image>
                                                        </div>
                                                        <span>{userOne.username}</span>
                                                    </div>
                                                }
                                                {this.props.channels[index].messages[this.props.channels[index].messages.length - 1].content}
                                            </button>
                                        </div>
                                    );
                                })}
                            </>
                        }
                    </nav>
                    <div className={style.chatWindow}>
                        {this.state.showingNewMessage && 
                            <div className={style.newMessage}>
                                <label htmlFor="to">To</label>
                                <input placeholder="User ID" onChange={(e: BaseSyntheticEvent) => this.setState({newMessageToUser: e.target.value})} type="text" name="toUser" />
                                <label htmlFor="message">Message</label>
                                <MDEditor height="25rem" style={{"width": "100%"}} onChange={(value: string | undefined) => this.setState({newMessageContent: value || ""})} value={this.state.newMessageContent}></MDEditor>
                                <button onClick={this._sendDM}>Send</button>
                            </div>
                        }
                        {!this.state.showingNewMessage &&
                            <>
                            </>
                        }
                    </div>
                </div>
            </>
        );
    }
}

const MessagesClientWrapper = ({ children }: any) => {
    return (
        <>
            {children}
        </>
    );
}

export default MessagesClientWrapper;
