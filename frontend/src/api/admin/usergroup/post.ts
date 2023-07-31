import { INTERNAL_API_URL } from "@/api/resources"
import { getCookie } from "@/utils/cookie"
import axios, { AxiosResponse } from "axios"
import { UpdateGroupResponse } from "./interface"

export const updateUsergroup = async (data: {
    name: string,
    usergroup_id: number,
    new_usergroup_id: number,
    color: string,
    permissions: number
}) => {
    const req: AxiosResponse<UpdateGroupResponse> = await axios({
        "url": INTERNAL_API_URL + "/usergroup/updateGroup",
        "method": "POST",
        "data": data,
        "headers": {
            "Authorization": getCookie("token")
        }
    });

    return req.data;
}

export const createUsergroup = async (data: {
    name: string,
    color: string,
    permissions: number
}) => {
    const req: AxiosResponse<UpdateGroupResponse> = await axios({
        "url": INTERNAL_API_URL + "/usergroup/createGroup",
        "method": "POST",
        "data": data,
        "headers": {
            "Authorization": getCookie("token")
        }
    });

    return req.data;
}