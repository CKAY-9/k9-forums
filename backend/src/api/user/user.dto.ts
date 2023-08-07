export class UpdateUserDTO {
    username: string;
    bio: string;
    pfp: string;
}

export class AddUsergroupDTO {
    user_id: number;
    usergroup_id: number;
}

export class RemoveUsergroupDTO {
    user_id: number;
    usergroup_id: number;
}
