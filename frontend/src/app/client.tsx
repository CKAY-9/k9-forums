"use client";

import { fetchTopicPostsAndActivity } from "@/api/forum/fetch";
import style from "./index.module.scss";
import { FetchTopicPostsResponse, Forum, Post, Topic } from "@/api/forum/interfaces";
import Link from "next/link";
import Image from "next/image";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Component, ReactNode, useEffect, useState } from "react";
import { w3cwebsocket } from "websocket";
import { INTERNAL_WS_HOST } from "@/websockets/resources";
import axios from "axios";
import { INTERNAL_API_URL, INTERNAL_CDN_URL } from "@/api/resources";
import { PublicUser, User } from "@/api/user/interfaces";

const HomeTopic = (props: { topic: Topic }) => {
    const [topic, setTopic] = useState<Topic | undefined>(undefined);

    useEffect(() => {
        (async () => {
            const req = await fetchTopicPostsAndActivity(props.topic.topic_id);
            if (req !== undefined) {
                setTopic(req.topic);
            }
        })();
    }, [props.topic.topic_id]);

    return (
        <Link href={`/topic/${props.topic.topic_id}`} className={style.topic}>
            <section style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                {props.topic.topic_picture !== "" &&
                    <Image src={INTERNAL_CDN_URL + props.topic.topic_picture} alt="" sizes="100%" width={0} height={0} style={{
                        "width": "3rem",
                        "height": "3rem",
                        "borderRadius": "50%",
                        "objectFit": "cover"
                    }}></Image>
                }
                <h2>{props.topic.name}</h2>
            </section>
            <p>{props.topic.about}</p>
            <div style={{ "display": "flex", "alignItems": "center", "gap": "1rem" }}>
                {topic?.posts !== undefined &&
                    <div style={{ "display": "flex", "alignItems": "center", "gap": "0.5rem", "opacity": "0.5" }}>
                        <Image src={"/svgs/comment.svg"} alt="Locked" sizes="100%" width={0} height={0} style={{
                            "width": "1.5rem",
                            "height": "1.5rem",
                            "filter": "invert(1)",
                        }}></Image>
                        <span>{topic.posts.length || 0}</span>
                    </div>
                }
            </div>
        </Link>
    );
}

const HomeTopicsClient = (props: { topics: Topic[] }) => {
    return (
        <>
            {props.topics.map((topic: Topic, index: number) => {
                return (
                    <>
                        <HomeTopic key={index} topic={topic}></HomeTopic>
                    </>
                );
            })}
        </>
    );
}

export class ActivityBar extends Component<{
    forum: Forum
}, {
    posts: Post[],
    comments: Comment[],
    users: User[],
    ws: w3cwebsocket | undefined,
    wsData: any,
    activeUserCount: number
}> {

    constructor(props: { forum: Forum }) {
        super(props);
        this.state = {
            "comments": [],
            "posts": [],
            "users": [],
            "ws": undefined,
            "wsData": "",
            "activeUserCount": 1
        }
    }

    async componentDidMount() {
        const pReq = await axios({
            "url": INTERNAL_API_URL + "/post/all",
            "method": "GET"
        });

        const cReq = await axios({
            "url": INTERNAL_API_URL + "/post/allComments",
            "method": "GET"
        });

        const uReq = await axios({
            "url": INTERNAL_API_URL + "/user/all",
            "method": "GET"
        });

        const server = new w3cwebsocket(INTERNAL_WS_HOST);

        server.onerror = (err) => console.error(err);

        server.onopen = () => {
            this.setState({"ws": server});
            server.send(JSON.stringify({
                "type": "userCount",
                "data": {}
            }));
        }

        server.onmessage = (msg) => {
            const data = JSON.parse(msg.data.toString());
            if (data.type === "userCount") {
                this.setState({"activeUserCount": data.count});
            }
            this.setState({"wsData": data});
        }

        server.onclose = () => {
            server.send(JSON.stringify({
                "type": "disconnect",
                "data": {}
            }));
        }

        this.setState({
            "comments": cReq.data.comments,
            "posts": pReq.data.posts,
            "users": uReq.data.users
        });
    }

    render(): ReactNode {
        return (
            <>
                <div className={style.activity}>
                    <section className={`${style.forumInfo} ${style.section}`}>
                        <div>
                            <Image src={INTERNAL_CDN_URL + this.props.forum.community_logo} alt="Stats" sizes="100%" width={0} height={0} style={{
                                "width": "5rem",
                                "height": "5rem",
                                "borderRadius": "50%"
                            }}></Image>
                        </div>
                        <span className={style.name}>{this.props.forum.community_name}</span>
                    </section>

                    <section className={style.section}>
                        <section style={{ "display": "flex", "flexDirection": "row", "alignItems": "center", "gap": "1rem" }}>
                            <div>
                                <Image src={"/svgs/trending_up.svg"} alt="Stats" sizes="100%" width={0} height={0} style={{
                                    "width": "2rem",
                                    "height": "2rem",
                                    "filter": "invert(1)"
                                }}></Image>
                            </div>
                            <span>Stats</span>
                        </section>
                        <span>Posts: {this.state.posts.length}</span>
                        <span>Comments: {this.state.comments.length}</span>
                        <span>Total Users: {this.state.users.length}</span>
                        <span>Active Users: {this.state.activeUserCount}</span>
                    </section>
                </div>
            </>
        );
    }
}

export default HomeTopicsClient;
