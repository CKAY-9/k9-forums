import { fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { fetchForumInfo, fetchPost } from "@/api/forum/fetch";
import { Forum } from "@/api/forum/interfaces";
import { fetchPersonalInformation, fetchPublicProflie } from "@/api/user/fetch";
import Header from "@/components/header/header"
import { PostInteraction } from "./client";
import { PublicUser } from "@/api/user/interfaces";
import { calcTimeSinceMillis } from "@/utils/time";

const PostServer = async (props: { params: { id: string } }) => {
    const user = await fetchPersonalInformation();
	const forum: Forum = await fetchForumInfo();
	let perms: number = 0;
	if (user !== undefined) {
		perms = await fetchPermissionLevel(user.usergroups);
	}

    const post = await fetchPost(Number.parseInt(props.params.id));

    if (post === undefined || post === null) {
        return (
            <>
                <Header forum={forum} user={user} perms={perms}></Header>
                <main className="container">
                    <h1>This post doesn&apos;t exist!</h1>
                </main>
            </>
        )
    }

    let author: PublicUser | undefined = await fetchPublicProflie(post.post?.user_id?.toString() || "0");

    if (author === undefined) {
        return (
            <>
                <Header forum={forum} user={user} perms={perms}></Header>
                <main className="container">
                    <h1>This post doesn&apos;t exist!</h1>
                </main>
            </>
        )
    }

    for (const comment of (post.post?.comments || [])) {
        const tempUser = await fetchPublicProflie((comment.user_id.toString() || "0"));
        if (tempUser === undefined) continue;

        comment.user = tempUser;
        comment.posted_at = new Date(comment.posted_at);
    }

    return (
        <>
            <Header forum={forum} user={user} perms={perms}></Header>
            <main className="container">
                <PostInteraction perms={perms} author={author} post={post.post} user={user}></PostInteraction>
            </main>
        </>
    )
}

export default PostServer;