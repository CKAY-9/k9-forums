export class NewGroupDTO {
    name: string;
    color: string;
    permissions: number;
}

export class UpdateGroupDTO {
    name: string;
    color: string;
    permissions: number;
    new_usergroup_id: number;
    usergroup_id: number;
}

export class CreateCategoryDTO {
    name: string;
    color: string;
    about: string;
}

export class UpdateCategoryDTO {
    name: string;
    color: string;
    about: string;
    category_id: number;
}

export class CreateTopicDTO {
    name: string;
    category_id: number;
    about: string;
    picture: string;
}

export class UpdateTopicDTO {
    name: string;
    category_id: number;
    about: string;
    picture: string;
}

export class DeleteTopicDTO { 
    topic_id: number;
}
