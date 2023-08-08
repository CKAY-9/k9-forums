import ProflieClient from "./client";
import ProfileServer from "./server";
import type { Metadata, ResolvingMetadata } from "next";
import {PublicUser, PublicUserResponse} from "@/api/user/interfaces";
import {Forum} from "@/api/forum/interfaces";
import {fetchForumInfo} from "@/api/forum/fetch";
import {fetchPublicProflie} from "@/api/user/fetch";

type Props = {
    params: { id: string },
    query: { tab: string }
}

export const generateMetadata = async ({params}: Props, parent: ResolvingMetadata): Promise<Metadata> => {
    const forum: Forum = await fetchForumInfo();
    const id: string = params.id;

    if (params.id === "me") {
        return {
            title: `My Profile - ${forum.community_name}`,
            description: `My Profile on ${forum.community_name}`
        }
    }

    const userData: PublicUser | undefined = await fetchPublicProflie(id);

    if (userData === undefined) {
        return {
            title: `Invalid User - ${forum.community_name}`,
            description: "Couldn't find specified user"
        }
    }

    return {
        title: `${userData.username} - ${forum.community_name}`,
        description: `${userData.username}'s Profile`
    } 
}


const ProfilePage = async ({ params }: { params: { id: string } }) => {
	return (
		<>
			<ProflieClient>
                <ProfileServer params={params}/>
            </ProflieClient>
        </>
    );
}

export default ProfilePage;
