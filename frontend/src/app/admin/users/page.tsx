import { fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { Usergroup, UsergroupFlags } from "@/api/admin/usergroup/interface";
import { fetchForumInfo } from "@/api/forum/fetch";
import { INTERNAL_API_URL, INTERNAL_CDN_URL } from "@/api/resources";
import { fetchAllPublicUsers, fetchPersonalInformation } from "@/api/user/fetch";
import { User } from "@/api/user/interfaces";
import Header from "@/components/header/header";
import axios from "axios";
import Link from "next/link";
import style from "./users.module.scss";
import Image from "next/image";
import { AdminUser } from "./client";
import {Metadata} from "next";
import {Forum} from "@/api/forum/interfaces";

export const generateMetadata = async (): Promise<Metadata> => {
    const forum: Forum = await fetchForumInfo();

    return {
        title: `Manage Users - ${forum.community_name}`,
        description: `Manage all users of ${forum.community_name}`
    } 
}

const User = async (props: {user: User}) => {
    const usergroups: Usergroup[] = []

    const _req = await axios({
        "url": INTERNAL_API_URL + "/usergroup/allGroups",
        "method": "GET"
    });

    const allUsergroups: Usergroup[] = _req.data.groups || [];

    for (let i = 0; i < props.user.usergroups.length; i++) {
        if (isNaN(Number.parseInt(props.user.usergroups[i]) - 1))
            continue;

        const req = await axios({
            "url": INTERNAL_API_URL + "/usergroup/info",
            "method": "GET",
            "params": {
                "usergroup_id": Number.parseInt(props.user.usergroups[i]) - 1
            }
        });    

        usergroups.push(req.data.usergroup);
    }
    
    return (
        <AdminUser user={props.user} allUsergroups={allUsergroups} usergroups={usergroups}></AdminUser>
    )
}

const AdminUsers = async () => {
	const user = await fetchPersonalInformation();
	const forum = await fetchForumInfo();
	let perms: number = 0;
	if (user !== undefined) {
		perms = await fetchPermissionLevel(user.usergroups);
	}

    const allUsers = await fetchAllPublicUsers();

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

    return (
        <>
            <main className="container">
                <Link href="/admin">Back</Link>
                <h1>Users</h1>
                <div className={style.users}>
                    {allUsers?.map((user: User, index: number) => {
                        return (
                            <User user={user} key={index}></User>
                        )
                    })}
                </div>
            </main>
        </>
    );
}

export default AdminUsers;
