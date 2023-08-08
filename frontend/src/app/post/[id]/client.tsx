"use client";

import { Comment, Post, Topic, Vote } from "@/api/forum/interfaces";
import { PublicUser, User } from "@/api/user/interfaces";
import style from "./post.module.scss";
import Image from "next/image";
import { INTERNAL_CDN_URL } from "@/api/resources";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import Link from "next/link";
import { UsergroupFlags } from "@/api/admin/usergroup/interface";
import { postCommentUnderPost, voteOnPost } from "@/api/forum/post";
import { postNotification } from "@/components/notifications/notification";
import { calcRunningTotalVotes, generateEmptyProflie } from "@/api/user/utils.client";
import { calcTimeSinceMillis } from "@/utils/time";
import MarkdownPreview from "@uiw/react-markdown-preview";
import MDEditor from "@uiw/react-md-editor";
import { fetchTopicPostsAndActivity } from "@/api/forum/fetch";
import { deleteComment, deletePost } from "@/api/forum/delete";
import { lockPostWithID, pinPostWithID, updateComment, updatePost } from "@/api/forum/put";

const Comment = (props: {comment: Comment, user: User | undefined, author: PublicUser | undefined, index: number, post: Post | undefined, perms: number}) => {
    const comment = props.comment;
    const index = props.index;
    const [votesOnThis, setVotesOnThis] = useState<Vote[]>(comment.votes || []);
    const [cEdit, cSetEdit] = useState<string>(comment.content);
    const [cIsEditing, cSetIsEditing] = useState<boolean>(false);

    const _updateComment = async (e: BaseSyntheticEvent) => {
        e.preventDefault();

        if (props.user?.public_id !== comment.user_id) return;

        const res = await updateComment({
            "comment_id": comment.comment_id,
            "content": cEdit
        });

        if (res !== undefined) {
            postNotification("Updated comment!");
            window.location.reload();
        }
    }

    // used for comments
    const _deletePost = async (e: BaseSyntheticEvent) => {
        e.preventDefault();
        
        if (props.user?.public_id !== comment.user_id) return;

        const res = await deleteComment({
            "comment_id": props.comment.comment_id|| 0
        });

        if (res !== undefined) {
            postNotification("Deleted comment!");
            window.location.reload();
        }

    }

    let commentor = comment.user;
    if (commentor === undefined) {
        commentor = generateEmptyProflie();
    }

    console.log(commentor);

    // System
    if (props.author === undefined || commentor.public_id <= 0) {

        return (
            <div style={{"padding": "1rem 2rem", "backgroundColor": "rgb(var(--800))", "borderRadius": "1rem", "textAlign": "center", "pointerEvents": "none"}}> 
                <span style={{"pointerEvents": "none"}}>{new Date(comment.posted_at).toDateString()}</span>
                <br />
                <span style={{"pointerEvents": "none"}}>{comment.content}</span>
            </div>
        )
    }

    return (
        <div className={style.body}>
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
                <div style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "0.5rem" }}>
                    <h2>{commentor?.username}</h2>
                    {commentor?.public_id === props.author?.public_id && <span style={{ "color": "rgb(var(--accent))", "pointerEvents": "none" }}> / Author</span>}
                </div>
            </Link>
            <div className={style.content} id={"mainBody" + index}>
                {cIsEditing ?
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "1rem", "flex": "1" }}>
                        <label htmlFor="title">Comment</label>
                        <MDEditor height="25rem" style={{ "width": "100%", "fontSize": "1rem !important" }} value={cEdit} onChange={(value: string | undefined) => cSetEdit(value || "")} />
                        <section style={{ "display": "flex", "gap": "1rem" }}>
                            <button style={{ "width": "fit-content" }} onClick={_updateComment}>Update</button>
                            <button style={{ "width": "fit-content" }} onClick={() => {
                                cSetIsEditing(false);
                            }}>Cancel</button>
                        </section>
                    </div> :
                    <MarkdownPreview style={{ "backgroundColor": "transparent", "flex": "1" }} source={comment.content || ""} />
                }
                <footer className={style.footer}>
                    {props.user !== undefined &&
                        <>
                            <button onClick={async (e: BaseSyntheticEvent) => {
                                await voteOnPost({
                                    "postType": "comment",
                                    "targetID": props.post?.post_id || 0,
                                    "userID": props.user?.public_id || 0,
                                    "voteType": 1,
                                    "votes": votesOnThis
                                });

                                setVotesOnThis(old => [...old, {
                                    "post_id": props.post?.post_id || 0,
                                    "type": 1,
                                    "user_id": props.user?.public_id || 0
                                }])
                                postNotification("Upvoted post!");
                            }}>
                                <Image src="/svgs/up.svg" alt="Upvote" sizes="100%" width={0} height={0} style={{
                                    "width": "1rem",
                                    "height": "1rem",
                                    "filter": "invert(1)"
                                }}></Image>
                            </button>
                            <span>{calcRunningTotalVotes(votesOnThis)}</span>
                            <button onClick={async (e: BaseSyntheticEvent) => {
                                await voteOnPost({
                                    "postType": "comment",
                                    "targetID": props.post?.post_id || 0,
                                    "userID": props.user?.public_id || 0,
                                    "voteType": -1,
                                    "votes": votesOnThis
                                });

                                setVotesOnThis(old => [...old, {
                                    "post_id": props.post?.post_id || 0,
                                    "type": -1,
                                    "user_id": props.user?.public_id || 0
                                }])
                                postNotification("Downvoted post!");
                            }}>
                                <Image src="/svgs/down.svg" alt="Upvote" sizes="100%" width={0} height={0} style={{
                                    "width": "1rem",
                                    "height": "1rem",
                                    "filter": "invert(1)"
                                }}></Image>
                            </button>
                        </>
                    }
                    {props.user?.public_id === comment.user_id &&
                        <button onClick={(e: BaseSyntheticEvent) => {
                            cSetIsEditing(!cIsEditing);
                            const elm = document.getElementById("mainBody" + index);
                            if (elm === null) return;
                            elm.scrollIntoView();
                        }}>
                            <Image src="/svgs/pen.svg" alt="Edit" sizes="100%" width={0} height={0} style={{
                                "width": "1rem",
                                "height": "1rem",
                                "filter": "invert(1)"
                            }}></Image>
                        </button>
                    }
                    {(props.user.public_id === commentor?.public_id || (props.perms & UsergroupFlags.DELETE_POSTS) === UsergroupFlags.DELETE_POSTS) &&
                        <button onClick={_deletePost}>
                            <Image src="/svgs/delete.svg" alt="Edit" sizes="100%" width={0} height={0} style={{
                                "width": "1rem",
                                "height": "1rem",
                                "filter": "invert(1)"
                            }}></Image>
                        </button>
                    }
                    <span style={{ "opacity": "0.5", "pointerEvents": "none" }}>Posted {calcTimeSinceMillis(new Date(comment.posted_at).getTime(), new Date().getTime())} ago</span>
                </footer>
            </div>
        </div>
    );
}

