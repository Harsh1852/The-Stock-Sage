import { axios } from "../../../components/axios/axios";

export const postDeleteAccountApi = async (token, requestBody) => {
  try {
    const url = "/user/delete-account";
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.post(url, requestBody, { headers: headers });
    return res.data;
  } catch (error) {
    // console.error("Error fetching data:", error);
    throw error;
  }
};
