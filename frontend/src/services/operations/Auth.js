import { authEndpoints } from "../apis";
import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { setSuggestedUser, setToken, setUser } from "../../redux/slice/auth.js";

const {
  SIGNUP,
  LOGIN,
  SUGGESTED_USER,
  GET_CURRENT_USER,
  UPDATE_PROFILE,
  DELETE_EXP,
  DELETE_EDU,
  DELETE_SKILL,
  GET_ALL_FOR_SEARCH
} = authEndpoints;

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

export const suggestedUser = (token) => {
  return async function (dispatch) {
    try {
      const response = await apiConnector("GET", SUGGESTED_USER, null, {
        Authorization: `Bearer ${token}`,
      });
      console.log(response);
      if (response?.data?.success) {
        dispatch(setSuggestedUser(response?.data?.otherUser));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const currentUser = async (username, token) => {
  let result;
  try {
    const USER_URL = GET_CURRENT_USER.replace(":username", username);
    const response = await apiConnector("GET", USER_URL, null, {
      Authorization: `Bearer ${token}`,
    });
    if (response?.data?.success) {
      result = response?.data?.user;
    }
  } catch (error) {
    console.log(error);
  }
  return result;
};

export const updateProfile = async (body, token) => {
  let result;
  try {
    const response = await apiConnector("PUT", UPDATE_PROFILE, body, {
      Authorization: `Bearer ${token}`,
    });
    if (response?.data?.success) {
      toast.success(response?.data?.message);
      result = response?.data?.user;
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
  return result;
};

export const deleteExperience = async (id, token) => {
  let result;
  try {
    const DELETE_EXP_URL = DELETE_EXP.replace(":id", id);
    const response = await apiConnector("DELETE", DELETE_EXP_URL, null, {
      Authorization: `Bearer ${token}`,
    });
    if (response) {
      toast.success(response?.data?.message);
      result = response?.data?.user;
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
  return result;
};

export const deleteEducation = async (id, token) => {
  let result;
  try {
    const DELETE_EDU_URL = DELETE_EDU.replace(":id", id);
    const response = await apiConnector("DELETE", DELETE_EDU_URL, null, {
      Authorization: `Bearer ${token}`,
    });
    if (response) {
      toast.success(response?.data?.message);
      result = response?.data?.user;
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
  return result;
};

export const deleteSkill = async(skill,token)=>{
  let result ;
  try {
      const DELETE_SKILL_URL = DELETE_SKILL.replace(":skill", skill);
      const response = await apiConnector("DELETE", DELETE_SKILL_URL, null, {
        Authorization: `Bearer ${token}`,
      });
      if (response) {
        toast.success(response?.data?.message);
        result = response?.data?.user;
      }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
  return result ;
}

export const getAllUsersForSearch = async(token)=>{
  let result ;
  try {
    const response = await apiConnector("GET",GET_ALL_FOR_SEARCH,null,{
      Authorization : `Bearer ${token}`
    });
    if(response){
      result = response?.data?.allUser;
    }
  } catch (error) {
    console.log(error)
  }
  return result;
}