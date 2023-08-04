import axios, { AxiosResponse } from "axios";
import { INTERNAL_API_URL } from "./resources";
import { PersonalInformationResponse } from "./interfaces";

export const fetchPersonalUser = async (token: string) => {
    try {
        const req: AxiosResponse<PersonalInformationResponse> = await axios({
            "url": INTERNAL_API_URL + "/user/personal",
            "method": "GET",
            "headers": {
                "Authorization": token
            }
        });

        return req.data;
    } catch (ex) {
        return undefined;
    }
}