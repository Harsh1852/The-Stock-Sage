import { axios } from "../../../components/axios/axios";

export const postUpdatePasswordApi = async (token, requestBody) => {
  try {
    const url = "/user/update-password";
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const body = {
      oldPassword: requestBody?.oldPassword,
      newPassword: requestBody?.newPassword,
    };
    const res = await axios.post(url, body, { headers: headers });
    return res.data;
  } catch (error) {
    // console.error("Error fetching data:", error);
    throw error;
  }
};
