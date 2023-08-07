import { Category, Forum, Topic } from "@/api/forum/interfaces";
import Image from "next/image";
import { BaseSyntheticEvent, useState } from "react";
import categories from "./categories.module.scss";
import { postNotification } from "@/components/notifications/notification";
import axios from "axios";
import { INTERNAL_API_URL, INTERNAL_CDN_URL } from "@/api/resources";
import { getCookie } from "@/utils/cookie";
import {uploadFile} from "@/api/cdn/post";

const Topic = (props: {topic: Topic, forum: Forum, createTopic: Function, updateTopic: Function, deleteTopic: Function}) => {
    const [file, setFile] = useState<File>();
    const [pic, setPic] = useState<string>(props.topic.topic_picture);

    const uploadTopicPicture = async (e: BaseSyntheticEvent) => {
        e.preventDefault();

        const res = await uploadFile(file, {
            "folder_id": props.topic.topic_id.toString(),
            "previous_file_dest": pic 
        });

        if (res !== undefined) {
            setPic(res.dest);
            props.topic.topic_picture = res.dest;
        }
    }

    return (
        <>
            <div className={categories.category}>
                <section style={{"display": "grid", "gridTemplateColumns": "50% 50%"}}>
                    <div style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                        <label htmlFor="name">Name</label>
                        <input onChange={(e: BaseSyntheticEvent) => props.topic.name = e.target.value} type="text" placeholder="Topic Name" defaultValue={props.topic.name} />
                    </div>
                    <div style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                        <label htmlFor="color">Parent Category</label>
                        <select onChange={(e: BaseSyntheticEvent) => {
                            props.topic.category_id = e.target.value;
                        }} name="parentCategory">
                            <option value={1}></option>
                            {props.forum.categories?.map((cat: Category, index: number) => {
                                return (
                                    <option selected={props.topic.category_id === cat.category_id} key={index} value={cat.category_id}>{cat.name}</option>
                                )
                            })}
                        </select>
                    </div>
                </section>
                <section style={{"display": "grid", "gridTemplateColumns": "50% 50%"}}>
                    <div style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                        <label htmlFor="about">About</label>
                        <input onChange={(e: BaseSyntheticEvent) => props.topic.about = e.target.value} type="text" placeholder="Category About" defaultValue={props.topic.about} />
                    </div>
                    <div style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                        <label htmlFor="about">Image</label>
                        <button onClick={uploadTopicPicture}>Upload</button>
                        <input type="file" name="topicPfp" onChange={(e: BaseSyntheticEvent) => setFile(e.target.files[0])}></input>
                        {pic !== "" &&
                            <Image src={INTERNAL_CDN_URL + pic} alt="Topic Picture" sizes="100%" width={0} height={0} style={{
                                "width": "3rem",
                                "height": "3rem",
                                "borderRadius": "50%",
                                "objectFit": "cover"
                            }}></Image>
                        }
                    </div>
                </section>
                <section style={{"display": "grid", "gridTemplateColumns": "50% 50%"}}>
                    <div style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                        <label htmlFor="id">Topic ID</label>
                        <span>{props.topic.topic_id >= 0 ? props.topic.topic_id : "will be shown once created"}</span>
                    </div>
                </section>
                {props.topic.topic_id <= -1 && <button onClick={(e: BaseSyntheticEvent) => props.createTopic(e, props.topic)}>Create</button>}
                {props.topic.topic_id >= 0 && 
                    <>
                        <button onClick={(e: BaseSyntheticEvent) => props.updateTopic(e, props.topic)}>Update</button>
                        <button onClick={(e: BaseSyntheticEvent) => props.deleteTopic(e, props.topic.topic_id)}>Delete</button>
                    </>
                }
            </div>
        </>
    );
}

const Topics = (props: {forum: Forum, topics: Topic[]}) => {
    const [fTopics, fSetTopics] = useState<Topic[]>(props.topics || []);
    const [runningTotal, setRunningTotal] = useState<number>(-1);

    const createTopic = async (e: BaseSyntheticEvent, topic: Topic) => {
        e.preventDefault();

        const res = await axios({
            "url": INTERNAL_API_URL + "/topic/create",
            "method": "POST",
            "data": {
                "name": topic.name,
                "category_id": topic.category_id,
                "about": topic.about,
                "picture": topic.topic_picture
            },
            "headers": {
                "Authorization": getCookie("token")
            }
        });

        fSetTopics(fTopics.filter((topic) => res.data.topic_id !== topic.topic_id));       
        fSetTopics(old => [...old, res.data.topic]); 

        postNotification("Created new topic with ID " + res.data.topic.topic_id);
    }

    const updateTopic = async (e: BaseSyntheticEvent, topic: Topic) => {
        e.preventDefault();

        const res = await axios({
            "url": INTERNAL_API_URL + "/topic/update",
            "method": "PUT",
            "data": {
                "name": topic.name,
                "category_id": topic.category_id,
                "about": topic.about,
                "picture": topic.topic_picture
            },
            "headers": {
                "Authorization": getCookie("token")
            }
        });

        window.location.reload();
    }

    const deleteTopic = async (e: BaseSyntheticEvent, topicID: number) => {
        e.preventDefault();

        const res = await axios({
            "url": INTERNAL_API_URL + "/topic/delete",
            "method": "DELETE",
            "data": {
                "topic_id": topicID
            },
            "headers": {
                "Authorization": getCookie("token")
            }
        });

        window.location.reload();
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
                        "posts": [],
                        "topic_picture": ""
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
                {fTopics.map((topic: Topic, index: number) => {
                    return (
                        <Topic createTopic={createTopic} updateTopic={updateTopic} deleteTopic={deleteTopic} topic={topic} forum={props.forum} key={index}></Topic>
                    );
                })}
            </div>
        </>
    );
}

export default Topics;
