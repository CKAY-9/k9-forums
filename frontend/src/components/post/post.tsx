"use client";

import {fetchPost} from "@/api/forum/fetch";
import {Post} from "@/api/forum/interfaces";
import {INTERNAL_API_URL, INTERNAL_CDN_URL} from "@/api/resources";
import {PublicUser, PublicUserResponse} from "@/api/user/interfaces";
import {calcTimeSinceMillis} from "@/utils/time";
import axios, {AxiosResponse} from "axios";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import style from "./post.module.scss";

const PostPreview = (props: {post: Post}) => {
    const post = props.post
    const [author, setAuthor] = useState<PublicUser>();
    const [postFull, setPostFull] = useState<Post>();

    useEffect(() => {
        (async() => {
            const tempAuthor: AxiosResponse<PublicUserResponse> = await axios({
                "url": INTERNAL_API_URL + "/user/public",
                "method": "GET",
                "params": {
                    "public_id": post.user_id
                }
            });

            const tempPost = await fetchPost(post.post_id);
            setAuthor(tempAuthor.data.userData);
            setPostFull(tempPost?.post);
        })();
    }, [post.post_id, post.user_id]);

    if (postFull === undefined || author === undefined) {
        return (
            <></>
        )
    }

    return (
        <Link href={"/posts/" + post.post_id} className={style.post}>
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
                    <Image src={INTERNAL_CDN_URL + author?.profile_picture} alt="Profile Picture" sizes="100%" width={0} height={0} style={{
                        "width": "3rem",
                        "height": "3rem",
                        "borderRadius": "50%"
                    }}></Image>
                </div>
                <h3>{author?.username}</h3>
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
            </section>
        </Link>
    )
}

export default PostPreview;
