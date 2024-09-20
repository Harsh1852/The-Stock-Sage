import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import AddStock from "./AddStock";
import useAuth from "../../hooks/useAuth";
import { useLocation } from "react-router-dom";

export default function AddTransaction() {
  const { authState } = useAuth();
  const location = useLocation();
  if (authState?.isAuthenticated) {
    localStorage.setItem("lastVisitedPage", location.pathname);
  }

  return (
    <Box p={8} align="center">
      <Flex
        height={"max-content"}
        align="center"
        justifyContent="center"
        width={"80%"}
        direction={"column"}
      >
        <AddStock />
      </Flex>
    </Box>
  );
}
