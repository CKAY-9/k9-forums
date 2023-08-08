import PostClient from "./client";
import PostServer from "./server";
import type { Metadata } from "next";
import {Forum} from "@/api/forum/interfaces";
import {fetchForumInfo} from "@/api/forum/fetch";

export const generateMetadata = async (): Promise<Metadata> => {
    const forum: Forum = await fetchForumInfo();

    return {
        title: `All Posts - ${forum.community_name}`,
        description: `${forum.community_name}'s All Posts`
    } 
}

const PostPage = () => {
    return (
        <>
            <PostClient>
                <PostServer />
            </PostClient>
        </>
    );
}

export default PostPage;
