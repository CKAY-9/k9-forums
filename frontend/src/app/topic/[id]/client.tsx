

import { Post } from "@/api/forum/interfaces";
import { fetchPublicProflie } from "@/api/user/fetch";
import style from "../topic.module.scss";
import Link from "next/link";
import Image from "next/image";
import { INTERNAL_CDN_URL } from "@/api/resources";
import { calcTimeSinceMillis } from "@/utils/time";
import { fetchPost } from "@/api/forum/fetch";

const PostPreview = async (props: {post: Post}) => {
    const author = await fetchPublicProflie(props.post.user_id?.toString() || "");
    const postFull = await fetchPost(props.post.post_id);

    return (
        <Link href={"/post/" + props.post.post_id} className={style.post}>
            <section style={{"display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "1rem"}}>
                <h1>{props.post.title === "" ? "no title available" : props.post.title}</h1>
                <section style={{"display": "flex", "gap": "1rem"}}>
                    <div>
                        <Image src={"/svgs/pin.svg"} alt="Profile Picture" sizes="100%" width={0} height={0} style={{
                            "width": "2rem",
                            "height": "2rem",
                            "filter": "invert(1)",
                            "opacity": props.post.pinned ? "1" : "0.5"
                        }}></Image>
                    </div>
                    <div>
                        <Image src={"/svgs/closed.svg"} alt="Profile Picture" sizes="100%" width={0} height={0} style={{
                            "width": "2rem",
                            "height": "2rem",
                            "filter": "invert(1)",
                            "opacity": props.post.closed ? "1" : "0.5"
                        }}></Image>
                    </div>
                </section>
            </section>
            <section style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                <div>
                    <Image src={INTERNAL_CDN_URL + author?.profile_picture} alt="Profile Picture" sizes="100%" width={0} height={0} style={{
                        "width": "3rem",
                        "height": "3rem",
                        "borderRadius": "50%"
                    }}></Image>
                </div>
                <h3>{author?.username}</h3>
            </section>
            <section style={{"display": "flex", "marginTop": "0.5rem", "alignItems": "center", "gap": "1rem", "opacity": "0.5"}}>
                <span>Posted {calcTimeSinceMillis(new Date(props.post.first_posted).getTime(), new Date().getTime())} ago</span>
                {props.post.first_posted !== props.post.last_updated && <span>Activity {calcTimeSinceMillis(new Date(props.post.last_updated).getTime(), new Date().getTime())} ago</span>}
                <section style={{"display": "flex", "justifyContent": "center", "gap": "0.5rem"}}>
                <span>{postFull === undefined ? 0 : postFull.post?.comments.length}</span>
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
    );
}

export const PostPreviews =  (props: {posts: Post[]}) => {
    return (
        <>
            {props.posts.map((post: Post, index: number) => {
                return (
                    <>
                        <PostPreview post={post}></PostPreview>
                    </>
                );
            })}
        </>
    )
}

const TopicClient = ({children}: any) => {
    return (
        <>
            {children}
        </>
    );
}

export default TopicClient;