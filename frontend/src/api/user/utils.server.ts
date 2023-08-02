import { cookies } from "next/headers";

export const getUserToken = (manualToken: string = "") => {
    let token;
    if (manualToken === "") {
        const cookieStore = cookies();
        token = cookieStore.get("token")?.value;
    } else {
        token = manualToken;
    }

    if (token === undefined) {
        return undefined;
    }

    return token;
}