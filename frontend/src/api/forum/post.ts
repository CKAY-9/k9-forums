import axios, { AxiosResponse } from "axios"
import { INTERNAL_API_URL } from "../resources"
import { getCookie } from "@/utils/cookie"
import { CreatePostResponse, NewCommentResponse } from "./interfaces"

export const createNewPost = async (data: {
    title: string,
    body: string,
    topic_id: string,
    user_id: string
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

export const pinPostWithID = async (data: {
    post_id: string
}) => {
    try {
        const req = await axios({
            "url": INTERNAL_API_URL + "/post/pin",
            "method": "POST",
            "data": data,
            "headers": {
                "Authorization": getCookie("token")
            }
        });

        return req.data
    } catch (ex) {
        return undefined;
    }
}


export const lockPostWithID = async (data: {
    post_id: string
}) => {
    try {
        const req = await axios({
            "url": INTERNAL_API_URL + "/post/lock",
            "method": "POST",
            "data": data,
            "headers": {
                "Authorization": getCookie("token")
            }
        });

        return req.data
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

        return req.data
    } catch (ex) {
        return undefined;
    }
}