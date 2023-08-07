import { CustomLink, Forum } from "@/api/forum/interfaces";
import Image from "next/image";
import style from "./links.module.scss";
import { BaseSyntheticEvent, useState, useEffect } from "react";
import axios from "../../../../node_modules/axios/index";
import {INTERNAL_API_URL} from "@/api/resources";
import {getCookie} from "@/utils/cookie";
import {postNotification} from "@/components/notifications/notification";

const CustomLinks = (props: {forum: Forum}) => {
    const [links, setLinks] = useState<CustomLink[]>([]);
    const [steam, setSteam] = useState<string>("");
    const [store, setStore] = useState<string>("");
    const [discord, setDiscord] = useState<string>("");

    useEffect(() => {
        (async() => {
            const req = await axios({
                "url": INTERNAL_API_URL + "/forum/links",
                "method": "GET"
            });

            setLinks(req.data.links);
            setSteam(req.data.links[0].url);
            setStore(req.data.links[1].url);
            setDiscord(req.data.links[2].url);
         })();
    }, []);

    const update = async (e: BaseSyntheticEvent) => {
        e.preventDefault();

        const req = await axios({
            "url": INTERNAL_API_URL + "/forum/updateLinks",
            "method": "PUT",
            "data": {
                "steam": steam,
                "discord": discord,
                "store": store
            },
            "headers": {
                "Authorization": getCookie("token")
            }
        });

        if (req.data.message !== undefined) {
            postNotification("Updated custom links");
        }
    }

    return (
        <>
            <h1>Custom Links</h1>
            <span style={{"opacity": "0.5"}}>Leave blank to disable</span>
            <div className={style.links} style={{"marginTop": "1rem"}}>
                <div className={style.link} style={{"backgroundColor": "#5865F2"}}>
                    <Image src={"/links/discord.svg"} sizes="100%" width={0} height={0} style={{
                        "width": "3rem",
                        "height": "3rem"
                    }}></Image>
                    <input defaultValue={discord} onChange={(e: BaseSyntheticEvent) => setDiscord(e.target.value)} type="text" placeholder="Discord Invite"></input> 
                </div>
                <div className={style.link} style={{"backgroundColor": "white"}}>
                    <Image src={"/links/store.svg"} sizes="100%" width={0} height={0} style={{
                        "width": "3rem",
                        "height": "3rem"
                    }}></Image>
                    <input defaultValue={store} onChange={(e: BaseSyntheticEvent) => setStore(e.target.value)} type="text" placeholder="Store Page"></input> 
                </div>
                <div className={style.link} style={{"backgroundColor": "rgb(40, 30, 60)"}}>
                    <Image src={"/links/steam.png"} sizes="100%" width={0} height={0} style={{
                        "width": "3rem",
                        "height": "3rem"
                    }}></Image>
                    <input defaultValue={steam} onChange={(e: BaseSyntheticEvent) => setSteam(e.target.value)} type="text" placeholder="Steam Group"></input> 
                </div>
            </div>
            <button style={{"marginTop": "1rem"}} onClick={update}>Update</button>
        </>
    );
}

export default CustomLinks;
