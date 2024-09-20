import { Box, Button, Flex } from "@chakra-ui/react";
import React from "react";
import Dashboard from "./Dashboard";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

export default function Portfolio() {
  const { authState } = useAuth();
  const location = useLocation();
  if (authState?.isAuthenticated) {
    localStorage.setItem("lastVisitedPage", location.pathname);
  }
  const navigate = useNavigate();

  return (
    <Box p={6} align="center">
      <Flex
        height={"max-content"}
        align="center"
        justifyContent="center"
        width={"80%"}
        direction={"column"}
      >
        <Flex mb={4} pr={8} width={"100%"} justifyContent={"flex-end"}>
          <Button
            onClick={() => {
              navigate("/add-stock");
            }}
          >
            Add Stock
          </Button>
        </Flex>
        <Dashboard />
      </Flex>
    </Box>
  );
}
