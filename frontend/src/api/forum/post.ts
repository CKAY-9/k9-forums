import axios, { AxiosResponse } from "axios"
import { INTERNAL_API_URL } from "../resources"
import { getCookie } from "@/utils/cookie"
import { CreatePostResponse, NewCommentResponse, Vote } from "./interfaces"

export const createNewPost = async (data: {
    title: string,
    body: string,
    topic_id: string,
    user_id: string,
    template_allowed: boolean
}) => {
    try {
        const req: AxiosResponse<CreatePostResponse> = await axios({
            "url": INTERNAL_API_URL + "/post/create",
            "method": "POST",
            "data": data,
            "headers": {
                "Authorization": getCookie("token")
            }
        });

        return req.data;
    } catch (ex) {
        return undefined;
    }
}

export const postCommentUnderPost = async (data: {
    post_id: string,
    user_id: string,
    content: string
}) => {
    try {
        const req: AxiosResponse<NewCommentResponse> = await axios({
            "url": INTERNAL_API_URL + "/post/comment",
            "method": "POST",
            "data": data,
            "headers": {
                "Authorization": getCookie("token")
            }
        });

        return req.data;
    } catch (ex) {
        return undefined;
    }
}

export const voteOnPost = async (data: {
    postType: "comment" | "post", 
    voteType: -1 | 0 | 1
    targetID: number,
    userID: number,
    votes: Vote[]
}) => {
    try {
        const req = await axios({
            "url": INTERNAL_API_URL + "/vote/" + data.postType,
            "method": "POST",
            "data": {
                "target_id": data.targetID,
                "user_id": data.userID,
                "type": data.voteType
            },
            "headers": {
                "Authorization": getCookie("token")
            }
        });

        return req.data;
    } catch (ex) {
        return undefined;
    }
}