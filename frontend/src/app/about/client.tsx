"use client";

import { Forum } from "@/api/forum/interfaces";
import MarkdownPreview from "@uiw/react-markdown-preview";

const AboutClient = (props: {forum: Forum}) => {
    return (
        <MarkdownPreview style={{"backgroundColor": "transparent"}} source={props.forum.about} />
    );
}

export default AboutClient;