"use client";

import { Forum } from "@/api/forum/interfaces";
import style from "./header.module.scss";
import Link from "next/link";
import { UsergroupFlags } from "@/api/admin/usergroup/interface";
import { useState } from "react";
import Image from "next/image";
import { INTERNAL_CDN_URL } from "@/api/resources";

const Header = (props: {forum: Forum, user: any | undefined, perms: number}) => {
    const [currentHover, setCurrentHover] = useState<number>(-1);

    return (
        <header className={style.header}>
            <section>
                <div style={{"display": "flex", "alignItems": "center", "gap": "3rem"}}>
                    {props.forum.community_logo !== "" && 
                        <div>
                            <Image src={INTERNAL_CDN_URL + props.forum.community_logo} alt="New Usergroup" sizes="100%" width={0} height={0} style={{
                                "width": "5rem",
                                "height": "5rem",
                                "borderRadius": "50%"
                            }}></Image>
                        </div>
                    }
                    <h1>{props.forum.community_name}</h1>
                </div>
                <div>
                    {props.user === undefined && <span><Link href="/login">Login</Link>/<Link href="/register">Register</Link></span>}
                    {props.user !== undefined && 
                        <div style={{"textAlign": "right"}}>
                            <h2>Logged in as {props.user.username}</h2>
                            <span style={{"display": "flex", "gap": "1rem"}}>
                                <Link href="/users/me">View profile</Link>
                                {(props.perms & UsergroupFlags.FORUM_MANAGEMENT) == UsergroupFlags.FORUM_MANAGEMENT && <Link href="/admin">Admin Settings</Link>}
                            </span>
                        </div>
                    }
                </div>
            </section>
            <nav>
                <div className={style.navElement} onMouseLeave={() => setCurrentHover(-1)}>
                    <h3 onMouseEnter={() => setCurrentHover(0)} className={style.action} style={{
                        "backgroundColor": currentHover == 0 ? "rgb(var(--accent)" : "rgb(var(--800))",
                        "borderBottomLeftRadius": currentHover == 0 ? "0" : "1rem",
                        "borderBottomRightRadius": currentHover == 0 ? "0" : "1rem"
                    }}>General</h3>
                    <div id="generalNav" className={style.menu} style={{"opacity": currentHover == 0 ? "1" : "0"}}>
                        <Link href="/">Home</Link>
                        <Link href="/about">About {props.forum.community_name}</Link>
                    </div>
                </div>
                <div className={style.navElement} onMouseLeave={() => setCurrentHover(-1)}>
                    <h3 onMouseEnter={() => setCurrentHover(1)} className={style.action} style={{
                        "backgroundColor": currentHover == 1 ? "rgb(var(--accent)" : "rgb(var(--800))",
                        "borderBottomLeftRadius": currentHover == 1 ? "0" : "1rem",
                        "borderBottomRightRadius": currentHover == 1 ? "0" : "1rem"
                    }}>Users</h3>
                    <div id="userNav" className={style.menu} style={{"opacity": currentHover == 1 ? "1" : "0"}}>
                        <Link href="/users">All Users</Link>
                        <Link href="/users/groups">Usergroups</Link>
                        <Link href="/users/staff">Staff</Link>
                    </div>
                </div>
                <div className={style.navElement} onMouseLeave={() => setCurrentHover(-1)}>
                    <h3 onMouseEnter={() => setCurrentHover(2)}className={style.action} style={{
                        "backgroundColor": currentHover == 2 ? "rgb(var(--accent)" : "rgb(var(--800))",
                        "borderBottomLeftRadius": currentHover == 2 ? "0" : "1rem",
                        "borderBottomRightRadius": currentHover == 2 ? "0" : "1rem"
                    }}>Posts</h3>
                    <div id="postNav" className={style.menu} style={{"opacity": currentHover == 2 ? "1" : "0"}}>
                        <Link href="/">All Posts</Link>
                    </div>
                </div>
                <div className={style.navElement} onMouseLeave={() => setCurrentHover(-1)}>
                    <h3 onMouseEnter={() => setCurrentHover(3)}className={style.action} style={{
                        "backgroundColor": currentHover == 3 ? "rgb(var(--accent)" : "rgb(var(--800))",
                        "borderBottomLeftRadius": currentHover == 3 ? "0" : "1rem",
                        "borderBottomRightRadius": currentHover == 3 ? "0" : "1rem"
                    }}>Extra</h3>
                    <div id="postNav" className={style.menu} style={{"opacity": currentHover == 3 ? "1" : "0"}}>
                        <Link href="/k9/about">About K9-Forums</Link>
                        <Link href="https://github.com/CKAY-9/k9-forums">Github</Link>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header;