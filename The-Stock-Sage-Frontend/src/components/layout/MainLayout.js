import { Box } from "@chakra-ui/react";
import React from "react";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import { ToastContainer } from "react-toastify";

export default function MainLayout({ children, ...rest }) {
  return (
    <Box>
      <ToastContainer />
      <Box>
        <Header />
      </Box>
      <Box>{children}</Box>
      <Box>
        <Footer />
      </Box>
    </Box>
  );
}
