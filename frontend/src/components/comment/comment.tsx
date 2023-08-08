"use client";

import {Comment, FetchPostResponse, Post} from "@/api/forum/interfaces";
import {INTERNAL_API_URL, INTERNAL_CDN_URL} from "@/api/resources";
import {PublicUser} from "@/api/user/interfaces";
import axios, {AxiosResponse} from "axios";
import Image from "next/image";
import Link from "next/link";
import MarkdownPreview from "@uiw/react-markdown-preview";
import {useEffect, useState} from "react";
import style from "./comment.module.scss";

const CommentPreview = (props: {comment: Comment}) => {
    const [post, setPost] = useState<Post | undefined>(undefined);
    const [postAuthor, setPostAuthor] = useState<PublicUser | undefined>(undefined);

    useEffect(() => {
        (async() => {
            const p: AxiosResponse<FetchPostResponse> = await axios({
                "url": INTERNAL_API_URL + "/post/get",
                "method": "GET",
                "params": {
                    "post_id": props.comment.post_id
                }
            }); 

            if (p.data.post === undefined) return;

            setPost(p.data.post);

            const a = await axios({
                "url": INTERNAL_API_URL + "/user/public",
                "method": "GET",
                "params": {
                    "public_id": p.data.post.user_id
                }
            }); 

            if (a.data.userData === undefined) return;

            setPostAuthor(a.data.userData);
        })();
    }, [props.comment.post_id]);

    if (post === undefined || postAuthor === undefined) {
        return (
            <div className={style.comment}>
            </div>
        );
    }

    return (
        <Link href={`/post/${props.comment.post_id}`} className={style.comment}>
            <div style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                <h1>{post.title}</h1>
                <span>Posted by <Link href={`/users/${postAuthor.public_id}`}>{postAuthor.username}</Link></span>
                <Image alt="PFP" src={INTERNAL_CDN_URL + postAuthor.profile_picture} sizes="100%" width={0} height={0} style={{
                    "width": "2rem",
                    "height": "2rem",
                    "borderRadius": "50%"
                }}></Image>
            </div>
            <MarkdownPreview source={props.comment.content} style={{"backgroundColor": "transparent"}}></MarkdownPreview>
        </Link>     
    );

}

export default CommentPreview;
