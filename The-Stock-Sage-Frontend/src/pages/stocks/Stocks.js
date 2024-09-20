import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingOverlay from "../../components/loading overlay/LoadingOverlay";
import { getIndividualStockDataApi } from "./getIndividualStockDataApi";
import StockOverview from "./components/StockOverview";
import StockNews from "./components/StockNews";
import StockInfo from "./components/StockInfo";
import StockFinancials from "./components/StockFinancials";
import StockEvents from "./components/StockEvents";

export default function Stocks() {
  const { stockSymbol } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [stockData, setStockData] = useState();
  const TabsList = [
    {
      tabName: "Overview",
      element: <StockOverview stockData={stockData} />,
    },
    {
      tabName: "Financials",
      element: <StockFinancials stockData={stockData} />,
    },
    {
      tabName: "Dividends",
      element: <StockEvents stockData={stockData} />,
    },
    {
      tabName: "News",
      element: <StockNews stockData={stockData} />,
    },
  ];

  useEffect(() => {
    if (!document.referrer) {
      window.location.reload();
    }
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    const response = await getIndividualStockDataApi(stockSymbol);
    setStockData(response);
    setIsLoading(false);
  };

  return (
    <>
      <Flex align={"center"} justify={"center"} p={6}>
        <LoadingOverlay isLoading={isLoading} />
        {stockData ? (
          <Flex
            alignContent={"flex-start"}
            justifyContent={"space-between"}
            width={"90%"}
          >
            <Flex
              p={4}
              direction={"column"}
              border={"1px solid #ccc"}
              borderRadius={"lg"}
              alignContent={"flex-start"}
              width={"25%"}
              height={"max-content"}
            >
              <StockInfo stockData={stockData} />
            </Flex>
            <Flex direction={"column"} width={"74%"}>
              <Tabs>
                <TabList>
                  {TabsList?.map((item, index) => {
                    return <Tab key={index}>{item?.tabName}</Tab>;
                  })}
                </TabList>
                <TabPanels>
                  {TabsList?.map((item, index) => {
                    return <TabPanel key={index}>{item?.element}</TabPanel>;
                  })}
                </TabPanels>
              </Tabs>
            </Flex>
          </Flex>
        ) : (
          <Box minHeight={"600px"}></Box>
        )}
      </Flex>
    </>
  );
}
