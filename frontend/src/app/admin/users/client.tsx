import Link from "next/link";
import style from "./users.module.scss";
import Image from "next/image";
import { INTERNAL_CDN_URL } from "@/api/resources";
import { PublicUser, User } from "@/api/user/interfaces";
import { Usergroup } from "@/api/admin/usergroup/interface";

export const AdminUser = (props: {user: User, usergroups: Usergroup[], allUsergroups: Usergroup[]}) => {
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
                <h2 style={{"color": "white"}}>{props.user.username}</h2>
                <span style={{"opacity": "0.5", "color": "white"}}>{props.user.public_id}</span>
            </Link>
            {props.usergroups.map((usergroup: Usergroup, index: number) => {
                return (
                    <>
                    </>
                );
            })}
            {props.allUsergroups.map((usergroup: Usergroup, index: number) => {
                return (
                    <>
                    </>
                );
            })}
        </div>
    )
}