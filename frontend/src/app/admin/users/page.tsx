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

const User = async (props: {user: User}) => {
    const usergroups: Usergroup[] = []

    const _req = await axios({
        "url": INTERNAL_API_URL + "/usergroup/allGroups",
        "method": "GET"
    });

    const allUsergroups: Usergroup[] = _req.data.groups || [];

    for (let i = 0; i < props.user.usergroups.length; i++) {
        console.log(props.user.usergroups[i]);

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
        <div className={style.user}>
            <Link href={`/users/${props.user.public_id}`} style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                <div>
                    <Image src={INTERNAL_CDN_URL + props.user.profile_picture} alt="Profile Picture" sizes="100%" width={0} height={0} style={{
                        "width": "2rem",
                        "height": "2rem",
                        "borderRadius": "50%"
                    }}></Image>
                </div>
                <h2>{props.user.username}</h2>
            </Link>
            {usergroups.map((usergroup: Usergroup, index: number) => {
                return (
                    <select className={style.usergroup}>
                        <option value={`remove${index}`}></option>
                        <option selected={true} style={{"color": `#${usergroup.color}`}} value={`keep${index}`}>{usergroup.name}</option>
                    </select>
                );
            })}
            <select className={style.usergroup}>
                <option value={``}></option>
                {allUsergroups.map((usergroup: Usergroup, index: number) => {
                    return (
                        <option value={usergroup.usergroup_id}>{usergroup.name}</option>
                    );
                })}
            </select>
        </div>
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