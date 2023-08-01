import { INTERNAL_API_URL } from "@/api/resources"
import axios, { AxiosResponse } from "axios"
import { NewCategoryResponse } from "./interface";
import { getCookie } from "@/utils/cookie";

export const createNewForumCategory = async (data: {
    name: string,
    color: string,
    about: string
}) => {
    const req: AxiosResponse<NewCategoryResponse> = await axios({
        "url": INTERNAL_API_URL + "/category/create",
        "method": "POST",
        "data": data,
        "headers": {
            "Authorization": getCookie("token")
        }
    });

    return req.data;
}

export const updateForumCategory = async (data: {
    name: string,
    color: string,
    about: string,
    category_id: number
}) => {
    const req: AxiosResponse<NewCategoryResponse> = await axios({
        "url": INTERNAL_API_URL + "/category/update",
        "method": "POST",
        "data": data,
        "headers": {
            "Authorization": getCookie("token")
        }
    });

    return req.data;
}