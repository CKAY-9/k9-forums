import TopicPostClient from "./client";
import TopicPostServer from "./server";

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