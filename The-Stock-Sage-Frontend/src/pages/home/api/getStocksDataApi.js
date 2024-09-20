import { axios } from "../../../components/axios/axios";

export const getStocksDataApi = async (keyValue) => {
  try {
    const url = `/home/${keyValue}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    // console.error("Error fetching data:", error);
    throw error;
  }
};
