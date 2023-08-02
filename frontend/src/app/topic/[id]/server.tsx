import { fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { fetchForumInfo, fetchTopicPostsAndActivity } from "@/api/forum/fetch";
import { Forum, Post } from "@/api/forum/interfaces";
import { fetchPersonalInformation, fetchPublicProflie } from "@/api/user/fetch";
import Header from "@/components/header/header"
import style from "../topic.module.scss";
import Link from "next/link";
import Image from "next/image";

const TopicServer = async (props: { params: { id: string } }) => {
    const user = await fetchPersonalInformation();
	const forum: Forum = await fetchForumInfo();
	let perms: number = 0;
	if (user !== undefined) {
		perms = await fetchPermissionLevel(user.usergroups);
	}

    const topic = await fetchTopicPostsAndActivity(Number.parseInt(props.params.id));

    if (topic === undefined || topic.topic === undefined) {
        return (
            <>
                <Header forum={forum} user={user} perms={perms}></Header>
                <main className="container">
                    <h1>This topic doesn't exist!</h1>
                </main>
            </>
        )
    }

    for (const post of topic.topic.posts) {
        if (post.pinned) {
            const idx = topic.topic.posts.findIndex(el => el.post_id === post.post_id);
            topic.topic.posts.splice(idx, 1);
            topic.topic.posts.unshift(post);
        }
    }

    return (
        <>
            <Header forum={forum} user={user} perms={perms}></Header>
            <main className="container">
                <div className={style.topicHeader}>
                    <section className={style.title}>
                        <h1>{topic.topic?.name}</h1>
                        <p>{topic.topic?.about}</p>
                    </section>
                    <section className={style.actions}>
                        <Link href={`/topic/${topic.topic?.topic_id}/post`}>Post</Link>
                        <button>Subscribe</button>
                    </section>
                </div>
                {(topic.topic === undefined || topic.topic.posts.length <= 0) && <h1>There are no posts in this topic!</h1>}
                {(topic.topic !== undefined && topic.topic.posts.length >= 1) && 
                    <div className={style.posts}>
                        {topic.topic.posts.map(async (post: Post, index: number) => {
                            const publicUser = await fetchPublicProflie(post.user_id?.toString() || "0");

                            return (
                                <Link href={`/post/${post.post_id}`} className={style.post}>
                                    <div style={{"display": "flex", "justifyContent": "space-between"}}>
                                        <h1>{post.title}</h1>
                                        <section>
                                            <button style={{"padding": "1rem"}}>
                                                <Image src={"/svgs/pin.svg"} alt="Pinned" sizes="100%" width={0} height={0} style={{
                                                    "width": "1.5rem",
                                                    "height": "1.5rem",
                                                    "filter": "invert(1)",
                                                    "opacity": post.pinned ? "1" : "0.5"
                                                }}></Image>
                                            </button>
                                            <button style={{"padding": "1rem"}}>
                                                <Image src={"/svgs/closed.svg"} alt="Locked" sizes="100%" width={0} height={0} style={{
                                                    "width": "1.5rem",
                                                    "height": "1.5rem",
                                                    "filter": "invert(1)",
                                                    "opacity": post.closed ? "1" : "0.5"
                                                }}></Image>
                                            </button>
                                        </section>
                                    </div>
                                    <h3>Posted by <Link href={`/users/me`}>{publicUser?.username}</Link></h3>
                                    <span>Posted {new Date(post.first_posted).toLocaleDateString()}</span>
                                    <span style={{"marginLeft": "1rem"}}>Updated {new Date(post.last_updated).toLocaleDateString()}</span>
                                </Link>
                            )
                        })}
                    </div>
                }
            </main>
        </>
    )
}

export default TopicServer;