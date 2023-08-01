export interface PersonalInformationResponse {
    message: string,
    user: User | undefined
}

export interface AllUsersResponse {
    message: string,
    users: User[] | undefined
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
    usergroups: string[]
}