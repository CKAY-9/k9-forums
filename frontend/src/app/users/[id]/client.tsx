"use client";

import { BaseSyntheticEvent, useEffect, useState } from "react";
import style from "./client.module.scss";
import { Comment, Forum, Post } from "@/api/forum/interfaces";
import { PublicUser, UserCommentsResponse, UserPostsResponse } from "@/api/user/interfaces";
import axios, { AxiosResponse } from "axios";
import { INTERNAL_API_URL } from "@/api/resources";
import Link from "next/link";
import Image from "next/image";
import {usePathname, useSearchParams, useRouter} from "next/navigation";
import Loading from "@/components/loading/loading";
import {postNotification} from "@/components/notifications/notification";
import {logout} from "@/components/logout/logout";
import PostPreview from "@/components/post/post";
import CommentPreview from "@/components/comment/comment";

const Posts = (props: { posts: Post[], profile: PublicUser }) => {
    return (
        <>
            {(props.posts.length <= 0 || props.posts === undefined) && <h1>This user hasn&apos;t posted yet!</h1>}
            {props.posts.length >= 1 &&
                <div className={style.posts}>
                    {props.posts.map((post: Post, index: number) => {
                        return (
                            <PostPreview key={index} post={post}></PostPreview>
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
            {props.comments.length <= 0 && <h1>This user hasn&apos;t commented yet!</h1>}
            {props.comments.length >= 1 && 
                <div className={style.comments}>
                    {props.comments.map((comment: Comment, index: number) => {
                        return (
                            <CommentPreview comment={comment} key={index}></CommentPreview>
                        )
                    })}
                </div>
            }
        </>
    );
}

export const ProfileInteraction = (props: { profile: PublicUser, forum: Forum }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const tab = searchParams.get("tab");
    const [posts, setPosts] = useState<Post[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [viewing, setViewing] = useState<number>(0);

    useEffect(() => {
        switch (tab) {
            case "posts":
                setViewing(0);
                document.title = `${props.profile.username}'s Posts - ${props.forum.community_name}`
                break;
            case "comments":
                setViewing(1);
                document.title = `${props.profile.username}'s Comments - ${props.forum.community_name}`
                break;
            case "following":
                setViewing(2);
                document.title = `${props.profile.username}'s Following - ${props.forum.community_name}`
                break;
            case "followers":
                document.title = `${props.profile.username}'s Followers - ${props.forum.community_name}`
                setViewing(3);
                break;
            default: 
                setViewing(0);
                break;   
        }


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

            setLoading(false);
        })();
    }, [props.profile.public_id, tab]);

    if (loading) {
        return (
            <div className={style.container}>
                <Loading message="Loading Profile"></Loading>
            </div>
        )
    }

    return (
        <div className={style.container}>
            <nav className={style.nav}>
                <button onClick={() => {
                    setViewing(0);
                    router.push(pathname + "?tab=posts")
                }}>Posts</button>
                <button onClick={() => {
                    setViewing(1);
                    router.push(pathname + "?tab=comments");
                }}>Comments</button>
                <button onClick={() => {
                    setViewing(2);
                    router.push(pathname + "?tab=following");
                }}>Following</button>
                <button onClick={() => {
                    setViewing(3);
                    router.push(pathname + "?tab=followers");
                }}>Followers</button>
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

export const UserControls = (props: {userID: number}) => {
    return (
        <>
            <Link href="/users/settings">
                <Image src={"/svgs/settings.svg"} alt="Edit Account" sizes="100%" width={0} height={0} style={{
                    "width": "2rem",
                    "height": "2rem",
                    "filter": "invert(1)"
                }}></Image>
            </Link>
            <button onClick={(e: BaseSyntheticEvent) => {
                e.preventDefault();
                navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/users/${props.userID}`);
                postNotification("Copied profile link!");
            }}>
                <Image src={"/svgs/share.svg"} alt="Share Profile" sizes="100%" width={0} height={0} style={{
                    "width": "2rem",
                    "height": "2rem",
                    "filter": "invert(1)"
                }}></Image>
            </button>
            <button onClick={logout}>
                <Image src={"/svgs/logout.svg"} alt="Logout" sizes="100%" width={0} height={0} style={{
                    "width": "2rem",
                    "height": "2rem",
                    "filter": "invert(1)"
                }}></Image>
            </button>
        </>    
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
