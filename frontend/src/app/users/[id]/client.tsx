"use client";

import { useEffect, useState } from "react";
import style from "./client.module.scss";
import { Post, Topic } from "@/api/forum/interfaces";
import { PublicUser, UserCommentsResponse, UserPostsResponse } from "@/api/user/interfaces";
import axios, { AxiosResponse } from "axios";
import { INTERNAL_API_URL, INTERNAL_CDN_URL } from "@/api/resources";
import Link from "next/link";
import { calcTimeSinceMillis } from "@/utils/time";
import { fetchPost, fetchTopicPostsAndActivity } from "@/api/forum/fetch";
import Image from "next/image";

const Posts = (props: { posts: Post[], profile: PublicUser }) => {
    return (
        <>
            {(props.posts.length <= 0 || props.posts === undefined) && <h1>This user hasn't posted yet!</h1>}
            {props.posts.length >= 1 &&
                <div className={style.posts}>
                    {props.posts.map((post: Post, index: number) => {
                        const [originalTopic, setOriginalTopic] = useState<Topic>();
                        const [postFull, setPostFull] = useState<Post>();

                        useEffect(() => {
                            (async () => {
                                const topic = await fetchTopicPostsAndActivity(post.topic_id || 0);
                                setOriginalTopic(topic?.topic);

                                const pF = await fetchPost(post.post_id);
                                if (pF?.post !== undefined) {
                                    setPostFull(pF.post);
                                }
                            })();
                        });

                        return (
                            <Link href={"/post/" + post.post_id} className={style.post}>
                                <section style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "1rem" }}>
                                    <h1>{post.title === "" ? "no title available" : post.title}</h1>
                                    <section style={{ "display": "flex", "gap": "1rem" }}>
                                        <div>
                                            <Image src={"/svgs/pin.svg"} alt="Pinned" sizes="100%" width={0} height={0} style={{
                                                "width": "2rem",
                                                "height": "2rem",
                                                "filter": "invert(1)",
                                                "opacity": post.pinned ? "1" : "0.5"
                                            }}></Image>
                                        </div>
                                        <div>
                                            <Image src={"/svgs/closed.svg"} alt="Locked" sizes="100%" width={0} height={0} style={{
                                                "width": "2rem",
                                                "height": "2rem",
                                                "filter": "invert(1)",
                                                "opacity": post.closed ? "1" : "0.5"
                                            }}></Image>
                                        </div>
                                    </section>
                                </section>
                                <section style={{ "display": "flex", "alignItems": "center", "gap": "1rem" }}>
                                    <div>
                                        <Image src={INTERNAL_CDN_URL + props.profile.profile_picture} alt="Profile Picture" sizes="100%" width={0} height={0} style={{
                                            "width": "3rem",
                                            "height": "3rem",
                                            "borderRadius": "50%"
                                        }}></Image>
                                    </div>
                                    <h3>{props.profile.username}</h3>
                                </section>
                                <section style={{ "display": "flex", "marginTop": "0.5rem", "alignItems": "center", "gap": "1rem", "opacity": "0.5" }}>
                                    <span>Posted {calcTimeSinceMillis(new Date(post.first_posted).getTime(), new Date().getTime())} ago</span>
                                    {post.first_posted !== post.last_updated && <span>Activity {calcTimeSinceMillis(new Date(post.last_updated).getTime(), new Date().getTime())} ago</span>}
                                    <section style={{ "display": "flex", "justifyContent": "center", "gap": "0.5rem" }}>
                                        <span>{postFull === undefined ? 0 : postFull.comments.length}</span>
                                        <div>
                                            <Image src={"/svgs/comment.svg"} alt="Comments" sizes="100%" width={0} height={0} style={{
                                                "width": "1rem",
                                                "height": "1rem",
                                                "filter": "invert(1)"
                                            }}></Image>
                                        </div>
                                    </section>
                                    {originalTopic !== undefined && <span>Posted to <Link href={`/topic/${originalTopic.topic_id}`}>{originalTopic.name}</Link></span>}
                                </section>
                            </Link>
                        )
                    })}
                </div>
            }
        </>
    );
}

const Comments = (props: { comments: Comment[], profile: PublicUser }) => {
    return (
        <>
            {props.comments.length <= 0 && <h1>This user hasn't commented yet!</h1>}
        </>
    );
}

export const ProfileInteraction = (props: { profile: PublicUser }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [viewing, setViewing] = useState<number>(0);

    useEffect(() => {
        (async () => {
            const p: AxiosResponse<UserPostsResponse> = await axios({
                "url": INTERNAL_API_URL + "/user/posts",
                "method": "GET",
                "params": {
                    "public_id": props.profile.public_id
                }
            });

            const c: AxiosResponse<UserCommentsResponse> = await axios({
                "url": INTERNAL_API_URL + "/user/comments",
                "method": "GET",
                "params": {
                    "public_id": props.profile.public_id
                }
            });

            console.log(p.data, c.data);

            if (p.data.posts !== undefined) {
                setPosts(p.data.posts);
            }
            if (c.data.comments !== undefined) {
                setComments(c.data.comments);
            }
        })();
    }, []);

    return (
        <div className={style.container}>
            <nav className={style.nav}>
                <button onClick={() => setViewing(0)}>Posts</button>
                <button onClick={() => setViewing(1)}>Comments</button>
                <button onClick={() => setViewing(2)}>Following</button>
                <button onClick={() => setViewing(3)}>Followers</button>
            </nav>
            <div className={style.content}>
                {posts !== undefined && comments !== undefined && 
                    <>
                        {viewing === 0 && <Posts profile={props.profile} posts={posts}></Posts>}
                        {viewing === 1 && <Comments profile={props.profile} comments={comments}></Comments>}
                    </>
                }
            </div>
        </div>
    );
}

const ProflieClient = ({ children }: any) => {
    return (
        <>
            {children}
        </>
    );
}

export default ProflieClient;
