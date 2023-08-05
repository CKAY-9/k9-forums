import { NextPage } from "next";
import { ForumHolder } from "./client"
import ForumServer from "./server"

export const ForumPage: NextPage = () => {
    return (
        <>
            <ForumHolder>
                <ForumServer />
            </ForumHolder>
        </>
    )
}

export default ForumPage;