import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export default function Marquee() {
  const [stocksList, setStocksList] = useState("");

  useEffect(() => {
    const res = [
      "SBIN",
      "LT",
      "ICICIBANK",
      "RELIANCE",
      "HINDALCO",
      "TCS",
      "INFY",
      "RELIANCE",
      "WIPRO",
      "TATASTEEL",
      "ZOMATO",
      "BHARTIARTL",
    ];
    let varStockList = "";
    res.forEach((item) => {
      varStockList = varStockList + item + ";";
    });
    const list = varStockList;
    setStocksList(list);
  }, []);

  return (
    <Box height={"30px"}>
      <iframe
        title="Ticker"
        id="st_1312f3f686bc42f6b69ffb9e9007a15e"
        width="100%"
        height="100%"
        src={`https://api.stockdio.com/visualization/financial/charts/v1/Ticker?app-key=3413181E5B1A48D386F8E2A3401FBF37&stockExchange=NSE&symbols=${stocksList}&palette=Aurora&layoutType=3&onload=st_1312f3f686bc42f6b69ffb9e9007a15e`}
      ></iframe>
    </Box>
  );
}
