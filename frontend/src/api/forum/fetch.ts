import axios, { AxiosResponse } from "axios"
import { INTERNAL_API_URL } from "../resources"
import { Comment, FetchCategoryTopicsResponse, FetchPostResponse, FetchTopicPostsResponse, Forum, Post } from "./interfaces";

export const fetchForumInfo = async (): Promise<Forum> => {
    const req = await axios({
        "url": INTERNAL_API_URL + "/forum/info",
        "method": "GET"
    });

    return req.data;
}

export const fetchAllComments = async (): Promise<Comment[]> => {
    const req = await axios({
        "url": INTERNAL_API_URL + "/comment/all",
        "method": "GET"
    });

    return req.data.comments;
}

export const fetchAllPosts = async (): Promise<Post[]> => {
    const req = await axios({
        "url": INTERNAL_API_URL + "/post/all",
        "method": "GET"
    });

    return req.data.posts;
}

export const fetchCategoryTopics = async (categoryID: number) => {
    const req: AxiosResponse<FetchCategoryTopicsResponse> = await axios({
        "url": INTERNAL_API_URL + "/topic/category",
        "method": "GET",
        "params": {
            "category_id": categoryID
        }
    });

    return req.data;
}

export const fetchTopicPostsAndActivity = async (topicID: number) => {
    try {
        const req: AxiosResponse<FetchTopicPostsResponse> = await axios({
            "url": INTERNAL_API_URL + "/topic/posts",
            "method": "GET",
            "params": {
                "topic_id": topicID
            }
        });

        return req.data;
    } catch (ex) {
        return undefined;
    }
}

export const fetchPost = async (postID: number) => {
    try {
        const req: AxiosResponse<FetchPostResponse> = await axios({
            "url": INTERNAL_API_URL + "/post/get",
            "method": "GET",
            "params": {
                "post_id": postID
            }
        });

        return req.data;
    } catch (ex) {
        return undefined;
    }
}