export type Topic = {
    name: string
    about: string
    topics_id: number
    Category?: Category
    categoryCategory_id?: number
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