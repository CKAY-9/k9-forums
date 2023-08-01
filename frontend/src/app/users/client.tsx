"use client";

import { User } from "@/api/user/interfaces";
import style from "./users.module.scss";
import { useState, useEffect } from "react";
import { Usergroup } from "@/api/admin/usergroup/interface";
import axios from "axios";
import { INTERNAL_API_URL } from "@/api/resources";
import Link from "next/link";

const User = (props: {user: User}) => {
    const [loadingGroups, setLoadingGroups] = useState<boolean>(true);
    const [groups, setGroups] = useState<Usergroup[]>([]);

    useEffect(() => {
        (async() => {
            if (!loadingGroups) return;
            for (let i = 0; i < props.user.usergroups.length; i++) {
                const req = await axios({
                    "url": INTERNAL_API_URL + "/usergroup/info",
                    "method": "GET",
                    "params": {
                        "usergroup_id": Number.parseInt(props.user.usergroups[i])
                    }
                });

                if (req.status === 200) {
                    setGroups(old => [...old, req.data.usergroup]);
                    setLoadingGroups(false);
                }
            }
        })();
    });

    return (
        <Link href={`/users/${props.user.public_id}`} className={style.user} style={{"color": "rgb(var(--text))"}}>
            <h1>{props.user.username}</h1>
            {loadingGroups && <h2>Loading</h2>}
            {!loadingGroups && 
                <div className={style.groups}>
                    <label htmlFor="groups">Usergroups</label>
                    <div className={style.list}>
                        {groups.map((group: Usergroup, index: number) => {
                            return (
                                <div key={index}>
                                    <span style={{"color": `#${group.color}`}}>{group.name}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            }
        </Link>
    );
}

const UsersClient = (props: {users: User[] | undefined}) => {
    return (
        <>
            <div className={style.users}>
                    {props.users?.map((value: User, index: number) => {
                        return (
                            <>
                                <User key={index} user={value}></User>
                            </>
                        );
                    })}
            </div>
        </>
    );
}

export default UsersClient;