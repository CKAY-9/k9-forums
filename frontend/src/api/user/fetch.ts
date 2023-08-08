import axios, { AxiosResponse } from "axios"
import {Usergroup, UsergroupFlags} from "../admin/usergroup/interface";
import { INTERNAL_API_URL } from "../resources"
import { AllUsersResponse, LoginResponse, PersonalInformationResponse, PublicUserResponse, User, UserCommentsResponse, UserPostsResponse } from "./interfaces";
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

export const fetchUserPosts = async (public_id: number) => {
    try {
        const req: AxiosResponse<UserPostsResponse> = await axios({
            "url": INTERNAL_API_URL + "/user/posts",
            "method": "GET",
            "params": {
                "public_id": public_id
            }
        });

        return req.data;
    } catch (ex) {
        return undefined;
    }
}

export const fetchUserComments = async (public_id: number) => {
    try {
        const req: AxiosResponse<UserCommentsResponse> = await axios({
            "url": INTERNAL_API_URL + "/user/comments",
            "method": "GET",
            "params": {
                "public_id": public_id
            }
        });

        return req.data;
    } catch (ex) {
        return undefined;
    }
}

export const doesUserHavePermission = async (usergroups: number[], permission: UsergroupFlags): Promise<boolean> => {
    for (let i = 0; i < usergroups.length; i++) {
        const req = await axios({
            "url": INTERNAL_API_URL + "/usergroup/info",
            "method": "GET",
            "params": {
                "usergroup_id": usergroups[i]
            }
        });

        if ((req.data.usergroup.permissions & permission) === permission) {
            return true;
        }
    }

    return false;
}
