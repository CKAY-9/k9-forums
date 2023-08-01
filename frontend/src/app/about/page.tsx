import { fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { UsergroupFlags } from "@/api/admin/usergroup/interface";
import { fetchForumInfo } from "@/api/forum/fetch";
import { Forum } from "@/api/forum/interfaces";
import { fetchPersonalInformation } from "@/api/user/fetch";
import Header from "@/components/header/header";

const AboutCommunity = async () => {
	const user = await fetchPersonalInformation();
	const forum: Forum = await fetchForumInfo();
	let perms: number = 0;
	if (user !== undefined) {
		perms = await fetchPermissionLevel(user.usergroups);
	}

    // TODO: Parse markdown

	return (
		<>
			<Header forum={forum} user={user} perms={perms}></Header>

            <main className="container">
                <h1>About {forum.community_name}</h1>
                <p>{forum.about}</p>
            </main>
		</>
	);
}

export default AboutCommunity;