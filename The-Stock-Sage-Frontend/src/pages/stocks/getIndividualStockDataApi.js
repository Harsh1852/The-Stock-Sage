import { axios } from "../../components/axios/axios";

export const getIndividualStockDataApi = async (stockSymbol) => {
  try {
    const url = `/stocks/${stockSymbol}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    // console.error("Error fetching data:", error);
    throw error;
  }
};
