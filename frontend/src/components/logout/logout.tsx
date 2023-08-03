"use client";

import { eraseCookie } from "@/utils/cookie";
import { BaseSyntheticEvent } from "react";

export const Logout = () => {
    const logout = (e: BaseSyntheticEvent) => {
        e.preventDefault();
        eraseCookie("token");
        window.location.href = "/login";
    }

    return (
        <button onClick={logout}>Logout</button>
    )    
}