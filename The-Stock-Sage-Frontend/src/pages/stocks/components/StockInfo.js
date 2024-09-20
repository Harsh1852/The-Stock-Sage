import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import {
  formatPercent,
  formatPrice,
} from "../../../components/common/formatFunctions";

export default function StockInfo({ stockData }) {
  return (
    <>
      <Box>
        <Box>
          <Text fontSize={"xl"}>{stockData?.name}</Text>
          <Text>{stockData?.symbol}</Text>
          <Flex>
            <Text>{formatPrice(stockData?.currentPrice)}</Text>
            <Text ml={2} color={stockData?.percentChange > 0 ? "green" : "red"}>
              {formatPercent(stockData?.percentChange)}
            </Text>
          </Flex>
        </Box>
        <Flex></Flex>
      </Box>
    </>
  );
}
