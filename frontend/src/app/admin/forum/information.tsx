"use client";
import { Forum } from "@/api/forum/interfaces";
import categories from "./categories.module.scss";
import Image from "next/image";

const Information = (props: {forum: Forum}) => {
    return (
        <div style={{"display": "flex", "flexDirection": "column", "gap": "1rem"}}>
            <h1>Forum Information</h1>
            <label htmlFor="name">Community Name</label>
            <input type="text" placeholder="Community Name" defaultValue={props.forum.community_name || ""} />
            <label htmlFor="name">Community Logo</label>
            <input type="text" placeholder="Community Logo" defaultValue={props.forum.community_logo || ""} />
            <label htmlFor="new icon">Upload Logo</label>
            <input type="file" name="" id="" />
        </div>
    );
}

export default Information;