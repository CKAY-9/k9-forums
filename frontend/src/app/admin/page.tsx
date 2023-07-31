import { fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { UsergroupFlags } from "@/api/admin/usergroup/interface";
import { fetchForumInfo } from "@/api/forum/fetch";
import { fetchPersonalInformation } from "@/api/user/fetch";
import Header from "@/components/header/header";
import Link from "next/link";

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
                <h1>K9 Forums Admin</h1>
                <nav style={{"display": "flex", "flexDirection": "column"}}>
                    <Link href="/admin/forum">Forum Config</Link> 
                    <Link href="/admin/roles">Usergroups</Link>
                </nav>
            </main>
        </>
    );
}

export default Admin;