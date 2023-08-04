export interface PersonalInformationResponse {
    message: string,
    user: User | undefined
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