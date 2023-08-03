import { fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { fetchForumInfo, fetchTopicPostsAndActivity } from "@/api/forum/fetch";
import { Forum } from "@/api/forum/interfaces";
import { fetchPersonalInformation } from "@/api/user/fetch";
import Header from "@/components/header/header"
import style from "../topic.module.scss";
import Link from "next/link";
import { PostPreviews } from "./client";

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
                        <PostPreviews posts={topic.topic.posts}></PostPreviews>
                    </div>
                }
            </main>
        </>
    )
}

export default TopicServer;