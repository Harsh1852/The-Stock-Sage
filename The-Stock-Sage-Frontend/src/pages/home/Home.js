import { Box, Divider, Flex } from "@chakra-ui/react";
import React from "react";
import GetStarted from "./GetStarted";
import TodaysNews from "./TodaysNews";
import TodaysStocks from "./TodaysStocks";
import useAuth from "../../hooks/useAuth";
import { useLocation } from "react-router-dom";

export default function Home() {
  const { authState } = useAuth();
  const location = useLocation();
  if (authState?.isAuthenticated) {
    localStorage.setItem("lastVisitedPage", location.pathname);
  }

  return (
    <Flex p={6} align={"center"} justify={"center"}>
      <Flex
        height={"max-content"}
        width={"85%"}
        alignContent={"flex-start"}
        justifyContent={"space-between"}
      >
        <Flex
          direction={"column"}
          border={"1px solid #ccc"}
          boxShadow="0px 0px 10px rgba(0, 0, 0, 0.5)"
          borderRadius={"2xl"}
          height={"max-content"}
          width={"59%"}
        >
          <GetStarted />
          <Box style={{ textAlign: "center" }}>
            <Divider style={{ width: "95%", margin: "auto" }} />
          </Box>
          <TodaysStocks />
        </Flex>
        <Flex direction={"column"} width={"39%"}>
          <TodaysNews />
        </Flex>
      </Flex>
    </Flex>
  );
}
