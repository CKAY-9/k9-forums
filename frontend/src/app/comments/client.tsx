"use client"

import { Comment } from "@/api/forum/interfaces"
import { BaseSyntheticEvent, useState } from "react"
import style from "./comments.module.scss"

const AllCommentsClient = (props: {
    comments: Comment[]
}) => {
    const [search, setSearch] = useState<string>("");

    return (
        <>
            <input type="text" placeholder="Search content of comment" onChange={(e: BaseSyntheticEvent) => setSearch(e.target.value.toLowerCase())} />
            <div className={style.comments}>
                {props.comments.length <= 0
                    ? <span>No comments have been posted!</span>
                    : <>
                        {props.comments.filter((comment) => comment.content.toLowerCase().includes(search)).map((comment: Comment, index: number) => {
                            return (
                                <div className={style.comment}>
                                    <section>
                                        
                                    </section>
                                </div>
                            )
                        })}
                    </>
                }
            </div>
        </>
    )
}

export default AllCommentsClient;