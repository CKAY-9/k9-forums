import axios, { AxiosResponse } from "axios";
import { INTERNAL_API_URL } from "../resources";
import { getCookie } from "@/utils/cookie";
import { ChatHistoryResponse } from "./interfaces";
import {getUserToken} from "../user/utils.server";

export const fetchChatHistory = async () => {
    const token = getUserToken("");

    try {
        const req: AxiosResponse<ChatHistoryResponse> = await axios({
            "url": INTERNAL_API_URL + "/messages/me",
            "method": "GET",
            "headers": {
                "Authorization": token
            }
        });

        return req.data;
    } catch (ex) {
        return undefined;
    }
}
