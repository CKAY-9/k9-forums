import {getCookie} from "@/utils/cookie";
import axios from "axios";
import {INTERNAL_API_URL} from "../resources";

export const createNewDM = async (data: {
    sender_id: number,
    receiver_id: number,
    content: string
}) => {
    try {
        const req = await axios({
            "url": INTERNAL_API_URL + "/messages/create",
            "method": "POST",
            "headers": {
                "Authorization": getCookie("token")
            },
            "data": data
        })
    } catch (ex) {
        return undefined;
    }
}
