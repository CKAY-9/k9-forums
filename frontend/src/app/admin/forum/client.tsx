"use client";

import { useState, useEffect } from "react";
import style from "../admin.module.scss";
import Categories from "./categories";
import { User } from "@/api/user/interfaces";
import { Forum, Topic } from "@/api/forum/interfaces";
import { Usergroup } from "@/api/admin/usergroup/interface";
import Information from "./information";
import CustomLinks from "./customLinks";
import Topics from "./topics";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const ForumClient = (props: {user: User | undefined, topics: Topic[], forum: Forum, groups: Usergroup[] | undefined}) => {
    if (props.user === undefined) {
        window.location.href = "/";
    }

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const tab = searchParams.get("tab");
    const [currentView, setCurrentView] = useState<number>(-1);

    useEffect(() => {
        switch (tab) {
            case "info":
                setCurrentView(0);
                break;
            case "links":
                setCurrentView(1);
                break;
            case "categories":
                setCurrentView(2);
                break;
            case "topics":
                setCurrentView(3);
                break;
            default: 
                setCurrentView(0);
                break;   
        }
    }, [tab]);

    return (
        <>
            <div className={style.management}>
                    <nav>
                        <button onClick={() => {
                            setCurrentView(0);
                            router.push(pathname + '?' + "tab=info");
                        }}>Information</button>
                        <button onClick={() => {
                            setCurrentView(1);
                            router.push(pathname + '?' + "tab=links");
                        }}>Custom Links</button>
                        <button onClick={() => {
                            setCurrentView(2);
                            router.push(pathname + '?' + "tab=categories");
                        }}>Categories</button>
                        <button onClick={() => {
                            setCurrentView(3);
                            router.push(pathname + '?' + "tab=topics");
                        }}>Topics</button>
                    </nav>
                    <div>
                        {currentView === 0 && <Information forum={props.forum}></Information>}
                        {currentView === 1 && <CustomLinks forum={props.forum}></CustomLinks>}
                        {currentView === 2 && <Categories forum={props.forum}></Categories>}
                        {currentView === 3 && <Topics topics={props.topics} forum={props.forum}></Topics>}
                    </div>
            </div>
        </>
    )
}

export const ForumHolder = ({children}: any) => {
    return (
        <>
            {children}
        </>
    )
}

export default ForumClient;