"use client";

import style from "./post.module.scss";
import Link from "next/link";
import Image from "next/image";
import { INTERNAL_API_URL, INTERNAL_CDN_URL } from "@/api/resources";
import { Post } from "@/api/forum/interfaces";
import { fetchPublicProflie } from "@/api/user/fetch";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { PublicUser, PublicUserResponse } from "@/api/user/interfaces";
import { fetchPost } from "@/api/forum/fetch";
import { calcTimeSinceMillis } from "@/utils/time";
import axios, { AxiosResponse } from "axios";

export const Posts = (props: {posts: Post[]}) => {
    const [search, setSearch] = useState<string>("");
    const [posts, setPosts] = useState<Post[]>(props.posts || []);

    return (
        <div style={{"display": "flex", "flexDirection": "column", "gap": "1rem"}}>
            <label htmlFor="search">Search</label>
            <input onChange={(e: BaseSyntheticEvent) => setSearch(e.target.value)} type="text" placeholder="Search User by Name/ID" />
            <div className={style.posts}>
                {posts.map((post: Post, index: number) => {
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
                    }, []);

                    if (!post.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())) {
                        return (
                            <>
                            </>
                        );
                    }

                    if (postFull === undefined || author === undefined) {
                        return (
                            <></>
                        )
                    }

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