import {fetchForumInfo} from "@/api/forum/fetch";
import {Forum} from "@/api/forum/interfaces";
import { Metadata, NextPage } from "next";
import { ForumHolder } from "./client"
import ForumServer from "./server"

export const generateMetadata = async (): Promise<Metadata> => {
    const forum: Forum = await fetchForumInfo();

    return {
        title: `Forum Config - ${forum.community_name}`,
        description: `Manage the forum config for ${forum.community_name}`
    } 
}

export const ForumPage: NextPage = () => {
    return (
        <>
            <ForumHolder>
                <ForumServer />
            </ForumHolder>
        </>
    )
}

export default ForumPage;
