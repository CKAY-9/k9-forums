import {fetchForumInfo, fetchPost} from "@/api/forum/fetch";
import {FetchPostResponse, Forum, Post} from "@/api/forum/interfaces";
import {Metadata} from "next";
import PostClient from "./client";
import TopicClient from "./client";
import PostServer from "./server";
import TopicServer from "./server";

type Props = {
    params: { id: string }
}

export const generateMetadata = async ({params}: Props): Promise<Metadata> => {
    const forum: Forum = await fetchForumInfo();
    const post: FetchPostResponse | undefined = await fetchPost(Number.parseInt(params.id));

    if (post === undefined) {
        return {
            title: `Unknown Post - ${forum.community_name}`,
            description: `View a post on ${forum.community_name}`
        }
    }

    return {
        title: `${post.post?.title} - ${forum.community_name}`,
        description: `Body: ${post.post?.body}`
    } 
}

const PostPage = ({ params }: { params: { id: string } }) => {
    return (
        <>
            <PostClient>
                <PostServer params={params} />
            </PostClient>
        </>
    );
}

export default PostPage;
