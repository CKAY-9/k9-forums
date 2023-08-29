import { PublicUser, User } from "../user/interfaces"

export interface FetchCategoryTopicsResponse {
    message: string,
    topics: Topic[]
}

export interface FetchTopicPostsResponse {
    message: string,
    topic: Topic | undefined
}

export interface FetchPostResponse {
    message: string,
    post: Post | undefined
}

export interface CreatePostResponse {
    message: string,
    post_id: string | undefined
}

export interface NewCommentResponse {
    message: string,
    comment_id: string | undefined
}

export type Comment = {
    user?: PublicUser
    content: string
    comment_id: number
    posted_at: Date
    post?: Post
    post_id: number
    user_id: number
    likes: number[]
    dislikes: number[]
}

export type Post = {
    title: string
    body: string
    comments: Comment[]
    first_posted: Date
    last_updated: Date
    closed: boolean
    pinned: boolean
    template_allowed: boolean
    post_id: number
    User?: User
    user_id?: number
    Topic?: Topic
    topic_id?: number
    likes: number[]
    dislikes: number[]
}

export type CustomLink = {
    url: string             
    custom_link_id: number
    type: number
}

export type Topic = {
    name: string
    about: string
    topic_id: number
    topic_picture: string
    Category?: Category
    category_id?: number
    posts: Post[]
}

export type Category = {
    name: string
    about: string
    color: string
    category_id: number
    topics?: Topic[]
    Forum?: Forum
    forumCommunity_name?: string
}

export type Forum = {
    community_name: string
    community_logo: string
    about: string
    custom_redirects: string[]
    categories?: any[]
    users?: any[]
    motd: string
}
