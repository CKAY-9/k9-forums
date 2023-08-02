import { fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { fetchForumInfo } from "@/api/forum/fetch";
import { Forum } from "@/api/forum/interfaces";
import { fetchPersonalInformation } from "@/api/user/fetch";
import Header from "@/components/header/header";
import style from "./settings.module.scss";
import Image from "next/image";
import { INTERNAL_CDN_URL } from "@/api/resources";
import { UpdateForm } from "./client";

const UserSettingsServer = async () => {
    const user = await fetchPersonalInformation();
	const forum: Forum = await fetchForumInfo();
	let perms: number = 0;
    if (user === undefined) {
        window.location.href = "/login";
        return;
    }
    
	perms = await fetchPermissionLevel(user.usergroups);

    return (
        <>
            <Header perms={perms} forum={forum} user={user}></Header>
            <main className="container">
                <h1>Account Settings</h1>
                <UpdateForm user={user}></UpdateForm>
            </main>
        </>
    );
}

export default UserSettingsServer;