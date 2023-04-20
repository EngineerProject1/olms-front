import axiosRaw from "axios";
import { messageApi } from "../app";
const axios=axiosRaw.create({baseURL:"http://127.0.0.1:8090/api"});
axios.interceptors.request.use((request)=>{
    request.headers["token"]=sessionStorage.getItem("token");
    return request;
});
axios.interceptors.response.use((response) => {
    let data = response.data
    if (data.code != 200) {
        messageApi.error(data.msg);
    }
    return response;
});
export default axios;