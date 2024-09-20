import {
  Box,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Select,
  Heading,
  Button,
  VStack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { postAddStockApi } from "./api/postAddStockApi";
import LoadingOverlay from "../../components/loading overlay/LoadingOverlay";
import stockNames from "./../../data/stocks.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../hooks/useAuth";

export default function AddStock() {
  const inputRef = useRef(null);
  const suggestionBoxRef = useRef(null);
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedStockFlag, setSelectedStockFlag] = useState(false);
  const [transactionData, setTransactionData] = useState({
    transType: "",
    stockName: "",
    transDate: "",
    quantity: 0,
    stockPrice: 0,
    netAmount: 0,
  });
  const maxDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target) &&
      suggestionBoxRef.current &&
      !suggestionBoxRef.current.contains(event.target)
    ) {
      setResults([]);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (selectedStockFlag && name === "stockName") {
      setSelectedStockFlag(false);
    }
    setTransactionData((prevData) => ({
      ...prevData,
      [name]:
        name === "quantity"
          ? parseInt(value)
          : name === "stockPrice"
          ? parseFloat(value)
          : value,
      netAmount:
        name === "quantity"
          ? parseFloat(parseInt(value) * transactionData?.stockPrice)
          : name === "stockPrice"
          ? parseFloat(value * transactionData?.quantity)
          : parseFloat(transactionData?.netAmount),
    }));

    if (name === "stockName") {
      if (value.length >= 3) {
        const matchingStocks = stockNames.filter(
          (stock) =>
            stock.Symbol.toLowerCase().includes(value.toLowerCase()) ||
            stock.stockName.toLowerCase().includes(value.toLowerCase())
        );
        setResults(matchingStocks.slice(0, 10));
      } else {
        setResults([]);
      }
    }
  };

  const handleResultClick = (suggestion) => {
    setTransactionData((prevData) => ({
      ...prevData,
      stockName: suggestion.stockName,
    }));
    setSelectedStockFlag(true);
    setResults([]);
  };

  const fetchPostData = async () => {
    const token = authState?.accessToken;
    setIsLoading(true);
    const res = await postAddStockApi(token, transactionData);
    setIsLoading(false);
    return res;
  };

  const handleSubmit = async () => {
    // save transaction
    if (
      transactionData.transType &&
      transactionData.stockName &&
      selectedStockFlag &&
      transactionData.transDate &&
      transactionData.quantity &&
      !Number.isNaN(transactionData.quantity) &&
      transactionData.stockPrice &&
      !Number.isNaN(transactionData.stockPrice)
    ) {
      const res = await fetchPostData();
      setTransactionData({
        transType: "",
        stockName: "",
        transDate: "",
        quantity: 0,
        stockPrice: 0,
        netAmount: 0,
      });
      if (res) {
        toast.success("Transaction added successfully.", {
          position: "top-center",
          autoClose: 5000,
          toastId: "transactionSuccess",
        });
      } else {
        toast.error("Something went wrong.", {
          position: "top-center",
          autoClose: 5000,
          toastId: "transactionAddFail",
        });
      }
    } else {
      if (!selectedStockFlag) {
        toast.warning("Please select an appropriate stock.", {
          position: "top-center",
          autoClose: 5000,
          toastId: "inappropriateStock",
        });
        return;
      }
      toast.warning("Fill all the details.", {
        position: "top-center",
        autoClose: 5000,
        toastId: "fillAllDetails",
      });
    }
  };

  return (
    <Box
      width={"100%"}
      p={4}
      border={"1px solid #ccc"}
      boxShadow="0px 0px 10px rgba(0, 0, 0, 0.5)"
      borderRadius={"2xl"}
    >
      <LoadingOverlay isLoading={isLoading} />
      <Heading mb={6}>Add Stock</Heading>
      <Grid templateColumns={"repeat(3, 1fr)"} gap={4} p={4}>
        <GridItem>
          <FormControl>
            <FormLabel htmlFor="transType">Transaction Type</FormLabel>
            <Select
              name="transType"
              id="transType"
              value={transactionData?.transType}
              onChange={(event) => {
                handleChange(event);
              }}
            >
              <option value=""></option>
              <option value={"buy"}>Buy</option>
              <option value={"sell"}>Sell</option>
            </Select>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel htmlFor="stockName">Stock Name</FormLabel>
            <Input
              ref={inputRef}
              type="text"
              name="stockName"
              id="stockName"
              autoComplete="off"
              value={transactionData?.stockName}
              onChange={(event) => {
                handleChange(event);
              }}
            />
            {results.length > 0 && (
              <VStack
                p={2}
                ref={suggestionBoxRef}
                position="absolute"
                top="calc(100% + 5px)"
                left="0"
                width="100%"
                backgroundColor="white"
                border="1px solid #ccc"
                borderRadius="md"
                boxShadow="md"
                zIndex="1"
                maxHeight="250px" // Set a max height for the box
                overflowY="auto" // Enable vertical scrolling
              >
                {results.map((result, index) => (
                  <Text
                    key={index}
                    padding="2"
                    cursor="pointer"
                    width={"100%"}
                    _hover={{ backgroundColor: "#f0f0f0" }}
                    onClick={() => handleResultClick(result)}
                  >
                    {result.stockName}
                  </Text>
                ))}
              </VStack>
            )}
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel htmlFor="transDate">Transaction Date</FormLabel>
            <Input
              max={maxDate}
              type="date"
              name="transDate"
              id="transDate"
              value={transactionData?.transDate}
              onChange={(event) => {
                handleChange(event);
              }}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel htmlFor="quantity">Quantity</FormLabel>
            <Input
              type="number"
              name="quantity"
              id="quantity"
              value={transactionData?.quantity}
              onChange={(event) => {
                handleChange(event);
              }}
              onWheel={(event) => event.target.blur()}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel htmlFor="stockPrice">Price</FormLabel>
            <Input
              type="number"
              name="stockPrice"
              id="stockPrice"
              value={transactionData?.stockPrice}
              onChange={(event) => {
                handleChange(event);
              }}
              onWheel={(event) => event.target.blur()}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel htmlFor="netAmount">Net Amount</FormLabel>
            <Input
              isDisabled
              type="number"
              name="netAmount"
              id="netAmount"
              value={transactionData?.netAmount}
            />
          </FormControl>
        </GridItem>
      </Grid>
      <Button mt={6} mb={4} bg={"black"} color={"white"} onClick={handleSubmit}>
        Add Transaction
      </Button>
    </Box>
  );
}
