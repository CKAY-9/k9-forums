import { fetchAllGroups, fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { Usergroup, UsergroupFlagPretty, UsergroupFlags, usergroupFlagsPretty } from "@/api/admin/usergroup/interface";
import { fetchForumInfo } from "@/api/forum/fetch";
import { fetchPersonalInformation } from "@/api/user/fetch";
import Header from "@/components/header/header";
import style from "../admin.module.scss";
import RolesClient from "./client";
import Link from "next/link";

const RolesPage = async () => {
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

    return (
        <>
            <title>Usergroup Management - K9 Forums</title>
            <main className="container">
                <Link href="/admin">Back</Link>
                <h1>Usergroups</h1>
                <RolesClient groups={groups}></RolesClient>
            </main>
        </>
    );
}

export default RolesPage;