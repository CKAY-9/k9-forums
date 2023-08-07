"use client";
import { Forum } from "@/api/forum/interfaces";
import Image from "next/image";
import { INTERNAL_CDN_URL } from "@/api/resources";
import { useState, BaseSyntheticEvent } from "react";
import { postNotification } from "@/components/notifications/notification";
import { uploadFile } from "@/api/cdn/post";
import dynamic from "next/dynamic";
import { updateForumInformation } from "@/api/admin/config/put";


const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
);
  

const Information = (props: {forum: Forum}) => {
    const [logo, setLogo] = useState<string>(props.forum.community_logo || "");
    const [name, setName] = useState<string>(props.forum.community_name || "");
    const [motd, setMOTD] = useState<string>(props.forum.motd || "");
    const [about, setAbout] = useState<string>(props.forum.about || "");
    const [logoFile, setLogoFile] = useState<File | undefined>(undefined);

    const updateInformation = async (e: BaseSyntheticEvent) => {
        e.preventDefault();
        const res = await updateForumInformation({
            "name": name,
            "about": about,
            "logo": logo,
            "motd": motd
        });

        if (res !== undefined) {
            postNotification("Updated forum information!");
            window.location.reload();
        }
    }

    const clearLogo = async (e: BaseSyntheticEvent) => {
        e.preventDefault();
        setLogo("");
        const destInput: HTMLInputElement = document.getElementById("destInput") as HTMLInputElement;
        if (destInput === null) return;
        destInput.value = "";
    }

    const uploadLogo = async (e: BaseSyntheticEvent) => {
        e.preventDefault();

        const newLogoDest = await uploadFile(logoFile, {
            "folder_id": "forum",
            "previous_file_dest": props.forum.community_logo || ""
        });

        if (newLogoDest !== undefined) {
            setLogo(newLogoDest.dest);
            const destInput: HTMLInputElement = document.getElementById("destInput") as HTMLInputElement;
            if (destInput === null) return;
            destInput.value = newLogoDest.dest;
        } else {
            postNotification("Error uploading file!");
        }
    }

    return (
        <div style={{"display": "flex", "flexDirection": "column", "gap": "1rem"}}>
            <h1>Information</h1>

            <label htmlFor="name">Current Logo</label>
            <div>
                <Image src={INTERNAL_CDN_URL + logo} alt="Logo" sizes="100%" width={0} height={0} style={{
                    "width": "10rem",
                    "height": "10rem",
                    "borderRadius": "50%"
                }}></Image>
            </div>
            <input style={{"fontSize": "1rem", "pointerEvents": "none"}} type="text" placeholder="Community Logo" id="destInput" defaultValue={props.forum.community_logo || ""} />
            
            <label htmlFor="new icon">Upload Logo</label>
            <section style={{"display": "flex", "gap": "1rem"}}>
                <input onChange={(e: BaseSyntheticEvent) => setLogoFile(e.target.files[0])} type="file" name="logo" />
                <button onClick={uploadLogo}>Upload</button>
                <button onClick={clearLogo}>Clear</button>
            </section>

            <label htmlFor="name">Community Name</label>
            <input onChange={(e: BaseSyntheticEvent) => setName(e.target.value)} style={{"fontSize": "1rem"}} type="text" placeholder="Community Name" defaultValue={props.forum.community_name || ""} />

            <label htmlFor="about">Community Bio</label>
            <MDEditor height="25rem" style={{"width": "100%"}} onChange={(value: string | undefined) => setAbout(value || "")} value={about}></MDEditor>
    
            <label>MOTD</label>
            <MDEditor height="25rem" style={{"width": "100%"}} onChange={(value: string | undefined) => setMOTD(value || "")} value={motd}></MDEditor>

            <button onClick={updateInformation}>Update</button>
        </div>
    );
}

export default Information;
