import { fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { fetchForumInfo, fetchTopicPostsAndActivity } from "@/api/forum/fetch";
import { Forum } from "@/api/forum/interfaces";
import { fetchPersonalInformation } from "@/api/user/fetch";
import Header from "@/components/header/header"
import style from "../topic.module.scss";

const TopicServer = async (props: { params: { id: string } }) => {
    const user = await fetchPersonalInformation();
	const forum: Forum = await fetchForumInfo();
	let perms: number = 0;
	if (user !== undefined) {
		perms = await fetchPermissionLevel(user.usergroups);
	}

    const topic = await fetchTopicPostsAndActivity(Number.parseInt(props.params.id));

    if (topic === undefined) {
        return (
            <>
                <Header forum={forum} user={user} perms={perms}></Header>
                <main className="container">
                    <h1>This topic doesn't exist!</h1>
                </main>
            </>
        )
    }

    return (
        <>
            <Header forum={forum} user={user} perms={perms}></Header>
            <main className="container">
                <div className={style.topicHeader}>
                    <h1>{topic.topic?.name}</h1>
                    <p>{topic.topic?.about}</p>
                </div>
                {(topic.topic === undefined || topic.topic.posts.length <= 0) && <h1>There are no posts in this topic!</h1>}
            </main>
        </>
    )
}

export default TopicServer;