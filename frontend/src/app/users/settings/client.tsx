"use client";

import { User } from "@/api/user/interfaces";
import style from "./settings.module.scss";
import Image from "next/image";
import { INTERNAL_CDN_URL } from "@/api/resources";
import { BaseSyntheticEvent, useState } from "react";
import { postNotification } from "@/components/notifications/notification";
import { uploadFile } from "@/api/cdn/post";
import { updateUserProfile } from "@/api/user/post";

export const UpdateForm = (props: {user: User}) => {
    const [name, setName] = useState<string>(props.user.username);
    const [bio, setBio] = useState<string>(props.user.profile_bio);
    const [pfp, setPFP] = useState<string>(props.user.profile_picture);
    const [newPFP, setNewPFP] = useState<File>();
 
    const uploadNewPFP = async (e: BaseSyntheticEvent) => {
        e.preventDefault();

        const newPFPDest = await uploadFile(newPFP, {
            "folder_id": props.user.public_id.toString(),
            "previous_file_dest": props.user.profile_picture || ""
        });

        if (newPFPDest !== undefined) {
            setPFP(newPFPDest.dest);
            const destInput: HTMLInputElement = document.getElementById("destInput") as HTMLInputElement;
            if (destInput === null) return;
            destInput.value = newPFPDest.dest;
        } else {
            postNotification("Error uploading file!");
        }
    }

    const updateProfile = async (e: BaseSyntheticEvent) => {
        e.preventDefault();

        const res = await updateUserProfile({
            "username": name,
            "bio": bio,
            "pfp": pfp
        });

        if (res !== undefined) {
            postNotification("Updated profile!");
        }
    }

    return (
        <>
            <form onSubmit={updateProfile} className={style.form}>
                <section>
                    <label htmlFor="username">Username</label>
                    <input onChange={(e: BaseSyntheticEvent) => setName(e.target.value)} type="text" name="username" defaultValue={name} />
                </section>
                <section>
                    <label htmlFor="bio">Profile Bio</label>
                    <input onChange={(e: BaseSyntheticEvent) => setBio(e.target.value)} type="text" name="bio" defaultValue={bio} />
                </section>
                <section>
                    <label htmlFor="picture">Profile Picture</label>
                    <div style={{ "position": "relative" }}>
                        <Image src={INTERNAL_CDN_URL + pfp} alt="Profile Picture" sizes="100%" width={0} height={0} style={{
                            "width": "10rem",
                            "height": "10rem",
                            "borderRadius": "50%"
                        }}></Image>
                    </div>
                    <div style={{ "display": "flex", "gap": "1rem" }}>
                        <input onChange={(e: BaseSyntheticEvent) => setNewPFP(e.target.files[0])}  type="file" name="newPicture" />
                        <button onClick={uploadNewPFP}>Upload</button>
                    </div>
                </section>
                <section>
                    <input type="submit" value="Update" />
                </section>
            </form>
        </>
    )
}

const UserSettingsClient = ({ children }: any) => {
    return (
        <>
            {children}
        </>
    );
}

export default UserSettingsClient;