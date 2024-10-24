import axios from "axios";

const axiosInstance = axios.create({});

export const apiConnector = (method,url,data,headers,params)=>{
    return axiosInstance({
        method : method ,
        url : url ,
        data : data ,
        headers : headers ? headers : null ,
        params : params ? params : null
    })
}