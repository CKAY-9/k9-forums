import TopicClient from "./client";
import TopicServer from "./server";
import type { Metadata } from "next";
import {FetchTopicPostsResponse, Forum, Topic} from "@/api/forum/interfaces";
import {fetchForumInfo, fetchTopicPostsAndActivity} from "@/api/forum/fetch";
import {INTERNAL_CDN_URL} from "@/api/resources";

type Props = {
    params: { id: string }
}

export const generateMetadata = async ({params}: Props): Promise<Metadata> => {
    const forum: Forum = await fetchForumInfo();
    const topic: FetchTopicPostsResponse | undefined = await fetchTopicPostsAndActivity(Number.parseInt(params.id));

    if (topic === undefined) {
        return {
            title: `Topic - ${forum.community_name}`,
            description: "Unable to find specified topic"
        }
    }

    return {
        title: `${topic.topic?.name} - ${forum.community_name}`,
        description: `Topic: ${topic.topic?.name}. About: ${topic.topic?.about}. Posts: ${topic.topic?.posts.length}`,
    } 
}


const TopicPage = ({ params }: { params: { id: string } }) => {
    return (
        <>
            <TopicClient>
                <TopicServer params={params} />
            </TopicClient>
        </>
    );
}

export default TopicPage;
