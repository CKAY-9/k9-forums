import { fetchForumInfo } from "@/api/forum/fetch";
import {Forum} from "@/api/forum/interfaces";
import {Metadata} from "next";
import RegisterClient from "./client";

export const generateMetadata = async (): Promise<Metadata> => {
    const forum: Forum = await fetchForumInfo();

    return {
        title: `Register - ${forum.community_name}`,
        description: `Register for an account at ${forum.community_name}`
    } 
}

const RegisterServer = async () => {
    const forum = await fetchForumInfo();

    return (
        <>
            <RegisterClient forum={forum}></RegisterClient>
        </>
    );
}

export default RegisterServer;
