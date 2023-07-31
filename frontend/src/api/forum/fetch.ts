import axios from "axios"
import { INTERNAL_API_URL } from "../resources"

export const fetchForumInfo = async () => {
    const req = await axios({
        "url": INTERNAL_API_URL + "/forum/info",
        "method": "GET"
    });

    return req.data;
}