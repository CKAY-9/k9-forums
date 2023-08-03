import { fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { fetchForumInfo, fetchTopicPostsAndActivity } from "@/api/forum/fetch";
import { Forum } from "@/api/forum/interfaces";
import { fetchPersonalInformation } from "@/api/user/fetch";
import Header from "@/components/header/header"
import { NewPostCreation } from "./client";
import { UsergroupFlags } from "@/api/admin/usergroup/interface";

const TopicPostServer = async (props: { 
    params: { id: string }
}) => {
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
        );
    }

    if ((perms & UsergroupFlags.POST) !== UsergroupFlags.POST) {
        return (
            <>
                <Header forum={forum} user={user} perms={perms}></Header>
                <main className="container">
                    <h1>You aren't allowed to make posts!</h1>
                </main>  
            </>
        );
    }

    return (
        <>
            <Header forum={forum} user={user} perms={perms}></Header>
            <main className="container">
               <NewPostCreation perms={perms} user={user} topic={topic.topic} forum={forum}></NewPostCreation>
            </main>
        </>
    );
}

export default TopicPostServer;