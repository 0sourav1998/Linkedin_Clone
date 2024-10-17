import { apiConnector } from "../apiConnector";
import { connectionEndpoints } from "../apis";

const { GET_CONNECTIONS } = connectionEndpoints;

export const getConnections = async (token) => {
    let result ;
  try {
    const response = await apiConnector("GET", GET_CONNECTIONS,null,{
        Authorization : `Bearer ${token}`
    });
    if (response?.data?.success) {
      result = response?.data?.connections;
    }
  } catch (error) {
    console.log(error.message);
  }
  return result ;
};
