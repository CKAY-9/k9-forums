import { INTERNAL_API_URL } from "@/api/resources"
import axios, { AxiosResponse } from "axios"
import { AllTopicsResponse } from "./interface";

export const fetchAllTopics = async () => {
    const req: AxiosResponse<AllTopicsResponse> = await axios({
        "url": INTERNAL_API_URL + "/topic/all",
        "method": "GET"
    });

    return req.data.topics;
}