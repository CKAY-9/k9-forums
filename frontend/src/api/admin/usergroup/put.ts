import { INTERNAL_API_URL } from "@/api/resources";
import axios, { AxiosResponse } from "axios";
import { UpdateGroupResponse } from "./interface";
import { getCookie } from "@/utils/cookie";

export const updateUsergroup = async (data: {
    name: string,
    usergroup_id: number,
    new_usergroup_id: number,
    color: string,
    permissions: number
}) => {
    const req: AxiosResponse<UpdateGroupResponse> = await axios({
        "url": INTERNAL_API_URL + "/usergroup/updateGroup",
        "method": "PUT",
        "data": data,
        "headers": {
            "Authorization": getCookie("token")
        }
    });

    return req.data;
}
