import {fetchForumInfo, fetchTopicPostsAndActivity} from "@/api/forum/fetch";
import {FetchTopicPostsResponse, Forum} from "@/api/forum/interfaces";
import {Metadata} from "next";
import TopicPostClient from "./client";
import TopicPostServer from "./server";

type Props = {
    params: { id: string }
}

export const generateMetadata = async ({params}: Props): Promise<Metadata> => {
    const forum: Forum = await fetchForumInfo();
    const topic: FetchTopicPostsResponse | undefined = await fetchTopicPostsAndActivity(Number.parseInt(params.id));

    if (topic === undefined) {
        return {
            title: `New Post - ${forum.community_name}`,
            description: `Create a new post to ${forum.community_name}`
        }
    }

    return {
        title: `New post to ${topic.topic?.name} - ${forum.community_name}`,
        description: `Create a new post to the ${topic.topic?.name} topic`
    } 
}


const TopicPostPage = ({ params }: { params: { id: string } }) => {

    return (
        <>
            <TopicPostClient >
                <TopicPostServer params={params} />
            </TopicPostClient>
        </>
    );
}

export default TopicPostPage;
