import { Usergroup } from "../admin/usergroup/interface"
import { Post } from "../forum/interfaces"

export interface PersonalInformationResponse {
    message: string,
    user: User | undefined
}

export interface AllUsersResponse {
    message: string,
    users: User[] | undefined
}

export interface PublicUserResponse {
    message: string,
    userData: PublicUser
}

export type User = {
    username: string,
    email: string,
    password: string,
    time_created: string,
    last_online: string,
    public_id: number,
    token: string,
    reputation: number,
    profile_bio: string,
    comments?: string[],
    posts?: string[],
    profile_picture: string,
    usergroups: string[]
}

export type PublicUser = {
    username: string,
    posts: Post[],
    comments: any[],
    time_created: string,
    reputation: number,
    profile_bio: string,
    last_online: string,
    usergroups: Usergroup[],
    profile_picture: string,
    public_id: number
}