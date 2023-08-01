import { fetchForumInfo } from "@/api/forum/fetch";
import LoginClient from "./client";

const LoginServer = async () => {
    const forum = await fetchForumInfo();

    return (
        <>
            <LoginClient forum={forum}></LoginClient>
        </>
    );
}

export default LoginServer;