import RolesClient from "../roles/client"
import { ForumHolder } from "./client"
import ForumServer from "./server"

export const ForumPage = () => {
    return (
        <>
            <ForumHolder>
                <ForumServer />
            </ForumHolder>
        </>
    )
}

export default ForumPage;