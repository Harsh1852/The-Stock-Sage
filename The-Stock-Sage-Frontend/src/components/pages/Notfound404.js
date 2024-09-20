import { Flex, Text } from "@chakra-ui/react";
import React from "react";

export default function Notfound404() {
  return (
    <>
      <Flex align={"center"} justifyContent={"center"} height={"450px"}>
        <Flex align={"center"} height={'25px'}>
          <Text fontSize={20}>Error 404</Text>
          <Flex
            mx={2}
            border={'1px solid black'}
            height={'100%'}
          >{" "}</Flex>
          <Text fontSize={20}>Page not found</Text>
        </Flex>
      </Flex>
    </>
  );
}
