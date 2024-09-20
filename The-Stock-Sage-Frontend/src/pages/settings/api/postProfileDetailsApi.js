import { axios } from "../../../components/axios/axios";

export const postProfileDetailsApi = async (token) => {
  try {
    const url = "/user/profile";
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.post(url, "", { headers: headers });
    return res.data;
  } catch (error) {
    // console.error("Error fetching data:", error);
    throw error;
  }
};
