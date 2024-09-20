import { axios } from "../../../components/axios/axios";

export const getDashboardDataApi = async (token) => {
  try {
    const url = "/user/dashboard";
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.get(url, { headers: headers });
    return res.data;
  } catch (error) {
    // console.error("Error fetching post data:", error);
    throw error;
  }
};
