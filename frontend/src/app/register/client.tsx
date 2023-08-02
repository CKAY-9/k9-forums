"use client";

import Link from "next/link";
import style from "./login.module.scss";
import { BaseSyntheticEvent, useState } from "react";
import axios from "axios";
import { INTERNAL_API_URL, INTERNAL_CDN_URL } from "@/api/resources";
import { SHA256 } from "crypto-js";
import { setCookie } from "@/utils/cookie";
import Image from "next/image";
import { Forum } from "@/api/forum/interfaces";
import { postNotification } from "@/components/notifications/notification";

const RegisterClient = (props: {forum: Forum}) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");

    const register = async (e: BaseSyntheticEvent) => {
        e.preventDefault();

        try {
            const req = await axios({
                "url": INTERNAL_API_URL + "/auth/k9r",
                "method": "POST",
                "data": {
                    username: username,
                    password: SHA256(password).toString(),
                    email: email
                },
                "validateStatus": (status) => {
                    if (status === 401) {
                        postNotification("An account with this email already exists!");
                        return false;
                    }

                    return true;
                }
            });
            
            if (req.status === 200 && req.data.token !== null) {
                setCookie("token", req.data.token, 365);
                window.location.href = "/";
            }
        } catch (ex) {
            console.log(ex);
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
                <h1>Register</h1>
                <div className={style.login}>
                    <form onSubmit={register} style={{"display": "flex", "flexDirection": "column", "gap": "1rem"}}>
                        <label>Username</label>
                        <input onChange={(e: BaseSyntheticEvent) => setUsername(e.target.value)} type="text" name="username" id="username" placeholder="Username" />
                        <label>Email</label>
                        <input onChange={(e: BaseSyntheticEvent) => setEmail(e.target.value)} type="email" name="email" id="email" placeholder="Email" />
                        <label>Password</label>
                        <input onChange={(e: BaseSyntheticEvent) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="Password" />
                        <input type="submit" value="Register" />
                        <Link href="/login">Already have an account?</Link>
                    </form>
                </div>
            </main>
        </>
    );
}

export default RegisterClient;