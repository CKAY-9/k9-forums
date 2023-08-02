import PostClient from "./client";
import TopicClient from "./client";
import PostServer from "./server";
import TopicServer from "./server";

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