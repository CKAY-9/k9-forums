import { INTERNAL_API_URL } from "@/api/resources"
import axios, { AxiosResponse } from "axios"
import { AllGroupsResponse } from "./interface";

export const fetchPermissionLevel = async (usergroups: string[]): Promise<number> => {
    let combinedLevel = 0;
    for (let i = 0; i < usergroups.length; i++) {
        try {
            const req = await axios({
                "url": INTERNAL_API_URL + "/usergroup/permissions",
                "method": "GET",
                "params": {
                    "usergroup_id": Number.parseInt(usergroups[i])
                }
            });
    
            if (combinedLevel > req.data.permissions) continue;
            combinedLevel = req.data.permissions
        } catch (ex) {
            if (combinedLevel >= (0x10 | 0x11 | 0x12 | 0x20 | 0x21)) continue;
            combinedLevel = (0x10 | 0x11 | 0x12 | 0x20 | 0x21);
        }
    }
    return combinedLevel;
}

export const fetchAllGroups = async () => {
    try {
        const req: AxiosResponse<AllGroupsResponse> = await axios({
            "url": INTERNAL_API_URL + "/usergroup/allGroups",
            "method": "GET",
        });

        return req.data.groups
    } catch (ex) {
        return undefined;
    }
}