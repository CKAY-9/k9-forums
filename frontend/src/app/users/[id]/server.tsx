import { fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { fetchForumInfo } from "@/api/forum/fetch";
import { Forum } from "@/api/forum/interfaces";
import { INTERNAL_API_URL } from "@/api/resources";
import { fetchPersonalInformation, fetchPublicProflie } from "@/api/user/fetch";
import Header from "@/components/header/header";
import axios from "axios";

const ProfileServer = async (props: { params: { id: string } }) => {
	const user = await fetchPersonalInformation();
	const forum: Forum = await fetchForumInfo();
	let perms: number = 0;
	if (user !== undefined) {
		perms = await fetchPermissionLevel(user.usergroups);
	}

    let userData;
    if (props.params.id === "me") {
        userData = user;
    } else {
        userData = await fetchPublicProflie(props.params.id);
    }

    const groupsFinished = [];

    for (const group in userData.usergroups) {
        const req = await axios({
            "url": INTERNAL_API_URL + "/usergroup/info",
            "method": "GET",
            "params": {
                "usergroup_id": group
            }
        });

        groupsFinished.push(req.data.usergroup);
    }

	return (
		<>
			<Header forum={forum} user={user} perms={perms}></Header>
			<main className="container">
                <h1>{userData.username}</h1>
                <span>{userData.profile_bio}</span>
                <div style={{"display": "flex", "gap": "1rem"}}>
                    {groupsFinished.map((value: any, index: number) => {
                        return (
                            <div style={{"color": `#${value.color}`, "padding": "1rem 0"}}>
                                {value.name}
                            </div>
                        )
                    })}
                </div>
            </main>
        </>
    );
}

export default ProfileServer;