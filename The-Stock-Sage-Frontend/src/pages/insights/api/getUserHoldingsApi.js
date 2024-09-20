import { axios } from "../../../components/axios/axios";

export const getUserHoldingsApi = async (token) => {
  try {
    const url = "/user/holdings";
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.get(url, { headers: headers });
    return res.data;
  } catch (error) {
    // console.error("Error fetching data:", error);
    throw error;
  }
};