export const PostInteraction = (props: { post: Post | undefined, user: User | undefined, perms: number, author: PublicUser | undefined }) => {
    const [showNewComment, setShowNewComment] = useState<boolean>(false);
    const [commentContent, setCommentContent] = useState<string>("");
    const [primaryPostVotes, setPrimaryPostVotes] = useState<Vote[]>(props.post?.votes || []);
    const [originalTopic, setOriginalTopic] = useState<Topic | undefined>();
    const [editingPost, setEditingPost] = useState<boolean>(false);
    const [edit, setEdit] = useState<string>(props.post?.body || "");
    const [editTitle, setEditTitle] = useState<string>(props.post?.title || "");
    const [first, setFirst] = useState<string>("");
    const [second, setSecond] = useState<string>("");

    useEffect(() => {
        const date = new Date();
        const _first = calcTimeSinceMillis(new Date(props.post?.first_posted.toString() || "").getTime(), date.getTime());
        const _second = calcTimeSinceMillis(new Date(props.post?.last_updated.toString() || "").getTime(), date.getTime());

        setFirst(first);
        setSecond(second);

        (async () => {
            const topic = await fetchTopicPostsAndActivity(props.post?.topic_id || 0);
            setOriginalTopic(topic?.topic);
        })();
    }, [props.post?.topic_id, first, props.post?.first_posted, props.post?.last_updated, second]);

    const lockPost = async (e: BaseSyntheticEvent) => {
        e.preventDefault();

        if ((props.perms & UsergroupFlags.POST_MANAGEMENT) !== UsergroupFlags.POST_MANAGEMENT)
            return;

        const res = await lockPostWithID({ post_id: (props.post?.post_id.toString() || "0") });

        if (res !== undefined) {
            window.location.reload();
        }
    }

    const pinPost = async (e: BaseSyntheticEvent) => {
        e.preventDefault();

        if ((props.perms & UsergroupFlags.POST_MANAGEMENT) !== UsergroupFlags.POST_MANAGEMENT)
            return;

        const res = await pinPostWithID({ post_id: (props.post?.post_id.toString() || "0") });

        if (res !== undefined) {
            window.location.reload();
        }
    }

    const postComment = async (e: BaseSyntheticEvent) => {
        postNotification(commentContent);

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

    const updateOriginalPost = async (e: BaseSyntheticEvent) => {
        e.preventDefault();

        if (props.user?.public_id !== props.author?.public_id) return;

        const res = await updatePost({
            body: edit,
            title: editTitle,
            post_id: props.post?.post_id || 0
        });

        if (res !== undefined) {
            postNotification("Updated post!");
            window.location.reload();
        }
    }

    const _deletePost = async (e: BaseSyntheticEvent) => {
        e.preventDefault();

        if (props.user?.public_id !== props.author?.public_id) return;

        const res = await deletePost({
            "post_id": props.post?.post_id || 0
        });

        if (res !== undefined) {
            postNotification("Deleted post!");
            window.location.href = `/topic/${props.post?.topic_id || 1}`
        }
    }

    return (
        <>
            <header className={style.header}>
                <section>
                    <h1>{props.post?.title}</h1>
                    <section style={{ "display": "flex", "flexDirection": "row", "gap": "1rem", "opacity": "0.5" }}>
                        <span>Posted {first} ago</span>
                        {(first !== second) && <span>(Updated {second} ago)</span>}
                        <div>Posted by <Link href={`/users/${props.author?.public_id}`}>{props.author?.username}</Link></div>
                        {originalTopic !== undefined && <div>Posted to <Link href={`/topic/${props.post?.topic_id}`}>{originalTopic?.name}</Link></div>}
                    </section>
                </section>
                <div style={{"display": "flex", "flexDirection": "column", "alignItems": "flex-end"}}>
                    <section style={{ "display": "flex", "flexDirection": "row" }}>
                        <section className={style.controls}>
                            <section>
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
                            </section>
                            <section>
                                {props.post?.template_allowed && <Link href={`/topic/${props.post?.topic_id}/post?template_id=${props.post?.post_id}`} className={style.control} style={{ "padding": "1rem" }}>Use post as template</Link>}
                            </section>
                        </section>
                    </section>
                </div>
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
                    <div style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "0.5rem" }}>
                        <h2>{props.author?.username}</h2>
                        <span style={{ "color": "rgb(var(--accent))", "pointerEvents": "none" }}>Author</span>
                    </div>
                </Link>
                <div className={style.content} id="mainBody">
                    {editingPost ?
                        <div style={{ "display": "flex", "flexDirection": "column", "gap": "1rem" }}>
                            <label htmlFor="title">Title</label>
                            <input onChange={(e: BaseSyntheticEvent) => setEditTitle(e.target.value)} type="text" name="title" defaultValue={props.post?.title} placeholder="Post Title" />
                            <label htmlFor="title">Body</label>
                            <MDEditor height="25rem" style={{ "width": "100%", "fontSize": "1rem !important" }} value={edit} onChange={(value: string | undefined) => setEdit(value || "")} />
                            <section style={{ "display": "flex", "gap": "1rem" }}>
                                <button style={{ "width": "fit-content" }} onClick={updateOriginalPost}>Update</button>
                                <button style={{ "width": "fit-content" }} onClick={() => {
                                    setEditingPost(false);
                                }}>Cancel</button>
                            </section>
                        </div> :
                        <MarkdownPreview className={style.content} style={{ "backgroundColor": "transparent" }} source={props.post?.body || ""} />
                    }
                    <footer className={style.footer}>
                        {props.user !== undefined &&
                            <>
                                <button onClick={async (e: BaseSyntheticEvent) => {
                                    await voteOnPost({
                                        "postType": "post",
                                        "targetID": props.post?.post_id || 0,
                                        "userID": props.user?.public_id || 0,
                                        "voteType": 1,
                                        "votes": primaryPostVotes
                                    });

                                    setPrimaryPostVotes(old => [...old, {
                                        "post_id": props.post?.post_id || 0,
                                        "type": 1,
                                        "user_id": props.user?.public_id || 0
                                    }])
                                    postNotification("Upvoted post!");
                                }}>
                                    <Image src="/svgs/up.svg" alt="Upvote" sizes="100%" width={0} height={0} style={{
                                        "width": "1rem",
                                        "height": "1rem",
                                        "filter": "invert(1)"
                                    }}></Image>
                                </button>
                                <span>{calcRunningTotalVotes(primaryPostVotes)}</span>
                                <button onClick={async (e: BaseSyntheticEvent) => {
                                    await voteOnPost({
                                        "postType": "post",
                                        "targetID": props.post?.post_id || 0,
                                        "userID": props.user?.public_id || 0,
                                        "voteType": -1,
                                        "votes": primaryPostVotes
                                    });

                                    setPrimaryPostVotes(old => [...old, {
                                        "post_id": props.post?.post_id || 0,
                                        "type": -1,
                                        "user_id": props.user?.public_id || 0
                                    }])
                                    postNotification("Downvoted post!");
                                }}>
                                    <Image src="/svgs/down.svg" alt="Upvote" sizes="100%" width={0} height={0} style={{
                                        "width": "1rem",
                                        "height": "1rem",
                                        "filter": "invert(1)"
                                    }}></Image>
                                </button>
                                {props.user.public_id === props.author?.public_id &&
                                    <button onClick={(e: BaseSyntheticEvent) => {
                                        setEditingPost(!editingPost);
                                        const elm = document.getElementById("mainBody");
                                        if (elm === null) return;
                                        elm.scrollIntoView();
                                    }}>
                                        <Image src="/svgs/pen.svg" alt="Edit" sizes="100%" width={0} height={0} style={{
                                            "width": "1rem",
                                            "height": "1rem",
                                            "filter": "invert(1)"
                                        }}></Image>
                                    </button>
                                }
                                {(props.user.public_id === props.author?.public_id || (props.perms & UsergroupFlags.DELETE_POSTS) === UsergroupFlags.DELETE_POSTS) &&
                                    <button onClick={_deletePost}>
                                        <Image src="/svgs/delete.svg" alt="Edit" sizes="100%" width={0} height={0} style={{
                                            "width": "1rem",
                                            "height": "1rem",
                                            "filter": "invert(1)"
                                        }}></Image>
                                    </button>
                                }
                            </>
                        }
                    </footer>
                </div>
            </main>
            {(props.user !== undefined && !props.post?.closed) &&
                <button onClick={() => {
                    setShowNewComment(!showNewComment);
                    if (showNewComment === true)
                        return;

                    setTimeout(() => {
                        const elm = document.getElementById("newCommentForm");
                        if (elm === null) return;
                        elm.scrollIntoView();
                    }, 250);
                }} style={{ "margin": "1rem 0 0 0" }}>Comment</button>
            }
            <div className={style.comments} style={{ "margin": "1rem 0 0 0" }}>
                {props.post?.comments.map((comment: Comment, index: number) => {
                    return (
                        <Comment perms={props.perms} author={props.author} post={props.post} comment={comment} index={index} key={index} user={props.user}></Comment>
                    );
                })}
            </div>
            {(props.user !== undefined && showNewComment) &&
                <div id="newCommentForm" className={style.body} style={{ "marginTop": "1rem" }}>
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
                        <div style={{ "display": "flex", "flexDirection": "column", "gap": "1rem" }}>
                            <section style={{ "display": "flex", "justifyContent": "space-between" }}>
                                <h2>Comment on {props.author?.username || ""}&apos;s thread</h2>
                                <button style={{ "padding": "1rem" }} onClick={() => {
                                    setShowNewComment(false);
                                }}>X</button>
                            </section>
                            <label htmlFor="content">Comment</label>
                            <MDEditor height="25rem" style={{ "width": "100%", "fontSize": "1rem !important" }} onChange={(value: string | undefined) => setCommentContent(value || "")} value={commentContent}></MDEditor>
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
