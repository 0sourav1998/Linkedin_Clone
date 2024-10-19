import { authEndpoints } from "../apis";
import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { setSuggestedUser, setToken, setUser } from "../../redux/slice/auth.js";

const { SIGNUP, LOGIN , SUGGESTED_USER , GET_CURRENT_USER } = authEndpoints;

export const signup = async (body, navigate) => {
  try {
    const response = await apiConnector("POST", SIGNUP, body);
    if (response?.data?.success) {
      toast.success(response?.data?.message);
      navigate("/login");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const login = (body, navigate) => {
  return async function (dispatch) {
    try {
      const response = await apiConnector("POST", LOGIN, body);
      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        dispatch(setUser(response?.data?.user));
        navigate("/");
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error?.response?.data?.message);
    }
  };
};

export const logout = (navigate) => {
  return async function (dispatch) {
    try {
      dispatch(setToken(null));
      dispatch(setUser(null));
      navigate("/login");
      toast.success("Logged Out Successfully");
    } catch (error) {
      console.log(error.message);
      toast.error(error?.response?.data?.message);
    }
  };
};


export const suggestedUser =(token)=>{
  return async function (dispatch){
    try {
      const response = await apiConnector("GET",SUGGESTED_USER,null,{
        Authorization : `Bearer ${token}`
      });
      console.log(response)
      if(response?.data?.success){
        dispatch(setSuggestedUser(response?.data?.otherUser));
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export const currentUser = async(token)=>{
  let result ;
  try {
    const response = await apiConnector("GET",GET_CURRENT_USER,null,{
      Authorization : `Bearer ${token}`
    });
    if(response?.data?.success){
      result = response?.data?.user;
    }
  } catch (error) {
    console.log(error)
  }
  return result ;
}