"use client";

import { useState } from "react";
import style from "../admin.module.scss";
import Categories from "./categories";
import { User } from "@/api/user/interfaces";
import { Forum } from "@/api/forum/interfaces";
import { Usergroup } from "@/api/admin/usergroup/interface";
import Information from "./information";
import CustomLinks from "./customLinks";

const ForumClient = (props: {user: User | undefined, forum: Forum, groups: Usergroup[] | undefined}) => {
    if (props.user === undefined) {
        window.location.href = "/";
    }

    const [currentView, setCurrentView] = useState<number>(0);

    return (
        <>
            <div className={style.management}>
                    <nav>
                        <button onClick={() => setCurrentView(0)}>Information</button>
                        <button onClick={() => setCurrentView(1)}>Custom Links</button>
                        <button onClick={() => setCurrentView(2)}>Categories</button>
                    </nav>
                    <div>
                        {currentView === 0 && <Information forum={props.forum}></Information>}
                        {currentView === 1 && <CustomLinks forum={props.forum}></CustomLinks>}
                        {currentView === 2 && <Categories forum={props.forum}></Categories>}
                    </div>
            </div>
        </>
    )
}

export default ForumClient;