import { axios } from "../../../components/axios/axios";

export const postSignupApi = async (credentials) => {
  try {
    const url = "/user/signup";
    const res = await axios.post(url, credentials);
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
    // throw error;
  }
};
