import { Forum } from "@/api/forum/interfaces";
import { User } from "@/api/user/interfaces";
import style from "./messages.module.scss";

export const MessagesClient = (props: {
    forum: Forum,
    user: User,
    perms: number
}) => {
    return (
        <>
            <div className={style.container}>
                <nav className={style.nav}>

                </nav>
                <div className={style.chatWindow}>

                </div>
            </div>
        </>
    );
}

const MessagesClientWrapper = ({children}: any) => {
    return (
        <>
            {children}
        </>
    );
}

export default MessagesClientWrapper;