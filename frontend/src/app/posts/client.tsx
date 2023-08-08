"use client";

import style from "./post.module.scss";
import { Post } from "@/api/forum/interfaces";
import {BaseSyntheticEvent, useEffect, useState} from "react";
import PostPreview from "@/components/post/post";

export const Posts = (props: {posts: Post[]}) => {
    const [search, setSearch] = useState<string>("");
    const [posts, setPosts] = useState<Post[]>(props.posts || []);

    useEffect(() => {
        if (search === "" || search.length <= 0) {
            setPosts(props.posts);
        }
    }, [search]);

    return (
        <div style={{"display": "flex", "flexDirection": "column", "gap": "1rem"}}>
            <label htmlFor="search">Search</label>
            <input onChange={(e: BaseSyntheticEvent) => {
                setSearch(e.target.value);
                setPosts(posts.filter((post: Post, index: number) => {
                    return post.title.includes(e.target.value) || post.post_id === Number.parseInt(search);
                }));
            }} type="text" placeholder="Search Post by Name/ID" />
            <div className={style.posts}>
                {posts.map((post: Post, index: number) => {
                    return (
                        <PostPreview key={index} post={post}></PostPreview>
                    )
                })}
            </div>
        </div>
    )
}

const PostClient = ({ children }: any) => {
    return (
        <>
            {children}
        </>
    );
}

export default PostClient;
