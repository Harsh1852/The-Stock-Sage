import { Box, Text } from "@chakra-ui/react";
import React from "react";

export default function TodaysNews() {
  return (
    <Box
      p={4}
      border={"1px solid #ccc"}
      boxShadow="0px 0px 10px rgba(0, 0, 0, 0.5)"
      borderRadius={"2xl"}
    >
      <Text ml={4}>Today's News and Events</Text>
      <Box mt={4}>
        <iframe
          title="News"
          id="st_4b16d5be43e740f49cd298f4fbf68ee9"
          width="100%"
          height="570px"
          src="https://api.stockdio.com/visualization/financial/charts/v1/EconomicNews?app-key=3413181E5B1A48D386F8E2A3401FBF37&language=English&country=India&countryUsage=only&maxCountryNews=1&includeDescription=false&imageWidth=40&imageHeight=40&maxItems=8&palette=Financial-Light&onload=st_4b16d5be43e740f49cd298f4fbf68ee9"
        ></iframe>
      </Box>
    </Box>
  );
}
