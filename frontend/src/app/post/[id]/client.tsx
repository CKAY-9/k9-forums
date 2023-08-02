"use client";

import { Comment, Post } from "@/api/forum/interfaces";
import { PublicUser, User } from "@/api/user/interfaces";
import style from "./post.module.scss";
import Image from "next/image";
import { INTERNAL_API_URL, INTERNAL_CDN_URL } from "@/api/resources";
import { marked } from "marked";
import * as DOMPurify from "dompurify";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import Link from "next/link";
import { UsergroupFlags } from "@/api/admin/usergroup/interface";
import { lockPostWithID, pinPostWithID, postCommentUnderPost } from "@/api/forum/post";
import axios, { AxiosResponse } from "axios";
import { postNotification } from "@/components/notifications/notification";
import { generateEmptyProflie } from "@/api/user/utils.client";

export const PostInteraction = (props: { post: Post | undefined, user: User | undefined, perms: number, author: PublicUser | undefined, first: string, update: string }) => {
    const [showNewComment, setShowNewComment] = useState<boolean>(false);
    const [commentContent, setCommentContent] = useState<string>("");

    useEffect(() => {
        const bodyParse = DOMPurify.sanitize(marked.parse(props.post?.body || ""));
        const content = document.getElementById("content");
        if (content === null) return;

        content.innerHTML = bodyParse;
    }, []);

    const lockPost = async (e: BaseSyntheticEvent) => {
        e.preventDefault();
        const res = await lockPostWithID({ post_id: (props.post?.post_id.toString() || "0") });

        if (res !== undefined) {
            window.location.reload();
        }
    }

    const pinPost = async (e: BaseSyntheticEvent) => {
        e.preventDefault();
        const res = await pinPostWithID({ post_id: (props.post?.post_id.toString() || "0") });

        if (res !== undefined) {
            window.location.reload();
        }
    }

    const postComment = async (e: BaseSyntheticEvent) => {
        if ((props.perms & UsergroupFlags.COMMENT) !== UsergroupFlags.COMMENT) {
            postNotification("You are not allowed to comment!");
            return;
        }

        e.preventDefault();
        const res = await postCommentUnderPost({
            post_id: props.post?.post_id.toString() || "",
            user_id: props.user?.public_id.toString() || "",
            content: commentContent
        });

        if (res !== undefined) {
            window.location.reload();
        }
    }

    return (
        <>
            <header className={style.header}>
                <section>
                    <h1>{props.post?.title}</h1>
                    <span>Posted {props.first}</span>
                    <span style={{ "marginLeft": "1rem" }}>Updated {props.update}</span>
                    <div>Posted by <Link href={`/users/${props.author?.public_id}`}>{props.author?.username}</Link></div>
                </section>
                <section style={{ "display": "flex", "flexDirection": "row" }}>
                    {((props.perms & UsergroupFlags.POST_MANAGEMENT) === UsergroupFlags.POST_MANAGEMENT) &&
                        <>
                            <button style={{ "padding": "1rem" }} onClick={pinPost}>
                                <Image src={"/svgs/pin.svg"} alt="Pin Post" sizes="100%" width={0} height={0} style={{
                                    "width": "2rem",
                                    "height": "2rem",
                                    "filter": "invert(1)",
                                    "opacity": props.post?.pinned ? "1" : "0.5"
                                }}></Image>
                            </button>
                            <button style={{ "padding": "1rem" }} onClick={lockPost}>
                                <Image src={"/svgs/closed.svg"} alt="Pin Post" sizes="100%" width={0} height={0} style={{
                                    "width": "2rem",
                                    "height": "2rem",
                                    "filter": "invert(1)",
                                    "opacity": props.post?.closed ? "1" : "0.5"
                                }}></Image>
                            </button>
                        </>
                    }
                </section>
            </header>
            <main className={style.body}>
                <Link href={`/users/${props.author?.public_id}`} className={style.user}>
                    {props.author?.profile_picture !== "" &&
                        <div>
                            <Image src={INTERNAL_CDN_URL + props.author?.profile_picture} alt="Profile Picture" sizes="100%" width={0} height={0} style={{
                                "width": "10rem",
                                "height": "10rem",
                                "borderRadius": "50%"
                            }}></Image>
                        </div>
                    }
                    <div style={{ "display": "flex", "alignItems": "center", "gap": "0.5rem" }}>
                        <h2>{props.author?.username}</h2>
                        <span style={{ "color": "rgb(var(--accent))", "pointerEvents": "none" }}> / Author</span>
                    </div>
                </Link>
                <div className={style.content} id="mainBody">
                    <div id="content">
                    </div>
                    <footer className={style.footer}>
                        {props.user !== undefined &&
                            <>
                                <div style={{ "position": "relative" }}>
                                    <Image src="/svgs/up.svg" alt="Upvote" sizes="100%" width={0} height={0} style={{
                                        "width": "2rem",
                                        "height": "2rem",
                                        "filter": "invert(1)"
                                    }}></Image>
                                </div>
                                <div>
                                    <Image src="/svgs/down.svg" alt="Upvote" sizes="100%" width={0} height={0} style={{
                                        "width": "2rem",
                                        "height": "2rem",
                                        "filter": "invert(1)"
                                    }}></Image>
                                </div>
                            </>
                        }
                    </footer>
                </div>
            </main>
            {props.user !== undefined &&
                <button onClick={() => {
                    setShowNewComment(!showNewComment);
                }} style={{ "margin": "1rem 0" }}>Comment</button>
            }
            <div className={style.comments}>
                {props.post?.comments.map((comment: Comment, index: number) => {
                    let commentor = comment.user;
                    if (commentor === undefined) {
                        commentor = generateEmptyProflie();
                    }

                    useEffect(() => {
                        const bodyParse = DOMPurify.sanitize(marked.parse(comment.content || ""));
                        const content = document.getElementById("content" + index);
                        if (content === null) return;
                
                        content.innerHTML = bodyParse;
                    }, []);

                    return (
                        <div key={index} className={style.body}>
                            <Link href={`/users/${commentor?.public_id}`} className={style.user}>
                                {commentor?.profile_picture !== "" &&
                                    <div>
                                        <Image src={INTERNAL_CDN_URL + commentor?.profile_picture} alt="Profile Picture" sizes="100%" width={0} height={0} style={{
                                            "width": "10rem",
                                            "height": "10rem",
                                            "borderRadius": "50%"
                                        }}></Image>
                                    </div>
                                }
                                <div style={{ "display": "flex", "alignItems": "center", "gap": "0.5rem" }}>
                                    <h2>{commentor?.username}</h2>
                                    {commentor?.public_id === props.author?.public_id && <span style={{ "color": "rgb(var(--accent))", "pointerEvents": "none" }}> / Author</span>}
                                </div>
                            </Link>
                            <div className={style.content} id="mainBody">
                                <div id={"content" + index}>
                                </div>
                                <footer className={style.footer}>
                                    {props.user !== undefined &&
                                        <>
                                            <div style={{ "position": "relative" }}>
                                                <Image src="/svgs/up.svg" alt="Upvote" sizes="100%" width={0} height={0} style={{
                                                    "width": "2rem",
                                                    "height": "2rem",
                                                    "filter": "invert(1)"
                                                }}></Image>
                                            </div>
                                            <div>
                                                <Image src="/svgs/down.svg" alt="Upvote" sizes="100%" width={0} height={0} style={{
                                                    "width": "2rem",
                                                    "height": "2rem",
                                                    "filter": "invert(1)"
                                                }}></Image>
                                            </div>
                                        </>
                                    }
                                </footer>
                            </div>
                        </div>
                    );
                })}
            </div>
            {(props.user !== undefined && showNewComment) &&
                <div className={style.body} style={{"marginTop": "1rem"}}>
                    <Link href={`/users/me`} className={style.user}>
                        {props.user.profile_picture !== "" &&
                            <div>
                                <Image src={INTERNAL_CDN_URL + props.user.profile_picture} alt="Profile Picture" sizes="100%" width={0} height={0} style={{
                                    "width": "10rem",
                                    "height": "10rem",
                                    "borderRadius": "50%"
                                }}></Image>
                            </div>
                        }
                        <div style={{ "display": "flex", "alignItems": "center", "gap": "0.5rem" }}>
                            <h2>{props.user.username}</h2>
                            {props.user.public_id === props.author?.public_id && <span style={{ "color": "rgb(var(--accent))", "pointerEvents": "none" }}> / Author</span>}
                        </div>
                    </Link>
                    <div className={style.content} id="mainBody">
                        <div style={{"display": "flex", "flexDirection": "column", "gap": "1rem"}}>
                            <h2>Comment on {props.user.username}'s thread</h2>
                            <label htmlFor="content">Comment Content</label>
                            <textarea onChange={(e: BaseSyntheticEvent) => setCommentContent(e.target.value)} name="content" cols={60} rows={10}></textarea>
                            <button onClick={postComment}>Post</button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

const PostClient = ({ children }: any) => {
    return (
        <>
            {children}
        </>
    );
}

export default PostClient;