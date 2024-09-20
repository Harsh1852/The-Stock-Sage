import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import SidePart from "./SidePart";
import Signup from "./Signup";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import { useLocation } from "react-router-dom";

export default function LoginPage() {
  const location = useLocation();

  return (
    <Box p={6} align="center">
      <Flex
        p={5}
        height={"max-content"}
        align="center"
        justifyContent="space-between"
        direction={"row"}
        width={"90%"}
        maxWidth={"1400px"}
      >
        <Box width={"45%"}>
          <SidePart />
        </Box>
        <Box width={"55%"}>
          {location.pathname === "/login" ? (
            <Login />
          ) : location.pathname === "/signup" ? (
            <Signup />
          ) : (
            <ForgotPassword />
          )}
        </Box>
      </Flex>
    </Box>
  );
}
