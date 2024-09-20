import { axios } from "../../../components/axios/axios";

export const getInsightsApi = async (stock) => {
  try {
    const symbol = stock?.stockSymbol;
    const url = `/user/insight/${symbol}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    // console.error("Error fetching data:", error);
    throw error;
  }
};
