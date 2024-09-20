import { axios } from "../../../components/axios/axios";

export const postAddStockApi = async (token, requestBody) => {
  try {
    const url = "/user/addstock";
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.post(url, requestBody, { headers: headers });
    return res.data;
  } catch (error) {
    // console.error("Error fetching post data:", error);
    throw error;
  }
};
