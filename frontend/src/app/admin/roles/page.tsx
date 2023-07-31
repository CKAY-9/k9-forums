import { fetchAllGroups, fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { Usergroup, UsergroupFlags } from "@/api/admin/usergroup/interface";
import { fetchForumInfo } from "@/api/forum/fetch";
import { fetchPersonalInformation } from "@/api/user/fetch";
import Header from "@/components/header/header";
import style from "../admin.module.scss";

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
            <main className="container">
                <h1>Usergroups</h1>
                <div className={style.usergroups}>
                    {groups?.map((group: Usergroup) => {
                        return (
                            <div className={style.usergroup}>
                                <h2 style={{"color": `#${group.color}`}}>{group.name}</h2>
                                <span>Color: #{group.color}</span>
                                <section className={style.permissions}>
                                    <div>
                                        <h4>View Posts</h4>
                                        {(perms & UsergroupFlags.VIEW_POSTS) == UsergroupFlags.VIEW_POSTS ?
                                            <span>ON</span> : <span>OFF</span>
                                        }
                                    </div>
                                    <div>
                                        <h4>View Comments</h4>
                                        {(perms & UsergroupFlags.VIEW_COMMENTS) == UsergroupFlags.VIEW_COMMENTS ?
                                            <span>ON</span> : <span>OFF</span>
                                        }
                                    </div>
                                    <div>
                                        <h4>View Profiles</h4>
                                        {(perms & UsergroupFlags.VIEW_PROFILES) == UsergroupFlags.VIEW_PROFILES ?
                                            <span>ON</span> : <span>OFF</span>
                                        }
                                    </div>
                                    <div>
                                        <h4>Forum Management</h4>
                                        {(perms & UsergroupFlags.FORUM_MANAGEMENT) == UsergroupFlags.FORUM_MANAGEMENT ?
                                            <span>ON</span> : <span>OFF</span>
                                        }
                                    </div>
                                </section>
                            </div>
                        )
                    })}
                </div>
            </main>
        </>
    );
}

export default RolesPage;