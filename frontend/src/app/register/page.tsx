import { fetchForumInfo } from "@/api/forum/fetch";
import RegisterClient from "./client";

const RegisterServer = async () => {
    const forum = await fetchForumInfo();

    return (
        <>
            <RegisterClient forum={forum}></RegisterClient>
        </>
    );
}

export default RegisterServer;