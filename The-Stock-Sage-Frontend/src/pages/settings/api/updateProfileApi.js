import { axios } from "../../../components/axios/axios";

export const updateProfileApi = async (token, profile) => {
  try {
    const url = "/user/update-profile";
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.post(url, profile, { headers: headers });
    return res.data;
  } catch (error) {
    // console.error("Error fetching data:", error);
    return error.response;
    // throw error;
  }
};
