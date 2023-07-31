"use client";

import { Usergroup, UsergroupFlagPretty, usergroupFlagsPretty } from "@/api/admin/usergroup/interface";
import style from "../admin.module.scss";
import { BaseSyntheticEvent, useState } from "react";
import { createUsergroup, updateUsergroup } from "@/api/admin/usergroup/post";
import { postNotification } from "@/components/notifications/notification";
import Image from "next/image";

const RolesClient = (props: {groups: Usergroup[]}) => {
    const [currentRole, setCurrentRole] = useState<Usergroup>(props.groups[0]);
    const [groups, setGroups] = useState<Usergroup[]>(props.groups);

    const updateRole = async (e: BaseSyntheticEvent) => {
        e.preventDefault();

        if (currentRole === undefined) return;
        console.log(currentRole);

        const res = await updateUsergroup({
            color: currentRole.color,
            name: currentRole.name,
            permissions: currentRole.permissions,
            usergroup_id: currentRole.usergroup_id,
            new_usergroup_id: currentRole.usergroup_id
        });

        if (res.group !== undefined) {
            setCurrentRole(res.group);
            postNotification(`Updated ${res.group.name} usergroup`, 5, () => {});
        }
    }
    
    const createGroup = async (e: BaseSyntheticEvent) => {
        const res = await createUsergroup({
            color: currentRole.color,
            name: currentRole.name,
            permissions: currentRole.permissions,
        });

        if (res.group !== undefined) {
            setCurrentRole(res.group);
            postNotification(`Created ${res.group.name} usergroup`, 5, () => {});
        }
    }

    return (
        <>
            <section className={style.management}>
                    <nav className={style.usergroups}>
                        <button className={style.usergroup} onClick={() => {
                            const newGroup: Usergroup = {
                                color: "FFFFFF",
                                name: "New Usergroup",
                                permissions: 0,
                                usergroup_id: -1
                            }

                            setCurrentRole(newGroup);
                            setGroups(old => [...old, newGroup]);
                        }}>
                            <div style={{"position": "relative"}}>
                                <Image src="/svgs/plus.svg" alt="New Usergroup" sizes="100%" width={0} height={0} style={{
                                    "width": "1.5rem",
                                    "height": "1.5rem",
                                    "filter": "invert(1)"
                                }}></Image>
                            </div>
                        </button>
                        {groups?.map((group: Usergroup, index: number) => {
                            return (
                                <button key={index} onClick={() => setCurrentRole(group)} className={style.usergroup} style={{"color": `#${group.color}`}}>
                                    {group.name}
                                </button>
                            )
                        })}
                    </nav>
                    {currentRole === undefined ? 
                        <h1>No role selected!</h1> : 
                        <div className={style.roleManagement}>
                            <label htmlFor="name">Usergroup Name</label>
                            <input onChange={(e: BaseSyntheticEvent) => currentRole.name = e.target.value} className={style.groupName} type="text" name="usergroupName" placeholder="Usergroup name" defaultValue={currentRole.name} style={{"color": `#${currentRole.color}`}} />
                            <label htmlFor="permLevel">Permission Level</label>
                            <span>{currentRole.permissions}</span>
                            <label htmlFor="id">Usergroup ID</label>
                            <span>{currentRole.usergroup_id}</span>
                            <h2>Permissions</h2>
                            <div className={style.permissions}>
                                {usergroupFlagsPretty.map((usergroup: UsergroupFlagPretty, index: number) => {
                                    return (
                                        <div key={index} className={style.permission}>
                                            <h4>{usergroup.permission}</h4>
                                            <input onClick={(e: BaseSyntheticEvent) => {
                                                if (e.target.checked) {
                                                    setCurrentRole({
                                                        name: currentRole.name,
                                                        color: currentRole.color,
                                                        permissions: currentRole.permissions + usergroup.flag,
                                                        usergroup_id: currentRole.usergroup_id
                                                    });
                                                } else {
                                                    setCurrentRole({
                                                        name: currentRole.name,
                                                        color: currentRole.color,
                                                        permissions: currentRole.permissions - usergroup.flag,
                                                        usergroup_id: currentRole.usergroup_id
                                                    })
                                                }
                                                console.log(currentRole.permissions);
                                            }} type="checkbox" name="enabled" defaultChecked={(currentRole.permissions & usergroup.flag) === usergroup.flag} />
                                        </div>
                                    )
                                })}
                            </div>

                            {currentRole.usergroup_id == -1 ? <button onClick={createGroup}>Create</button> : <button onClick={updateRole}>Update</button>}
                        </div>
                    }
            </section>
        </>
    );
}

export default RolesClient;