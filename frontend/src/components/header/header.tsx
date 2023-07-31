import { Forum } from "@/api/forum/interfaces";
import style from "./header.module.scss";
import Link from "next/link";
import { UsergroupFlags } from "@/api/admin/usergroup/interface";

const Header = (props: {forum: Forum, user: any | undefined, perms: number}) => {
    return (
        <header className={style.header}>
            <section>
                <div>
                    <h1>{props.forum.community_name}</h1>
                    {props.forum.community_logo !== "" && 
                        <div className={style.communityLogo}>
                            
                        </div>
                    }
                </div>
                <div>
                    {props.user === undefined && <span><Link href="/login">Login</Link>/<Link href="/register">Register</Link></span>}
                    {props.user !== undefined && 
                        <div style={{"textAlign": "right"}}>
                            <h2>Logged in as {props.user.username}</h2>
                            <span style={{"display": "flex", "gap": "1rem"}}>
                                <Link href="/profile">View profile</Link>
                                {(props.perms & UsergroupFlags.FORUM_MANAGEMENT) == UsergroupFlags.FORUM_MANAGEMENT && <Link href="/admin">Admin Settings</Link>}
                            </span>
                        </div>
                    }
                </div>
            </section>
            <nav>
                <div className={style.navElement}>
                    <h3>General</h3>
                </div>
                <div className={style.navElement}>
                    <h3>Users</h3>
                </div>
                <div className={style.navElement}>
                    <h3>Posts</h3>
                </div>
            </nav>
        </header>
    )
}

export default Header;