import axios, { AxiosError, AxiosResponse } from "axios"
import { INTERNAL_API_URL } from "../resources"
import { cookies } from "next/headers";
import { PersonalInformationResponse, User } from "./interfaces";

export const fetchPersonalInformation = async (manualToken: string = ""): Promise<User | undefined> => {
    let token;
    if (manualToken === "") {
        const cookieStore = cookies();
        token = cookieStore.get("token")?.value;
    } else {
        token = manualToken;
    }

    if (token === undefined) {
        return undefined;
    }

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