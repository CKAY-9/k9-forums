import TopicClient from "./client";
import TopicServer from "./server";

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