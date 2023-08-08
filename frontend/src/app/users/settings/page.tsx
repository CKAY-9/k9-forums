import UserSettingsClient from "./client"
import UserSettingsServer from "./server"
import type { Metadata } from "next";
import {Forum} from "@/api/forum/interfaces";
import {fetchForumInfo} from "@/api/forum/fetch";

export const generateMetadata = async ({params}: any): Promise<Metadata> => {
    const forum: Forum = await fetchForumInfo();

    return {
        title: `Account Settings - ${forum.community_name}`,
        description: `Edit your account profile and settings`
    } 
}

const UserSettingsPage = () => {
    return (
        <>
            <UserSettingsClient>
                <UserSettingsServer />
            </UserSettingsClient>
        </>
    );
}

export default UserSettingsPage;
