import axios from "axios";
import { INTERNAL_API_URL } from "../resources";
import { getCookie } from "@/utils/cookie";

export const deletePost = async (data: {
    post_id: number
}) => {
    try {
        const req = await axios({
            "url": INTERNAL_API_URL + "/post/delete",
            "method": "DELETE",
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

export const deleteComment = async (data: {
    comment_id: number
}) => {
    try {
        const req = await axios({
            "url": INTERNAL_API_URL + "/post/deleteComment",
            "method": "DELETE",
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
