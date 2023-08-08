import { fetchAllGroups, fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { Usergroup, UsergroupFlags } from "@/api/admin/usergroup/interface";
import { fetchForumInfo } from "@/api/forum/fetch";
import { Forum } from "@/api/forum/interfaces";
import { fetchPersonalInformation } from "@/api/user/fetch";
import Header from "@/components/header/header";
import style from "./groups.module.scss";
import type { Metadata } from "next";

export const generateMetadata = async ({params}: any): Promise<Metadata> => {
    const forum: Forum = await fetchForumInfo();

    return {
        title: `Usergroups - ${forum.community_name}`,
        description: `${forum.community_name}'s Usergroups`
    } 
}

const UsergroupsPage = async () => {
	const user = await fetchPersonalInformation();
	const forum: Forum = await fetchForumInfo();
	let perms: number = 0;
	if (user !== undefined) {
		perms = await fetchPermissionLevel(user.usergroups);
	}

    const groups = await fetchAllGroups();

	return (
		<>
			<Header forum={forum} user={user} perms={perms}></Header>
			<main className="container">
                <h1>Usergroups</h1>
                <div className={style.usergroups}>
                    {groups?.map((value: Usergroup, index: number) => {
                        return (
                            <div key={index} className={style.usergroup}>
                                <h1 style={{"color": `#${value.color}`}}>{value.name}</h1>
                                <span>Usergroup ID: {value.usergroup_id}</span>
                                <span>Permission Level: {value.permissions}</span>
                            </div>
                        );
                    })}
                </div>
            </main>
        </>
    );
}

export default UsergroupsPage;
