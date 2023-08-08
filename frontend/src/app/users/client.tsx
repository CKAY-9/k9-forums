"use client";

import { User } from "@/api/user/interfaces";
import style from "./users.module.scss";
import { useState, useEffect, BaseSyntheticEvent } from "react";
import { Usergroup } from "@/api/admin/usergroup/interface";
import axios from "axios";
import { INTERNAL_API_URL, INTERNAL_CDN_URL } from "@/api/resources";
import Link from "next/link";
import Image from "next/image";

const User = (props: {user: User, me: User}) => {
    const [loadingGroups, setLoadingGroups] = useState<boolean>(true);
    const [groups, setGroups] = useState<Usergroup[]>([]);

    useEffect(() => {
        (async() => {
            if (!loadingGroups) return;
            for (let i = 0; i < props.user.usergroups.length; i++) {
                if (isNaN(Number.parseInt(props.user.usergroups[i]) - 1))
                    continue;

                const req = await axios({
                    "url": INTERNAL_API_URL + "/usergroup/info",
                    "method": "GET",
                    "params": {
                        "usergroup_id": Number.parseInt(props.user.usergroups[i]) - 1
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
        <Link href={`/users/${props.user.public_id === props.me.public_id ? "me" : props.user.public_id}`} className={style.user} style={{"color": "rgb(var(--text))"}}>
            <section style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                <div>
                    <Image src={INTERNAL_CDN_URL + props.user.profile_picture} alt="Profile Picture" sizes="100%" width={0} height={0} style={{
                        "width": "3rem",
                        "height": "3rem",
                        "borderRadius": "50%"
                    }}></Image>
                </div>
                <h1>{props.user.username}</h1>
                <span style={{"opacity": "0.5"}}>{props.user.public_id}</span>
            </section>
            {loadingGroups && <h2>Loading</h2>}
            {!loadingGroups && 
                <div className={style.groups}>
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

const UsersClient = (props: {users: User[] | undefined, me: User}) => {
    const [users, setUsers] = useState<User[]>(props.users || []);
    const [search, setSearch] = useState<string>("");

    return (
        <>  
            <div style={{"display": "flex", "flexDirection": "column", "gap": "1rem"}}>
                <label htmlFor="search">Search</label>
                <input onChange={(e: BaseSyntheticEvent) => setSearch(e.target.value)} type="text" placeholder="Search User by Name/ID" />
                <div className={style.users}>
                    {users.filter((val) => {
                        return (val.username.includes(search) || val.public_id === Number.parseInt(search)) 
                    }).map((value: User, index: number) => {
                        return (
                            <User key={index} me={props.me} user={value}></User>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default UsersClient;
