"use client";

import Link from "next/link";
import style from "./users.module.scss";
import Image from "next/image";
import { INTERNAL_API_URL, INTERNAL_CDN_URL } from "@/api/resources";
import { PublicUser, User } from "@/api/user/interfaces";
import { Usergroup } from "@/api/admin/usergroup/interface";
import {BaseSyntheticEvent, useState} from "react";
import axios from "../../../../node_modules/axios/index";
import {getCookie} from "@/utils/cookie";

export const AdminUser = (props: {user: User, usergroups: Usergroup[], allUsergroups: Usergroup[]}) => {
    const [groups, setGroups] = useState<Usergroup[]>(props.usergroups || []);

    const addGroup = async (e: BaseSyntheticEvent) => {
        const groupID = e.target.value;
        for (let i = 0; i < props.allUsergroups.length; i++) {
            if (props.allUsergroups[i].usergroup_id === Number.parseInt(groupID)) {
                setGroups(old => [...old, props.allUsergroups[i]]);
                break;
            }
        }

        const res = await axios({
            "url": INTERNAL_API_URL + "/user/addUsergroup",
            "method": "PUT",
            "data": {
                "user_id": props.user.public_id,
                "usergroup_id": groupID
            },
            "headers": {
                "Authorization": getCookie("token")
            }
        });
    } 

    const removeGroup = async (e: BaseSyntheticEvent, groupID: number) => {
        setGroups(groups.filter((group) => group.usergroup_id !== groupID));

        const res = await axios({
            "url": INTERNAL_API_URL + "/user/removeUsergroup",
            "method": "PUT",
            "data": {
                "user_id": props.user.public_id,
                "usergroup_id": groupID
            },
            "headers": {
                "Authorization": getCookie("token")
            }

        });

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
                <h2 style={{"color": "white"}}>{props.user.username}</h2>
                <span style={{"opacity": "0.5", "color": "white"}}>{props.user.public_id}</span>
            </Link>
            <div className={style.usergroups}>
                {groups.map((usergroup: Usergroup, index: number) => {
                    return (
                        <div key={index} className={style.usergroup}>
                            <div style={{"width": "1rem", "height": "1rem", "borderRadius": "50%", "backgroundColor": `#${usergroup.color}`}}></div>
                            <span className={style.name}>{usergroup.name}</span>
                            <button className={style.remove} onClick={(e: BaseSyntheticEvent) => removeGroup(e, usergroup.usergroup_id)}>X</button>
                        </div>
                    );
                })}
            </div>
            <label>Add usergroup</label>
            <select onChange={addGroup}>
                <option value={""}></option>
                {props.allUsergroups.map((usergroup: Usergroup, index: number) => {
                    return (
                        <option key={index} value={usergroup.usergroup_id}>{usergroup.name}</option>
                    );
                })}
            </select>
        </div>
    )
}
