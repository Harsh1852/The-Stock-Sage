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

export default function StockFinancials({ stockData }) {
  return (
    <>
      <Box width={"700px"} height={"400px"} overflowY={"scroll"}>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Field</Th>
                <Th>Data</Th>
              </Tr>
            </Thead>
            <Tbody>
              {stockData?.incomeStatement?.length > 0 ? (
                stockData?.incomeStatement?.map((item, index) => {
                  return (
                    <Tr key={index}>
                      <Td>{item?.field}</Td>
                      <Td>{item?.data}</Td>
                    </Tr>
                  );
                })
              ) : (
                <Tr mt={2} width={"100%"} align={"center"}>
                  <Td textAlign={"center"} colSpan={2}>
                    No Financials to Display
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
