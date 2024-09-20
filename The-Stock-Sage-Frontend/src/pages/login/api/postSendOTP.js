import { axios } from "../../../components/axios/axios";

export const postSendOTP = async (requestBody) => {
  try {
    const url = "/user/signup/send-otp";
    const res = await axios.post(url, requestBody);
    return res.data;
  } catch (error) {
    // console.error("Error fetching post data:", error);
    throw error;
  }
};
