import { Category } from "@/api/forum/interfaces"

export type NewCategoryResponse = {
    message: string,
    category: Category
}