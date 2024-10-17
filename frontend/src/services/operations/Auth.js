import { authEndpoints } from "../apis";
import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { setToken, setUser } from "../../redux/slice/auth.js";

const { SIGNUP, LOGIN } = authEndpoints;

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
      console.log("RES", response);
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
