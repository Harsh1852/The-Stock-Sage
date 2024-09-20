import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import Profile from "./Profile";
import useAuth from "../../hooks/useAuth";
import { useLocation } from "react-router-dom";
import Security from "./Security";
import DeleteAccount from "./DeleteAccount";

export default function Settings() {
  const { authState } = useAuth();
  const location = useLocation();
  if (authState?.isAuthenticated) {
    localStorage.setItem("lastVisitedPage", location.pathname);
  }

  return (
    <Box p={6} align="center">
      <Flex
        p={5}
        pt={0}
        height={"max-content"}
        align="center"
        justifyContent="center"
        direction={"column"}
        width={"70%"}
      >
        <Heading>Settings</Heading>
        <Box width={"100%"}>
          <Profile />
        </Box>
        <Box width={"100%"}>
          <Security />
        </Box>
        <Box width={"100%"}>
          <DeleteAccount />
        </Box>
      </Flex>
    </Box>
  );
}
