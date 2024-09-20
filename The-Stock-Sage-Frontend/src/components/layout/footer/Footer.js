import { Box } from "@chakra-ui/react";
import React from "react";
import Footer2 from "./Footer2";

export default function Footer() {
  return (
    <Box
      align="center"
      height={"max-content"}
      bg={"black"}
      color={"white"}
      p={5}
    >
      <Footer2 />
    </Box>
  );
}
