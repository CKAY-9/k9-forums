import { fetchTopicPostsAndActivity } from "@/api/forum/fetch";
import style from "./index.module.scss";
import { Topic } from "@/api/forum/interfaces";
import Image from "next/image";
import Link from "next/link";

const HomeTopic = async (props: {topic: Topic}) => {
    const temp = await fetchTopicPostsAndActivity(props.topic.topic_id);

    return (
        <Link href={`/topic/${props.topic.topic_id}`} className={style.topic}>
            <h2>{props.topic.name}</h2>
            <p>{props.topic.about}</p>
            <div style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                {temp?.topic?.posts !== undefined &&
                    <div style={{"display": "flex", "alignItems": "center", "gap": "0.5rem", "opacity": "0.5"}}>
                        <Image src={"/svgs/comment.svg"} alt="Locked" sizes="100%" width={0} height={0} style={{
                            "width": "1.5rem",
                            "height": "1.5rem",
                            "filter": "invert(1)",
                        }}></Image>
                        <span>{temp.topic.posts.length || 0}</span>
                    </div>
                }
            </div>
        </Link>
    );
}

const HomeTopicsClient = (props: {topics: Topic[]}) => {
    return (
        <>
            {props.topics.map((topic: Topic, index: number) => {
                return (
                    <>
                        <HomeTopic key={index} topic={topic}></HomeTopic>
                    </>
                );
            })}
        </>
    );
}

export default HomeTopicsClient;