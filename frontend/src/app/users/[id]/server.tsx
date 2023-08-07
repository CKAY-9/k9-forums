import { fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { fetchForumInfo } from "@/api/forum/fetch";
import { Forum } from "@/api/forum/interfaces";
import { INTERNAL_API_URL, INTERNAL_CDN_URL } from "@/api/resources";
import { fetchPersonalInformation, fetchPublicProflie } from "@/api/user/fetch";
import Header from "@/components/header/header";
import axios from "axios";
import Image from "next/image";
import style from "./profile.module.scss";
import Link from "next/link";
import { calcTimeSinceMillis } from "@/utils/time";
import { Logout } from "@/components/logout/logout";
import { ProfileInteraction } from "./client";

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

    if (userData === undefined) {
        return (
            <>
                <Header forum={forum} user={user} perms={perms}></Header>
                <main className="container">
                    <h1>This user doesn&apos;t exist!</h1>
                </main>
            </>
        )
    }

    const groupsFinished = [];

    for (const group in userData.usergroups) {
        try {
            const req = await axios({
                "url": INTERNAL_API_URL + "/usergroup/info",
                "method": "GET",
                "params": {
                    "usergroup_id": Number.parseInt(group) - 1
                }
            });

            groupsFinished.push(req.data.usergroup);
        } catch (ex) {
            console.error()
        }
    }

	return (
		<>
			<Header forum={forum} user={user} perms={perms}></Header>
			<main className={style.container} style={{"backgroundColor": "rgb(var(--800))"}}>
                <div className={style.userInfo}>
                    {user?.profile_picture !== "" && 
                        <div>
                            <Image src={INTERNAL_CDN_URL + userData?.profile_picture} alt="New Usergroup" sizes="100%" width={0} height={0} style={{
                                "width": "10rem",
                                "height": "10rem",
                                "borderRadius": "50%"
                            }}></Image>
                        </div>
                    }
                    <h1>{userData.username}</h1>
                    <span>{userData.profile_bio}</span>
                    <div style={{"display": "flex", "gap": "1rem", "flexWrap": "wrap"}}>
                        {groupsFinished.map((value: any, index: number) => {
                            return (
                                <div key={index} style={{"color": `#${value.color}`, "padding": "1rem 0"}}>
                                    {value.name}
                                </div>
                            )
                        })}
                    </div>
                    <span>Reputation: {userData.reputation}</span>
                    <br/>
                    <span>Joined {new Date(userData.time_created).toLocaleDateString()}</span>
                    <br/>
                    <span>Last seen {calcTimeSinceMillis(new Date(userData.last_online).getTime(), new Date().getTime())} ago</span>

                    {(user !== undefined && user.public_id === userData.public_id) && 
                        <div className={style.controls}>
                            <Link href="/users/settings">Edit Account</Link>
                            <Logout></Logout>
                        </div>
                    }
                </div>
                <div style={{"marginLeft": "1rem", "width": "100%"}}>
                    <ProfileInteraction profile={userData}></ProfileInteraction>
                </div>
            </main>
        </>
    );
}

export default ProfileServer;
