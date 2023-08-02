import axios, { AxiosResponse } from "axios"
import { INTERNAL_API_URL } from "../resources"
import { AllUsersResponse, PersonalInformationResponse, PublicUserResponse, User } from "./interfaces";
import { getUserToken } from "./utils.server";

export const fetchPersonalInformation = async (manualToken: string = ""): Promise<User | undefined> => {
    let token = getUserToken(manualToken);

    try {
        const req: AxiosResponse<PersonalInformationResponse> = await axios({
            "url": INTERNAL_API_URL + "/user/personal",
            "method": "GET",
            "headers": {
                "Authorization": token
            }
        });
    
        return req.data.user;
    } catch (ex: any) {
        return undefined;
    }
}

export const fetchAllPublicUsers = async (manualToken: string = ""): Promise<User[] | undefined> => {
    let token = getUserToken(manualToken);

    try {
        const req: AxiosResponse<AllUsersResponse> = await axios({
            "url": INTERNAL_API_URL + "/user/all",
            "method": "GET",
        });
    
        return req.data.users;
    } catch (ex: any) {
        return undefined;
    }
}

export const fetchPublicProflie = async (public_id: string) => {
    try {
        const req: AxiosResponse<PublicUserResponse> = await axios({
            "url": INTERNAL_API_URL + "/user/public",
            "method": "GET",
            "params": {
                "public_id": public_id
            }
        });

        return req.data.userData;
    } catch (ex) {
        return undefined;
    }
}