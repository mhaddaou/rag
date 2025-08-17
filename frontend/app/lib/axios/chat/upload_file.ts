import { toast } from "sonner";
import AxiosInstance from "../axios_instance";

export default async function uploadFirstFile(file: File){
    try{
        const jwt =  localStorage.getItem("jwt")
        const formData = new FormData();
        formData.append("file", file);
        formData.append("jwt", jwt || "");
        const response = await AxiosInstance.post("docs/first_upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        return response.data

    }catch(e){
        toast.error("failed to upload file")
    }
}