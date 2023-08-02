import { Category, Topic } from "@/api/forum/interfaces"

export type NewCategoryResponse = {
    message: string,
    category: Category
}

export type AllTopicsResponse = {
    message: string,
    topics: Topic[]
}

export interface UpdateForumResponse {
    message: string
}