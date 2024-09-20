import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import Marquee from "./Marquee";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <Box maxHeight={"120px"} height={"15vh"} bg={"black"}>
      <Box>
        <Marquee />
      </Box>
      <Flex height={"calc(100% - 30px)"} alignContent={"center"}>
        <Navbar />
      </Flex>
    </Box>
  );
}
