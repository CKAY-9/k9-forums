import { Post } from "@/api/forum/interfaces";
import PostPreview from "../../../components/post/post";

export const PostPreviews =  (props: {posts: Post[]}) => {
    return (
        <>
            {props.posts.map((post: Post, index: number) => {
                return (
                    <PostPreview key={index} post={post}></PostPreview>
                );
            })}
        </>
    )
}

const TopicClient = ({children}: any) => {
    return (
        <>
            {children}
        </>
    );
}

export default TopicClient;
