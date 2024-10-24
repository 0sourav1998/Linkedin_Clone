import { apiConnector } from "../apiConnector"
import {postEndpoints} from "../../services/apis"
import toast from "react-hot-toast";

const {ALL_POSTS,CREATE_POST,DELETE_POST,LIKE_POST,ADD_COMMENT,FETCH_SINGLE_POST} = postEndpoints;

export const fetchAllPosts = async(token)=>{
    let result ;
    try {
        const response = await apiConnector("GET",ALL_POSTS,null,{
            Authorization  : `Bearer ${token}`
        });
        if(response?.data?.success){
            result = response?.data?.posts
        }
    } catch (error) {
        console.log(error)
    }
    return result ;
}

export const createPost = async(body,token)=>{
    let result ;
    try {
        const response = await apiConnector("POST",CREATE_POST,body,{
            Authorization : `Bearer ${token}`
        });
        if(response.data.success){
            toast.success(response?.data?.message);
            result = response?.data?.newPost;
        }
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
    return result ;
}

export const deletePost = async(id,token)=>{
    let result ;
    try {
      const response =  await apiConnector("DELETE",`${DELETE_POST}/${id}`,null,{
        Authorization : `Bearer ${token}`
      });
      if(response?.data?.success){
        toast.success(response.data.message);
        result = response.data.deletedPost ;
      }
    } catch (error) {
        toast.error(error.response.data.message)
    }
    return result ;
}

export const likePost = async(id,token)=>{
    let result ;
    try {
        const LIKE_URL = LIKE_POST.replace(":id",id);
        const response = await apiConnector("POST",LIKE_URL,null,{
            Authorization : `Bearer ${token}`
          });
        if(response?.data?.success){
            toast.success(response?.data?.message);
            result = response?.data?.updatedPost
        }
    } catch (error) {
        toast.error(error.response.data.message)
    }
    return result ;
}

export const addComment = async(id,body,token)=>{
    let result ;
    try {
        const COMMENT_URL = ADD_COMMENT.replace(":id",id)
        const response = await apiConnector("POST",COMMENT_URL,body,{
            Authorization : `Bearer ${token}`
        });
        if(response?.data?.success){
            toast.success(response?.data?.message);
            result = response?.data?.post;
        }
    } catch (error) {
        toast.error(error.response.data.message)
    }
    return result ;
}

export const fetchSinglePost = async(id,token)=>{
    let result ;
    try {
        const FETCH_POST = FETCH_SINGLE_POST.replace(":id",id)
        const response = await apiConnector("GET",FETCH_POST,null,{
            Authorization : `Bearer ${token}`
        });
        if(response?.data?.success){
            result = response?.data?.post;
        }
    } catch (error) {
        toast.error(error.response.data.message)
    }
    return result ;
}