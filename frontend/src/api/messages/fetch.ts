import axios, { AxiosResponse } from "axios";
import { INTERNAL_API_URL } from "../resources";
import { getCookie } from "@/utils/cookie";
import { ChatHistoryResponse } from "./interfaces";

export const fetchChatHistory = async () => {
    try {
        const req: AxiosResponse<ChatHistoryResponse> = await axios({
            "url": INTERNAL_API_URL + "/messages/history",
            "method": "GET",
            "headers": {
                "Authorization": getCookie("token")
            }
        });

        return req.data;
    } catch (ex) {
        return undefined;
    }
}