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

const Channel = (props: {channel: Channel, user: User, onClick: Function}) => {
    const [userOne, setUserOne] = useState<PublicUser | undefined>(undefined);
    const [userTwo, setUserTwo] = useState<PublicUser | undefined>(undefined);

    useEffect(() => {
        if (userOne === undefined) {
            (async () => {
                const uotemp: AxiosResponse<PublicUserResponse> = await axios({
                    "url": INTERNAL_API_URL + "/user/public",
                    "method": "GET",
                    "params": {
                        "public_id": props.channel.sender_id
                    }
                });
                setUserOne(uotemp.data.userData);
            })();
        }
        if (userTwo === undefined) {
            (async () => {
                const uttemp: AxiosResponse<PublicUserResponse> = await axios({
                    "url": INTERNAL_API_URL + "/user/public",
                    "method": "GET",
                    "params": {
                        "public_id": props.channel.receiver_id
                    }
                });
                setUserTwo(uttemp.data.userData);
            })();
        }
    })

    if (userOne === undefined || userTwo === undefined) {
        return (
            <></>
        );
    }

    return (
        <div>
            <button onClick={() => props.onClick()}>
                {userOne.public_id === props.user.public_id ?
                    <div style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
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
            </button>
        </div>
    );
}

const ChannelChat = (props: {channel: Channel, user: User}) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [sender, setSender] = useState<PublicUser>();
    const [receiver, setReceiever] = useState<PublicUser>();
    const [newMessage, setNewMessage] = useState<string>("");

    useEffect(() => {
        (async() => {
            const reqSender = await axios({
                "url": INTERNAL_API_URL + "/user/public",
                "method": "GET",
                "params": {
                    "public_id": props.channel.sender_id.toString()
                }
            });

            setSender(reqSender.data.userData);

            const reqReceiver = await axios({
                "url": INTERNAL_API_URL + "/user/public",
                "method": "GET",
                "params": {
                    "public_id": props.channel.receiver_id.toString()
                }
            });

            setReceiever(reqReceiver.data.userData);

            const reqMessages = await axios({
                "url": INTERNAL_API_URL + "/messages/channelMessages",
                "method": "GET",
                "params": {
                    "channel_id": props.channel.channel_id
                },
                "headers": {
                    "Authorization": getCookie("token")
                }
            });

            setMessages(reqMessages.data.messages);
         })();
    }, [props.channel.channel_id]);

    if (receiver === undefined || sender === undefined) {
        return (
           <>

           </>
        );
    }

    const sendMessage = async (e: BaseSyntheticEvent) => {
        e.preventDefault();
        const res = await createNewDM({
            "content": newMessage,
            "sender_id": props.user.public_id,
            "receiver_id": props.channel.sender_id
        });

        setMessages(old => [...old, res.message]);
    }

    return (
        <div className={style.chat}>
            <header className={style.header}>
                <Image src={INTERNAL_CDN_URL + receiver.profile_picture} alt="PFP" sizes="100%" width={0} height={0} style={{
                    "width": "2rem",
                    "height": "2rem",
                    "borderRadius": "50%"
                }} />
                <h2>{receiver.username}</h2>
            </header>
            <section className={style.messages}>
                {messages?.map((message, index) => {
                    if (message.sender_id === props.user.public_id) {
                        return (
                            <div key={index} className={`${style.message} ${style.sender}`}>
                                {message.content}
                            </div>
                        )
                    }

                    return (
                        <div key={index} className={`${style.message} ${style.receiver}`}>
                            {message.content}
                        </div>       
                    );
                })}
            </section>
            <section className={style.controls}>
                <textarea onChange={(e: BaseSyntheticEvent) => setNewMessage(e.target.value)} placeholder="Your Message" cols={60} rows={10}></textarea>
                <button onClick={sendMessage}>Send</button>
            </section>
        </div>     
    );
}

export class MessagesClient extends Component<{
    forum: Forum,
    user: User,
    perms: number,
    channels: Channel[] | undefined
    rChannels: Channel[] | undefined
}, {
    showingNewMessage: boolean,
    newMessageToUser: number,
    newMessageContent: string,
    dms: Channel[],
    activeChat: Channel | undefined
}> {
    constructor(props: {
        forum: Forum,
        user: User,
        perms: number,
        channels: Channel[] | undefined,
        rChannels: Channel[] | undefined
    }) {
        super(props);
        console.log(props);
        this.state = {
            showingNewMessage: false,
            newMessageToUser: -1,
            newMessageContent: "",
            dms: this.props.channels || [],
            activeChat: undefined
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

    setActiveChat(channel: Channel) {
        this.setState({activeChat: channel, showingNewMessage: false});
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
                        {(this.props.channels !== undefined && this.props.channels.length >= 1) &&
                            <>
                                {this.props.channels.map((channel: Channel, index: number) => {
                                    for (let i = 0; i < this.props.rChannels?.length; i++) {
                                        if (this.props.rChannels[i].sender_id === channel.receiver_id) {
                                            break;
                                        }
                                    }

                                    return (
                                        <Channel key={index} onClick={() => this.setActiveChat(channel)} channel={channel} user={this.props.user}></Channel>     
                                    );
                                })}
                            </>
                        }
                        {(this.props.rChannels !== undefined && this.props.rChannels.length >= 1) &&
                            <>
                                {this.props.rChannels.map((channel: Channel, index: number) => {
                                    return (
                                        <Channel key={index} onClick={() => this.setActiveChat(channel)} channel={channel} user={this.props.user}></Channel>     
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
                        {(!this.state.showingNewMessage && this.state.activeChat !== undefined) &&
                            <>
                                <ChannelChat user={this.props.user} channel={this.state.activeChat}></ChannelChat>
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
