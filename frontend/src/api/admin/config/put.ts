import { INTERNAL_API_URL } from "@/api/resources";
import { getCookie } from "@/utils/cookie";
import axios, { AxiosResponse } from "axios";
import { NewCategoryResponse, UpdateForumResponse } from "./interface";

export const updateForumCategory = async (data: {
    name: string,
    color: string,
    about: string,
    category_id: number
}) => {
    const req: AxiosResponse<NewCategoryResponse> = await axios({
        "url": INTERNAL_API_URL + "/category/update",
        "method": "PUT",
        "data": data,
        "headers": {
            "Authorization": getCookie("token")
        }
    });

    return req.data;
}

export const updateForumInformation = async (data: {
    name: string,
    about: string,
    logo: string
}) => {
    try {
        const req: AxiosResponse<UpdateForumResponse> = await axios({
            "url": INTERNAL_API_URL + "/forum/update",
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