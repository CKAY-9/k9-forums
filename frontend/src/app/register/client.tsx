"use client";

import Link from "next/link";
import style from "./login.module.scss";
import { BaseSyntheticEvent, useState } from "react";
import axios from "axios";
import { INTERNAL_API_URL } from "@/api/resources";
import { SHA256 } from "crypto-js";

const RegisterClient = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");

    const register = async (e: BaseSyntheticEvent) => {
        e.preventDefault();

        const req = await axios({
            "url": INTERNAL_API_URL + "/auth/k9r",
            "method": "POST",
            data: {
                username: username,
                password: SHA256(password).toString(),
                email: email
            }
        });

        console.log(req.data);

        if (req.status === 200) {
            window.location.href = "/";
        }
    }
 
    return (
        <>
            <main className={style.container}>
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