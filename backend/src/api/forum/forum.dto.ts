export class CreatePostDTO {
    title: string;
    body: string;
    topic_id: string;
    user_id: string;
    template_allowed: boolean;
}

export class UpdatePostDTO {
    title: string;
    body: string;
    post_id: string;
}

export class DeletePostDTO {
    post_id: number
}

export class PostDTO {
    post_id: string;
}

export class NewCommentDTO {
    post_id: string;
    user_id: string;
    content: string;
}

export class UpdateCommentDTO {
    comment_id: string;
    content: string;
}

export class DeleteCommentDTO {
    comment_id: number;
}

export class UpdateForumDTO {
    name: string;
    about: string;
    logo: string;
}

export class VoteOnDTO {
    type: -1 | 0 | 1;
    user_id: string;
    target_id: string;
}
