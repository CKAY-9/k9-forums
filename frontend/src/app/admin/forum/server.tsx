import { fetchAllGroups, fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { UsergroupFlags } from "@/api/admin/usergroup/interface";
import { fetchForumInfo } from "@/api/forum/fetch";
import { fetchPersonalInformation } from "@/api/user/fetch";
import Header from "@/components/header/header";
import Link from "next/link";
import ForumClient from "./client";
import { fetchAllTopics } from "@/api/admin/config/fetch";

const ForumServer = async () => {
	const user = await fetchPersonalInformation();
	const forum = await fetchForumInfo();
	let perms: number = 0;
	if (user !== undefined) {
		perms = await fetchPermissionLevel(user.usergroups);
	}

    if ((perms & UsergroupFlags.FORUM_MANAGEMENT) !== UsergroupFlags.FORUM_MANAGEMENT) {
        return (
            <>
                <Header user={user} forum={forum} perms={perms}></Header>
                <main className="container">
                    <h1>Invalid Permissions!</h1>
                </main>
            </>
        )
    }

    const groups = await fetchAllGroups();
    const topics = await fetchAllTopics();

    return (
        <>
            <title>Forum Management - K9 Forums</title>
            <main className="container">
                <Link href="/admin">Back</Link>
                <h1>Forum Config</h1>
                <ForumClient topics={topics} user={user} forum={forum} groups={groups}></ForumClient>
            </main>
        </>
    );
}

export default ForumServer;