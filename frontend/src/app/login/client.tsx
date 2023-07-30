"use client";

import Link from "next/link";
import style from "./login.module.scss";

const LoginClient = () => {
    return (
        <>
            <main className={style.container}>
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