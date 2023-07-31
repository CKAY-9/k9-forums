export interface AllGroupsResponse {
    message: string,
    groups: Usergroup[]
}

export type Usergroup = {
    name: string,
    color: string,
    permissions: number,
    usergroup_id: number
}

export enum UsergroupFlags {
    VIEW_POSTS = 0x400,
    VIEW_COMMENTS = 0x410,
    VIEW_PROFILES = 0x420,
    POST = 0x4000,
    COMMENT = 0x4100,
    DELETE_POSTS = 0x5000,
    DELETE_COMMENTS = 0x5100,
    POST_MANAGEMENT = 0x08,
    FORUM_MANAGEMENT = 0x04
}