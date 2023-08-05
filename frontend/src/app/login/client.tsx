"use client";

import Link from "next/link";
import style from "./login.module.scss";
import Image from "next/image";
import { INTERNAL_API_URL, INTERNAL_CDN_URL } from "@/api/resources";
import { Forum } from "@/api/forum/interfaces";
import { BaseSyntheticEvent, useState } from "react";
import { SHA256 } from "crypto-js";
import { setCookie } from "@/utils/cookie";
import { postNotification } from "@/components/notifications/notification";
import axios, { AxiosResponse } from "axios";
import { LoginResponse } from "@/api/user/interfaces";

const LoginClient = (props: {forum: Forum}) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const login = async (e: BaseSyntheticEvent) => {
        e.preventDefault();

        try {
            const req: AxiosResponse<LoginResponse> = await axios({
                "url": INTERNAL_API_URL + "/auth/k9l",
                "method": "GET",
                "params": {
                    "email": email,
                    "password": SHA256(password).toString()
                }
            });

            if (req.data === undefined) {
                postNotification("Failed to login!");
                return;
            }

            if (req.data.token !== undefined) {
                postNotification("Successfully logged in!");
                setCookie("token", req.data.token, 365);
                window.location.href = "/";
                return;
            }

            postNotification(req.data.message);
        } catch (ex) {
            postNotification("Failed to login!");
        }
    }

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
                    <form onSubmit={login} style={{"display": "flex", "flexDirection": "column", "gap": "1rem"}}>
                        <label>Email</label>
                        <input onChange={(e: BaseSyntheticEvent) => setEmail(e.target.value)} type="email" name="email" id="email" placeholder="Email" />
                        <label>Password</label>
                        <input onChange={(e: BaseSyntheticEvent) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="Password" />
                        <input type="submit" value="Login" />
                        <Link href="/register">Don&apos;t have an account?</Link>
                    </form>
                </div>
            </main>
        </>
    );
}

export default LoginClient;