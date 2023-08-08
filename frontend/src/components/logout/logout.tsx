"use client";

import { eraseCookie } from "@/utils/cookie";
import { BaseSyntheticEvent } from "react";

export const logout = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    eraseCookie("token");
    window.location.href = "/login";
}

export const Logout = () => {
    return (
        <button onClick={logout}>Logout</button>
    )    
}
