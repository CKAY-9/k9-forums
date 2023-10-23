import { fetchAllComments, fetchForumInfo } from "@/api/forum/fetch";
import { Forum } from "@/api/forum/interfaces";
import { fetchPersonalInformation } from "@/api/user/fetch";
import Header from "@/components/header/header";
import { Metadata } from "next";
import AllCommentsClient from "./client";

export const generateMetadata = async (): Promise<Metadata> => {
    const forum: Forum = await fetchForumInfo();

    return {
        "title": `All Comments - ${forum.community_name}`
    }
}

const AllCommentsPage = async () => {
	const user = await fetchPersonalInformation();
	const forum = await fetchForumInfo();
    const comments = await fetchAllComments();

    return (
        <>
            <Header perms={0} user={user} forum={forum}></Header>
            <main className="container">
                <h1>All Comments</h1>
                <AllCommentsClient comments={comments}></AllCommentsClient>
            </main>
        </>
    );
}

export default AllCommentsPage;