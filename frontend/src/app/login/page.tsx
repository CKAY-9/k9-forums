import LoginClient from "./client";
import { fetchForumInfo } from "@/api/forum/fetch";
import {Forum} from "@/api/forum/interfaces";
import {Metadata} from "next";

export const generateMetadata = async (): Promise<Metadata> => {
    const forum: Forum = await fetchForumInfo();

    return {
        title: `Login - ${forum.community_name}`,
        description: `Login to your account at ${forum.community_name}`
    } 
}

const LoginServer = async () => {
    const forum = await fetchForumInfo();

    return (
        <>
            <LoginClient forum={forum}></LoginClient>
        </>
    );
}

export default LoginServer;
