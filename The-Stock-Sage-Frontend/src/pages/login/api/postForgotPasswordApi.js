import { axios } from "../../../components/axios/axios";

export const postForgotPasswordApi = async (requestBody) => {
  try {
    const url = "/user/forgot-password";
    const res = await axios.post(url, requestBody);
    return res.data;
  } catch (error) {
    // console.error("Error fetching post data:", error);
    throw error;
  }
};
