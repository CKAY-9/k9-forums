"use client";

import { Forum, Topic } from "@/api/forum/interfaces";
import { User } from "@/api/user/interfaces";
import style from "./post.module.scss";
import Link from "next/link";
import { BaseSyntheticEvent, useState } from "react";
import { postNotification } from "@/components/notifications/notification";
import { createNewPost } from "@/api/forum/post";

export const NewPostCreation = (props: {topic: Topic | undefined, user: User | undefined, forum: Forum}) => {
    const [title, setTitle] = useState<string>("");
    const [body, setBody] = useState<string>("");

    const post = async (e: BaseSyntheticEvent) => {
        e.preventDefault();
        postNotification("Posting new post with title " + title);

        if (props.user === undefined || props.topic === undefined) return;

        const res = await createNewPost({
            title: title,
            body: body,
            user_id: props.user.public_id.toString(),
            topic_id: props.topic.topic_id.toString()
        });

        if (res !== undefined) {
            postNotification("Posted new post with title " + title);
            window.location.href = `/post/${res.post_id}`;
            return;
        }

        postNotification("Failed to create new post");
    }

    return (
        <>
            <Link href={`/topic/${props.topic?.topic_id}`}>Back</Link>
            <h1>Make a post to {props.topic?.name}</h1>
            <form onSubmit={post} className={style.form}>
                <label htmlFor="title">Post Title</label>
                <input onChange={(e: BaseSyntheticEvent) => setTitle(e.target.value)} type="text" name="title" placeholder="Post Title" />
                <label htmlFor="body">Body</label>
                <textarea onChange={(e: BaseSyntheticEvent) => setBody(e.target.value)} name="body" cols={60} rows={10}></textarea>
                <input type="submit" value="Post" />
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