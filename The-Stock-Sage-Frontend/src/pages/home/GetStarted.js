import { Box, Button, Flex, Spacer, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function GetStarted() {
  const navigate = useNavigate();
  const { authState } = useAuth();

  const handleClick = () => {
    if (authState?.isAuthenticated) {
      navigate("/portfolio");
    } else {
      navigate("/login");
    }
  };

  return (
    <Box p={6}>
      <Text fontSize={"2xl"} fontWeight={600}>
        Get started
      </Text>
      <Flex align="center" justify="center" width={"450px"} mt={4}>
        <Box>
          <Text width={"100px"} fontWeight={"bold"}>
            Track your stocks and mutual fund investments
          </Text>
        </Box>
        <Spacer />
        <Box>
          <Text fontSize={"13px"}>
            Compare diversification score with the community
          </Text>
          <Text fontSize={"13px"}>
            Predict expected returns of your portfolio
          </Text>
          <Text fontSize={"13px"}>Find out red flags in your portfolio</Text>
        </Box>
      </Flex>
      <Text mt={4}>Import in 1-tap! takes less than a minute!</Text>
      <Button mt={4} width={"100%"} onClick={handleClick}>
        Start
      </Button>
    </Box>
  );
}
