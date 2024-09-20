import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import {
  formatPercent,
  formatPrice,
} from "../../../components/common/formatFunctions";
import { FaIndustry } from "react-icons/fa";

export const CompanyProfile = ({ heading, info }) => {
  return (
    <Flex
      p={3}
      direction={"column"}
      width={"max-content"}
      minWidth={"270px"}
      border={"1px solid #ccc"}
      borderRadius={"2xl"}
      align={"center"}
    >
      <Flex justifyContent={"center"} align={"center"}>
        <FaIndustry />
        <Text ml={2}>{heading}</Text>
      </Flex>
      <Text textAlign={"center"} mt={2}>
        {info}
      </Text>
    </Flex>
  );
};

export const KeyMatricsComponent = ({ heading, info }) => {
  return (
    <Box>
      <Text>{heading}</Text>
      <Text mt={2}>{info}</Text>
    </Box>
  );
};

export default function StockOverview({ stockData }) {
  return (
    <>
      <Box>
        <Box>
          <Text>Price Chart</Text>
          <Flex mt={3}>
            {stockData?.dayHigh && (
              <Box>
                <Text>High</Text>
                <Text mt={2}>{formatPrice(stockData?.dayHigh)}</Text>
              </Box>
            )}
            {stockData?.dayLow && (
              <Box ml={3}>
                <Text>Low</Text>
                <Text mt={2}>{formatPrice(stockData?.dayLow)}</Text>
              </Box>
            )}
            {stockData?.percentChange && (
              <Box ml={3}>
                <Text>Returns</Text>
                <Text
                  color={stockData?.percentChange > 0 ? "green" : "red"}
                  mt={2}
                >
                  {formatPercent(stockData?.percentChange)}
                </Text>
              </Box>
            )}
          </Flex>
        </Box>
        <Box mt={4}>
          <iframe
            title="Stock Price Chart"
            width="800"
            height="420"
            src={`https://api.stockdio.com/visualization/financial/charts/v1/HistoricalPrices?app-key=3413181E5B1A48D386F8E2A3401FBF37&stockExchange=NSE&symbol=${stockData?.symbol}&displayPrices=Area&addVolume=false&dividends=true&splits=true&palette=Financial-Light&showLogo=No`}
          ></iframe>
        </Box>
        <Flex mt={4} justifyContent={"space-between"}>
          {stockData?.sector && (
            <CompanyProfile heading="Sector" info={stockData?.sector} />
          )}
          {stockData?.industry && (
            <CompanyProfile heading="Industry" info={stockData?.industry} />
          )}
          {stockData?.marketCap && (
            <CompanyProfile
              heading="Market Cap"
              info={formatPrice(stockData?.marketCap)}
            />
          )}
        </Flex>
        <Box mt={4} p={4} border={"1px solid #ccc"} borderRadius={"2xl"}>
          <Text fontSize={"xl"} fontWeight={"600"}>
            Key Matrics
          </Text>
          <Flex mt={4} width={"100%"} justifyContent={"space-between"}>
            {stockData?.keyRatio?.trailingPEratio!==0 && (
              <KeyMatricsComponent
                heading={"TTM PE Ratio"}
                info={stockData?.keyRatio?.trailingPEratio}
              />
            )}
            {stockData?.keyRatio?.PBratio!==0 && (
              <KeyMatricsComponent
                heading={"PB ratio"}
                info={stockData?.keyRatio?.PBratio}
              />
            )}
            {stockData?.keyRatio?.dividendYield!==0 && (
              <KeyMatricsComponent
                heading={"Dividend Yield"}
                info={formatPercent(stockData?.keyRatio?.dividendYield)}
              />
            )}
            {stockData?.keyRatio?.earningsPerShare!==0 && (
              <KeyMatricsComponent
                heading={"Earnings per Share"}
                info={stockData?.keyRatio?.earningsPerShare}
              />
            )}
            {stockData?.keyRatio?.returnOnEquity!==0 && (
              <KeyMatricsComponent
                heading={"Return on Equity"}
                info={stockData?.keyRatio?.returnOnEquity}
              />
            )}
            {stockData?.keyRatio?.debtToEquityRatio!==0 && (
              <KeyMatricsComponent
                heading={"Debt to Equity Ratio"}
                info={stockData?.keyRatio?.debtToEquityRatio}
              />
            )}
          </Flex>
        </Box>
        {stockData?.businessSummary && (
          <Box mt={4} p={4} border={"1px solid #ccc"} borderRadius={"2xl"}>
            <Text fontSize={"xl"} fontWeight={"600"}>
              Company Profile
            </Text>
            <Text mt={2}>{stockData?.businessSummary}</Text>
          </Box>
        )}
      </Box>
    </>
  );
}
