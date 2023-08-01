"use client";

import Link from "next/link";
import style from "./login.module.scss";
import Image from "next/image";
import { INTERNAL_CDN_URL } from "@/api/resources";
import { Forum } from "@/api/forum/interfaces";

const LoginClient = (props: {forum: Forum}) => {
    return (
        <>
            <main className={style.container}>
                {props.forum.community_logo !== "" && 
                    <div>
                        <Image src={INTERNAL_CDN_URL + props.forum.community_logo} alt="New Usergroup" sizes="100%" width={0} height={0} style={{
                            "width": "10rem",
                            "height": "10rem",
                            "borderRadius": "50%"
                        }}></Image>
                    </div>
                }
                <h1>Login</h1>
                <div className={style.login}>
                    <h3>Using K9</h3>
                    <form style={{"display": "flex", "flexDirection": "column", "gap": "1rem"}}>
                        <label>Email</label>
                        <input type="email" name="email" id="email" placeholder="Email" />
                        <label>Password</label>
                        <input type="password" name="password" id="password" placeholder="Password" />
                        <input type="submit" value="Login" />
                        <Link href="/register">Don't have an account?</Link>
                    </form>
                </div>
            </main>
        </>
    );
}

export default LoginClient;