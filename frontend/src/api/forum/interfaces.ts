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

export interface VoteOnPostData {
    postType: "comment" | "post", 
    voteType: -1 | 0 | 1
    targetID: number,
    userID: number,
    votes: Vote[]
}

export type Vote = {
    user_id: number
    post_id?: number
    comment_id?: number
    type: -2 | -1 | 0 | 1 | 2
}

export type Comment = {
    user?: PublicUser
    content: string
    comment_id: number
    posted_at: Date
    post?: Post
    post_id: number
    user_id: number
    votes: Vote[]
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
    votes: Vote[]
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
    community_name: string
    community_logo: string
    about: string
    custom_redirects: string[]
    categories?: any[]
    users?: any[]
}

export type CustomLink = {
    url: string
    custom_link_id: number
    type: number // 0 = custom, 1... = built in
    show_on_nav_bar: boolean
}