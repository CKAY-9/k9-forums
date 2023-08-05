"use client";

import { Forum, Topic } from "@/api/forum/interfaces";
import { User } from "@/api/user/interfaces";
import style from "./post.module.scss";
import Link from "next/link";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { postNotification } from "@/components/notifications/notification";
import { createNewPost } from "@/api/forum/post";
import { useSearchParams } from "next/navigation";
import { fetchPost } from "@/api/forum/fetch";
import MDEditor from "@uiw/react-md-editor";
import { UsergroupFlags } from "@/api/admin/usergroup/interface";

export const NewPostCreation = (props: {
    topic: Topic | undefined, 
    user: User | undefined, 
    forum: Forum,
    perms: number
}) => {
    const searchParams = useSearchParams();
    const templateID = searchParams.get("template_id");

    const [title, setTitle] = useState<string>("");
    const [body, setBody] = useState<string>("");
    const [templateAllowed, setTemplateAllowed] = useState<boolean>(false);

    const post = async (e: BaseSyntheticEvent) => {
        e.preventDefault();
        postNotification("Posting new post with title " + title);

        if (props.user === undefined || props.topic === undefined) return;

        const res = await createNewPost({
            title: title,
            body: body,
            user_id: props.user.public_id.toString(),
            topic_id: props.topic.topic_id.toString(),
            template_allowed: templateAllowed
        });

        if (res !== undefined) {
            postNotification("Posted new post with title " + title);
            window.location.href = `/post/${res.post_id}`;
            return;
        }

        postNotification("Failed to create new post");
    }

    useEffect(() => {
        (async() => {
            if (body !== "" || title !== "")
                return;
                
            const templateRequest = await fetchPost(Number.parseInt(templateID || "0") || 0);

            if (templateRequest === undefined || templateRequest.post === undefined)
                return;

            if (!templateRequest.post.template_allowed) {
                postNotification("This post isn't allowed to be used as a template!");
                return;
            }

            setBody(templateRequest.post.body);
            setTitle(templateRequest.post.title);
        })();
    }, [body, templateID, title])

    return (
        <>
            <Link href={`/topic/${props.topic?.topic_id}`}>Back</Link>
            <h1>Make a post to {props.topic?.name}</h1>
            <form onSubmit={post} className={style.form}>
                <label htmlFor="title">Post Title</label>
                <input style={{"width": "100%", "paddingRight": "-1rem"}} defaultValue={title} onChange={(e: BaseSyntheticEvent) => setTitle(e.target.value)} type="text" name="title" id="title" placeholder="Post Title" />
                <label htmlFor="body">Body</label>
                <MDEditor height="25rem" style={{"width": "100%", "fontSize": "1rem !important"}} onChange={(value: string | undefined) => setBody(value || "")} value={body}></MDEditor>
                <label htmlFor="otherOptions">Extra Options</label>
                <section style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                    <section style={{"display": "flex", "alignItems": "center", "gap": "0.5rem"}}>
                        <label htmlFor="templateUsage">Allow Template Usage</label>
                        <input onChange={(e: BaseSyntheticEvent) => setTemplateAllowed(e.target.checked)} type="checkbox" name="templateUsage" defaultChecked={false} />
                    </section>
                    {(props.perms & UsergroupFlags.POST_MANAGEMENT) === UsergroupFlags.POST_MANAGEMENT &&
                        <>
                            <section style={{"display": "flex", "alignItems": "center", "gap": "0.5rem"}}>
                                <label htmlFor="lockPost">Lock Post</label>
                                <input type="checkbox" name="lockPost" defaultChecked={false} />
                            </section>
                            <section style={{"display": "flex", "alignItems": "center", "gap": "0.5rem"}}>
                                <label htmlFor="pinPost">Pin Post</label>
                                <input type="checkbox" name="pinPost" defaultChecked={false} />
                            </section>
                        </>
                    }
                </section>
                <input style={{"fontSize": "1rem"}} type="submit" value="Post" />
            </form>
        </>
    );
}

const TopicPostClient = ({children}: any) => {
    return (
        <>
            {children}
        </>
    );
}

export default TopicPostClient;