import axios, { AxiosResponse } from "axios";
import { INTERNAL_CDN_URL } from "../resources";
import { UploadFileResponse } from "./interfaces";
import { postNotification } from "@/components/notifications/notification";

export const uploadFile = async (fileData: File | undefined, data: {
    folder_id: string,
    previous_file_dest: string
}) => {
    try {
        if (fileData === undefined) {
            postNotification("File input cannot be empty!");
            return;
        }

        if (fileData.size > (1024 * 1024 * 3) /* 3MB */) {
            postNotification("File must be smaller than 3MB (3072KB)!");
            return;
        }

        const form = new FormData();
        form.append("folder_id", data.folder_id);
        form.append("previous_file", data.previous_file_dest)
        form.append("file", fileData);

        const req: AxiosResponse<UploadFileResponse> = await axios({
            "url": INTERNAL_CDN_URL + "/upload",
            "method": "POST",
            "data": form  
        });

        return req.data;
    } catch (ex) {
        console.log(ex);
        return undefined;
    }
}