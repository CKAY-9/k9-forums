import PostClient from "./client";
import PostServer from "./server";

const PostPage = () => {
    return (
        <>
            <PostClient>
                <PostServer />
            </PostClient>
        </>
    );
}

export default PostPage;