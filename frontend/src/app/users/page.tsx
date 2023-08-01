import { fetchAllGroups, fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { fetchForumInfo } from "@/api/forum/fetch";
import { Forum } from "@/api/forum/interfaces";
import { fetchAllPublicUsers, fetchPersonalInformation } from "@/api/user/fetch";
import Header from "@/components/header/header";
import style from "./users.module.scss";
import { User } from "@/api/user/interfaces";
import UsersClient from "./client";

const UsersPage = async () => {
	const user = await fetchPersonalInformation();
	const forum: Forum = await fetchForumInfo();
	let perms: number = 0;
	if (user !== undefined) {
		perms = await fetchPermissionLevel(user.usergroups);
	}

    const users = await fetchAllPublicUsers();

	return (
		<>
			<Header forum={forum} user={user} perms={perms}></Header>
			<main className="container">
                <h1>All Users</h1>
                <UsersClient me={user} users={users}></UsersClient>
            </main>
        </>
    );
}

export default UsersPage;