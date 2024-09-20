import { Box, Flex, Link, Text } from "@chakra-ui/react";
import React from "react";

export default function StockNews({ stockData }) {
  return (
    <>
      <Box pt={2}>
        {stockData?.news?.length > 0 ? (
          stockData?.news?.map((news, index) => {
            return (
              <Link
                key={index}
                isExternal
                href={news?.link}
                _hover={{
                  textDecoration: "none",
                }}
              >
                <Flex
                  mb={4}
                  p={4}
                  border={"1px solid #ccc"}
                  borderRadius={"2xl"}
                  boxShadow="0px 0px 10px rgba(0, 0, 0, 0.5)"
                >
                  <Text>{news?.title}</Text>
                </Flex>
              </Link>
            );
          })
        ) : (
          <Text>No News to Display</Text>
        )}
      </Box>
    </>
  );
}
