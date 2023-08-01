import { User } from "../user/interfaces"

export interface FetchCategoryTopicsResponse {
    message: string,
    topics: Topic[]
}

export interface FetchTopicPostsResponse {
    message: string,
    topic: Topic | undefined
}

export type Post = {
    initial_comment: String
    comments: Comment[]
    first_posted: Date
    last_updated: Date
    closed: boolean
    pinned: boolean
    post_id: number
    User?: User
    user_id?: number
    Topic?: Topic
    topic_id?: number
}

export type Topic = {
    name: string
    about: string
    topic_id: number
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
    community_name: string,
    community_logo: string,
    about: string,
    custom_redirects: string[],
    categories?: any[],
    users?: any[]
}