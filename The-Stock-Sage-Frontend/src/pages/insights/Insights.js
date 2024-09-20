import {
  Box,
  Flex,
  Heading,
  Link,
  Spacer,
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
import { getInsightsApi } from "./api/getInsightsApi";
import { getUserHoldingsApi } from "./api/getUserHoldingsApi";
import LoadingOverlay from "../../components/loading overlay/LoadingOverlay";
import useAuth from "../../hooks/useAuth";
import { useLocation } from "react-router-dom";

export default function Insights() {
  const [isLoading, setIsLoading] = useState(false);
  const [stocksList, setStocksList] = useState("");
  const [response, setResponse] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);

  const { authState } = useAuth();
  const location = useLocation();
  if (authState?.isAuthenticated) {
    localStorage.setItem("lastVisitedPage", location.pathname);
  }

  useEffect(() => {
    const token = authState?.accessToken;
    const fetchUserHoldings = async () => {
      setIsLoading(true);
      const res = await getUserHoldingsApi(token);
      setStocksList(res);
      setIsLoading(false);
    };
    fetchUserHoldings();
    // eslint-disable-next-line
  }, []);

  const handleClick = async (stock) => {
    setResponse("");
    setSelectedStock(stock);
    setIsLoading(true);
    const res = await getInsightsApi(stock);
    setResponse(res);
    setIsLoading(false);
  };

  function getColor(value) {
    if (value >= 0 && value < 1) {
      return "red";
    } else if (value >= 1 && value < 2) {
      return "#cccc00";
    } else if (value >= 2 && value < 3) {
      return "orange";
    } else if (value >= 3 && value < 4) {
      return "lightgreen";
    } else if (value >= 4 && value <= 5) {
      return "#008000";
    } else {
      return "invalid";
    }
  }

  return (
    <Box>
      <LoadingOverlay isLoading={isLoading} />
      <Flex p={12} justifyContent="center">
        <Flex
          minH={"60vh"}
          p={6}
          border={"1px solid #ccc"}
          boxShadow="0px 0px 10px rgba(0, 0, 0, 0.5)"
          borderRadius={"2xl"}
          width={"80%"}
          height={"max-content"}
        >
          <Box width={"45%"} align="center">
            <Heading>User's holdings</Heading>
            <Box mt={4}>
              <TableContainer w={"70%"} overflowY={"auto"} maxHeight={"400px"}>
                <Table variant={"simple"}>
                  <Thead>
                    <Tr>
                      <Th
                        backgroundColor={"black"}
                        color={"white"}
                        align="center"
                        border={"1px solid black"}
                        style={{
                          position: "sticky",
                          top: -1,
                          zIndex: 1,
                        }}
                      >
                        Holdings List
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Array.isArray(stocksList) && stocksList.length > 0 ? (
                      stocksList.map((stock, index) => (
                        <Tr key={index}>
                          <Td align="center" border={"1px solid black"}>
                            <Link
                              onClick={() => {
                                handleClick(stock);
                              }}
                            >
                              {stock.stockName}
                            </Link>
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr mt={4} width={"100%"} align={"center"}>
                        <Td textAlign={"center"}>No data to display</Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
          <Spacer />
          <Box width={"45%"} align="center">
            {selectedStock ? (
              <>
                <Text fontWeight={600} fontSize={"20px"}>
                  Insights
                </Text>
                {response && (
                  <Box
                    p={6}
                    align="left"
                    mt={4}
                    border={`1px solid ${getColor(response?.rating)}`}
                    boxShadow={`0px 0px 10px ${getColor(response?.rating)}`}
                    borderRadius={"2xl"}
                  >
                    <Text fontSize={"3xl"} fontWeight={600}>
                      {selectedStock.stockName}
                    </Text>
                    <Text
                      color={getColor(response?.rating)}
                      mt={4}
                      fontSize={"2xl"}
                    >
                      Rating: {response?.rating}
                    </Text>
                    <Text
                      color={getColor(response?.rating)}
                      mt={4}
                      fontSize={"2xl"}
                    >
                      {response?.message}
                    </Text>
                    <Text
                      color={getColor(response?.rating)}
                      mt={4}
                      fontSize={"2xl"}
                    >
                      {response?.movement}
                    </Text>
                  </Box>
                )}
              </>
            ) : (
              <Text fontSize={"20px"}>
                Click on any stock to know about the insights.
              </Text>
            )}
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
