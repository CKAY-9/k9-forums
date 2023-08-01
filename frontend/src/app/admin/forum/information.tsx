"use client";
import { Forum } from "@/api/forum/interfaces";
import categories from "./categories.module.scss";
import Image from "next/image";
import { INTERNAL_CDN_URL } from "@/api/resources";

const Information = (props: {forum: Forum}) => {
    return (
        <div style={{"display": "flex", "flexDirection": "column", "gap": "1rem"}}>
            <h1>Information</h1>
            <label htmlFor="name">Community Name</label>
            <input type="text" placeholder="Community Name" defaultValue={props.forum.community_name || ""} />
            <label htmlFor="name">Community Logo</label>
            <div>
                <Image src={INTERNAL_CDN_URL + props.forum.community_logo} alt="New Usergroup" sizes="100%" width={0} height={0} style={{
                    "width": "10rem",
                    "height": "10rem",
                    "borderRadius": "50%"
                }}></Image>
            </div>
            <input type="text" placeholder="Community Logo" defaultValue={props.forum.community_logo || ""} />
            <label htmlFor="new icon">Upload Logo</label>
            <input type="file" name="" id="" />
        </div>
    );
}

export default Information;