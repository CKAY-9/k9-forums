"use client";

import { Forum } from "@/api/forum/interfaces";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { useEffect } from "react";

const AboutClient = (props: {forum: Forum}) => {
    useEffect(() => {
        const elm = document.getElementById("about");
        if (elm === null) return;
        elm.innerHTML = DOMPurify.sanitize(marked.parse(props.forum.about || ""))
    }, [document]);

    return (
        <div id="about">

        </div>
    );
}

export default AboutClient;