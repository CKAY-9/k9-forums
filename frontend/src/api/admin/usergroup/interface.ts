export interface AllGroupsResponse {
    message: string,
    groups: Usergroup[]
}

export interface UpdateGroupResponse {
    message: string,
    group: Usergroup | undefined
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

export interface UsergroupFlagPretty {
    permission: string,
    flag: number
}

export const usergroupFlagsPretty: UsergroupFlagPretty[] = [
    {"flag": 0x400, "permission": "View Posts"},
    {"flag": 0x410, "permission": "View Comments"},
    {"flag": 0x420, "permission": "View Profiles"},
    {"flag": 0x4000, "permission": "Post"},
    {"flag": 0x4100, "permission": "Comment"},
    {"flag": 0x5000, "permission": "Delete Posts"},
    {"flag": 0x5100, "permission": "Delete Comments"},
    {"flag": 0x08, "permission": "Post Management"},
    {"flag": 0x04, "permission": "Forum Management"},
];