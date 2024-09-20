import {
  Box,
  Button,
  ButtonGroup,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import LoadingOverlay from "../../components/loading overlay/LoadingOverlay";
import { getStocksDataApi } from "./api/getStocksDataApi";
import {
  formatPercent,
  formatPrice,
} from "../../components/common/formatFunctions";

export default function TodaysStocks() {
  const [stocksData, setStocksData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPercent, setShowPercent] = useState(true);

  useEffect(() => {
    fetchStockData("top_gainer");
  }, []);

  const fetchStockData = async (keyValue) => {
    setIsLoading(true);
    const data = await getStocksDataApi(keyValue);
    setStocksData(data);
    setIsLoading(false);
  };

  return (
    <Box mb={4} ml={3} p={6}>
      <LoadingOverlay isLoading={isLoading} />
      <Text mb={2} fontSize={"2xl"} fontWeight={600}>
        Stocks
      </Text>
      <ButtonGroup flexWrap={"wrap"}>
        <Button
          mt={2}
          onClick={() => {
            setShowPercent(true);
            fetchStockData("top_gainer");
          }}
        >
          Gainers
        </Button>
        <Button
          mt={2}
          onClick={() => {
            setShowPercent(true);
            fetchStockData("top_loser");
          }}
        >
          Losers
        </Button>
        <Button
          mt={2}
          onClick={() => {
            setShowPercent(false);
            fetchStockData("most_active");
          }}
        >
          Most Active
        </Button>
      </ButtonGroup>
      <Box>
        <TableContainer mt={4}>
          <Table>
            <Thead>
              <Tr>
                <Th>Stocks</Th>
                <Th>Price</Th>
                {showPercent && <Th>% Change</Th>}
              </Tr>
            </Thead>
            <Tbody>
              {Array.isArray(stocksData.data) ? (
                stocksData.data.map((stock, index) => (
                  <Tr key={index}>
                    <Td>{stock.name}</Td>
                    <Td>{formatPrice(stock.price)}</Td>
                    {showPercent && (
                      <Td
                        style={{ color: stock.percent < 0 ? "red" : "green" }}
                      >
                        {formatPercent(stock.percent)}
                      </Td>
                    )}
                  </Tr>
                ))
              ) : (
                <Tr mt={4} width={"100%"} align={"center"}>
                  <Td textAlign={"center"} colSpan={3}>
                    No data to display
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
