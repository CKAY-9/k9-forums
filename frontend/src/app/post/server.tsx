import { fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { fetchAllPosts, fetchForumInfo } from "@/api/forum/fetch";
import { Forum, Post } from "@/api/forum/interfaces";
import { fetchPersonalInformation } from "@/api/user/fetch";
import Header from "@/components/header/header";
import { Posts } from "./client";

const PostServer = async () => {
    const user = await fetchPersonalInformation();
    const forum: Forum = await fetchForumInfo();
    let perms: number = 0;
    if (user !== undefined) {
        perms = await fetchPermissionLevel(user.usergroups);
    }

    const posts: Post[] = await fetchAllPosts();

    return (
        <>
            <Header user={user} forum={forum} perms={perms}></Header>
            <main className="container">
                <h1>All Posts</h1>
                <Posts posts={posts}></Posts>
            </main>
        </>
    );
}

export default PostServer;
