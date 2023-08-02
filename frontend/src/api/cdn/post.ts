import axios, { AxiosResponse } from "axios";
import { INTERNAL_API_URL, INTERNAL_CDN_URL } from "../resources";
import { UploadFileResponse } from "./interfaces";

export const uploadFile = async (fileData: File, data: {
    folder_id: string,
    previous_file_dest: string
}) => {
    try {
        const form = new FormData();
        form.append("folder_id", data.folder_id);
        form.append("previous_file", data.previous_file_dest)
        form.append("file", fileData);

        console.log(form);
        console.log(fileData.name);

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