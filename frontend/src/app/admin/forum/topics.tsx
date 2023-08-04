import { Category, Forum, Topic } from "@/api/forum/interfaces";
import Image from "next/image";
import { BaseSyntheticEvent, useState } from "react";
import categories from "./categories.module.scss";
import { postNotification } from "@/components/notifications/notification";
import axios from "axios";
import { INTERNAL_API_URL } from "@/api/resources";
import { getCookie } from "@/utils/cookie";

const Topics = (props: {forum: Forum, topics: Topic[]}) => {
    const [fTopics, fSetTopics] = useState<Topic[]>(props.topics || []);
    const [runningTotal, setRunningTotal] = useState<number>(-1);

    const createTopic = async (e: BaseSyntheticEvent, topic: Topic) => {
        const res = await axios({
            "url": INTERNAL_API_URL + "/topic/create",
            "method": "POST",
            "data": {
                "name": topic.name,
                "category_id": topic.category_id,
                "about": topic.about,
            },
            "headers": {
                "Authorization": getCookie("token")
            }
        });

        fSetTopics(fTopics.filter((value, index) => value.topic_id !== topic.topic_id));       
        fSetTopics(old => [...old, res.data.topic]); 

        postNotification("Created new topic with ID " + res.data.topic.topic_id);
    }

    return (
        <> 
            <h1>Topics</h1>
            <div className={categories.categories}>
                <button className={categories.category} id ={categories.new} style={{"position": "relative", "alignItems": "center", "justifyContent": "center"}} onClick={() => {
                    if (props.forum.categories === undefined || props.forum.categories?.length <= 0) {
                        postNotification("You need to have at least one category to create topics");
                        return;  
                    } 

                    const newCategory: Topic = {
                        "name": "New Topic",
                        "about": "No information provided...",
                        "topic_id": runningTotal,
                        "category_id": runningTotal,
                        "posts": []
                    }

                    setRunningTotal(runningTotal - 1);

                    fSetTopics(old => [...old, newCategory]);
                }}>
                    <Image src="/svgs/plus.svg" alt="New Usergroup" sizes="100%" width={0} height={0} style={{
                        "width": "1.5rem",
                        "height": "1.5rem",
                        "filter": "invert(1)"
                    }}></Image>
                </button>
                {(fTopics === undefined || fTopics.length <= 0) && <h2>There are no active topics</h2>}
                {fTopics.map((value, index: number) => {
                    console.log(value.topic_id);

                    return (
                        <div key={index} className={categories.category}>
                            <section style={{"display": "grid", "gridTemplateColumns": "50% 50%"}}>
                                <div style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                                    <label htmlFor="name">Name</label>
                                    <input onChange={(e: BaseSyntheticEvent) => value.name = e.target.value} type="text" placeholder="Topic Name" defaultValue={value.name} />
                                </div>
                                <div style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                                    <label htmlFor="color">Parent Category</label>
                                    <select onChange={(e: BaseSyntheticEvent) => {
                                        value.category_id = e.target.value;
                                    }} name="parentCategory">
                                        <option value={1}></option>
                                        {props.forum.categories?.map((cat: Category, index: number) => {
                                            return (
                                                <option selected={value.category_id === cat.category_id} key={index} value={cat.category_id}>{cat.name}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </section>
                            <section style={{"display": "grid", "gridTemplateColumns": "50% 50%"}}>
                                <div style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                                    <label htmlFor="about">About</label>
                                    <input onChange={(e: BaseSyntheticEvent) => value.about = e.target.value} type="text" placeholder="Category About" defaultValue={value.about} />
                                </div>
                                <div style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                                    <label htmlFor="id">Topic ID</label>
                                    <span>{value.topic_id >= 0 ? value.topic_id : "will be shown once created"}</span>
                                </div>
                            </section>
                            {value.topic_id <= -1 && <button onClick={(e: BaseSyntheticEvent) => createTopic(e, value)}>Create</button>}
                            {value.topic_id >= 0 && <button>Update</button>}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default Topics;