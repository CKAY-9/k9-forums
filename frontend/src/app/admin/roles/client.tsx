"use client";

import { Usergroup, UsergroupFlagPretty, usergroupFlagsPretty } from "@/api/admin/usergroup/interface";
import style from "../admin.module.scss";
import { BaseSyntheticEvent, useState } from "react";
import { createUsergroup } from "@/api/admin/usergroup/post";
import { postNotification } from "@/components/notifications/notification";
import Image from "next/image";
import { calcPermissionLevelWithArray, permissionLevelToArray } from "@/api/user/utils.client";
import { updateUsergroup } from "@/api/admin/usergroup/put";
import Checkbox from "@/components/checkbox/checkbox";

const RolesClient = (props: {groups: Usergroup[]}) => {
    const [currentRole, setCurrentRole] = useState<Usergroup>(props.groups[0]);
    const [currentPermissions, setCurrentPermissions] = useState<number[]>(permissionLevelToArray(props.groups[0].permissions) || []);
    const [groups, setGroups] = useState<Usergroup[]>(props.groups);

    const updateRole = async (e: BaseSyntheticEvent) => {
        e.preventDefault();

        if (currentRole === undefined) return;

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
            permissions: calcPermissionLevelWithArray(currentPermissions),
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
                                <button key={index} onClick={() => {
                                    setCurrentPermissions(permissionLevelToArray(group.permissions));
                                    setCurrentRole(group);
                                }} className={style.usergroup} style={{"color": `#${group.color}`}}>
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
                            <label htmlFor="color">Color</label>
                            <input type="color" onChange={(e: BaseSyntheticEvent) => currentRole.color = e.target.value.replace("#", "")} defaultValue={"#" + currentRole.color}></input>
                            <label htmlFor="permLevel">Permission Level</label>
                            <span>{calcPermissionLevelWithArray(currentPermissions)}</span>
                            <label htmlFor="id">Usergroup ID</label>
                            <span>{currentRole.usergroup_id}</span>
                            <h2>Permissions</h2>
                            <div className={style.permissions}>
                                {usergroupFlagsPretty.map((usergroup: UsergroupFlagPretty, index: number) => {
                                    return (
                                        <div key={index} className={style.permission}>
                                            <h4>{usergroup.permission}</h4>
                                            <Checkbox defaultValue={(currentRole.permissions & usergroup.flag) === usergroup.flag} onClick={(checked: boolean) => {
                                                if (checked) {
                                                    setCurrentPermissions(old => [...old, usergroup.flag]);
                                                } else {
                                                    setCurrentPermissions(perms => perms.filter((val) => val !== usergroup.flag));
                                                } 
                                            }} />
                                        </div>
                                    )
                                })}
                            </div>

                            {currentRole.usergroup_id <= -1 ? 
                                <button onClick={createGroup}>Create</button> : 
                                <>
                                    <button onClick={updateRole}>Update</button>
                                    <button>Delete</button>
                                </>
                            }
                        </div>
                    }
            </section>
        </>
    );
}

export default RolesClient;
