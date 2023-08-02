export class CreatePostDTO {
    title: string;
    body: string;
    topic_id: string;
    user_id: string;
}

export class PostDTO {
    post_id: string;
}

export class NewCommentDTO {
    post_id: string;
    user_id: string;
    content: string;
}