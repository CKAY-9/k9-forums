import { fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { UsergroupFlags } from "@/api/admin/usergroup/interface";
import { fetchForumInfo } from "@/api/forum/fetch";
import { Forum } from "@/api/forum/interfaces";
import { fetchPersonalInformation } from "@/api/user/fetch";
import Header from "@/components/header/header";
import DOMPurify from "dompurify";
import { marked } from "marked";
import AboutClient from "./client";
import type { Metadata } from "next";

export const generateMetadata = async ({params}: any): Promise<Metadata> => {
    const forum: Forum = await fetchForumInfo();

    return {
        title: `${forum.community_name} - About`,
        description: `About ${forum.community_name}: ${forum.about}`
    } 
}

const AboutCommunity = async () => {
	const user = await fetchPersonalInformation();
	const forum: Forum = await fetchForumInfo();
	let perms: number = 0;
	if (user !== undefined) {
		perms = await fetchPermissionLevel(user.usergroups);
	}

	return (
		<>
			<Header forum={forum} user={user} perms={perms}></Header>

            <main className="container">
                <h1>About {forum.community_name}</h1>
				<AboutClient forum={forum}></AboutClient>
            </main>
		</>
	);
}

export default AboutCommunity;
