import { getCookie } from "@/utils/cookie";
import { INTERNAL_API_URL } from "../resources";
import axios from "axios";

export const updateComment = async (data: {
    content: string,
    comment_id: number
}) => {
    try {
        const req = await axios({
            "url": INTERNAL_API_URL + "/post/updateComment",
            "method": "PUT",
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
            "method": "PUT",
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

export const lockPostWithID = async (data: {
    post_id: string
}) => {
    try {
        const req = await axios({
            "url": INTERNAL_API_URL + "/post/lock",
            "method": "PUT",
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

export const updatePost = async (data: {
    title: string,
    body: string,
    post_id: number,
}) => {
    try {
        const req = await axios({
            "url": INTERNAL_API_URL + "/post/update",
            "method": "PUT",
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