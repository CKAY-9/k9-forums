import { fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { UsergroupFlags } from "@/api/admin/usergroup/interface";
import { fetchForumInfo } from "@/api/forum/fetch";
import {Forum} from "@/api/forum/interfaces";
import { fetchPersonalInformation } from "@/api/user/fetch";
import Header from "@/components/header/header";
import {Metadata} from "next";
import Link from "next/link";
import style from "./admin.module.scss";

export const generateMetadata = async (): Promise<Metadata> => {
    const forum: Forum = await fetchForumInfo();

    return {
        title: `Admin Settings - ${forum.community_name}`,
        description: `Admin settings for ${forum.community_name}`
    } 
}

const Admin = async () => {
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

    return (
        <>
            <main className="container">
                <Link href="/">Home</Link>
                <h1>K9 Forums Admin</h1>
                <div className={style.management}>
                    <nav style={{"display": "flex", "flexDirection": "column"}}>
                        <Link href="/admin/forum">Forum Config</Link> 
                        <Link href="/admin/roles">Usergroups</Link>
                        <Link href="/admin/users">Users</Link>
                    </nav>
                </div>
            </main>
        </>
    );
}

export default Admin;
