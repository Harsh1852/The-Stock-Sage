import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { formatPrice } from "../../../components/common/formatFunctions";

export default function StockEvents({ stockData }) {
  return (
    <>
      <Box width={"600px"} height={"400px"} overflowY={"scroll"}>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Dividend Price</Th>
              </Tr>
            </Thead>
            <Tbody>
              {stockData?.dividends?.length > 0 ? (
                stockData?.dividends?.map((item, index) => {
                  return (
                    <Tr key={index}>
                      <Td>{item.date}</Td>
                      <Td>{formatPrice(item.dividend)}</Td>
                    </Tr>
                  );
                })
              ) : (
                <Tr mt={2} width={"100%"} align={"center"}>
                  <Td textAlign={"center"} colSpan={2}>
                    No Actions to Display
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
