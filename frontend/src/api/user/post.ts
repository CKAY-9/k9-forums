import axios, { AxiosResponse } from "axios"
import { INTERNAL_API_URL } from "../resources"
import { getCookie } from "@/utils/cookie"
import { UpdateUserProfileResponse } from "./interfaces"

export const updateUserProfile = async (data: {
    username: string,
    bio: string,
    pfp: string
}) => {
    try {
        const req: AxiosResponse<UpdateUserProfileResponse> = await axios({
            "url": INTERNAL_API_URL + "/user/update",
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