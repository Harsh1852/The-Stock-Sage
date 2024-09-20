import {
  Box,
  Flex,
  Grid,
  GridItem,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import {
  formatPercent,
  formatPrice,
} from "../../components/common/formatFunctions";
import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement,
} from "chart.js";
import { getDashboardDataApi } from "./api/getDashboardDataApi";
import useAuth from "../../hooks/useAuth";
import LoadingOverlay from "../../components/loading overlay/LoadingOverlay";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

ChartJS.register(DoughnutController, ArcElement, Tooltip, Legend);

const bgcolor = "#f2eded";
const chartColor = ["#5DA399", "#ABE188"];

export const DashboardComponents = ({ data, text }) => {
  return (
    <Flex
      p={2}
      align={"center"}
      justifyContent={"center"}
      width={"100%"}
      height={"100%"}
      bg={bgcolor}
      borderRadius={"xl"}
      border={"1px solid #ccc"}
      direction={"column"}
    >
      <Text fontSize={"24"} fontWeight={600}>
        {data}
      </Text>
      <Text fontSize={"24"} fontWeight={600}>
        {text}
      </Text>
    </Flex>
  );
};

export default function Dashboard() {
  const barChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const { authState } = useAuth();
  const [tableData, setTableData] = useState();
  const [dashboardData, setDashboardData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const tableHeaderList = [
    "Stock Symbol",
    "Quantity",
    "Average Price",
    "Current Price",
    "Valuation",
    "P/L",
  ];

  const [barData, setBarData] = useState({
    labels: ["Total Investment", "Total Valuation"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: chartColor,
        barThickness: 70,
      },
    ],
  });

  const [barOptions] = useState({
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#000000",
        },
        ticks: {
          color: "#000000",
        },
      },
      x: {
        grid: {
          color: "#000000",
        },
        ticks: {
          color: "#000000",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label = " ";
            }
            label = " ";
            label += context.raw;
            return label;
          },
        },
      },
    },
  });

  const [doughnutData, setDoughnutData] = useState({
    datasets: [
      {
        data: [0, 0],
        backgroundColor: chartColor,
      },
    ],
    labels: ["Stocks in Profit", "Stocks in Loss"],
  });

  const [doughnutOptions] = useState({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#000000",
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label = " ";
            }
            label += context.raw;
            return label;
          },
        },
      },
    },
  });

  useEffect(() => {
    const chart = barChartRef.current;
    if (chart) {
      chart.update();
    }
  }, [barData, barOptions, tableData]);

  useEffect(() => {
    const chart = doughnutChartRef.current;
    if (chart) {
      chart.update();
    }
  }, [doughnutData, doughnutOptions, tableData]);

  const fetchData = async () => {
    setIsLoading(true);
    const token = authState?.accessToken;
    const res = await getDashboardDataApi(token);
    setDoughnutData((prev) => ({
      ...prev,
      datasets: [
        {
          data: [res?.stocks_in_profit, res?.stocks_in_loss],
          backgroundColor: chartColor,
        },
      ],
    }));
    setBarData((prev) => ({
      ...prev,
      datasets: [
        {
          data: [res?.total_investment, res?.total_valuation],
          backgroundColor: chartColor,
        },
      ],
    }));
    setDashboardData(res);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setTableData(dashboardData);
  }, [dashboardData]);

  return (
    <Flex
      p={4}
      border={"1px solid #ccc"}
      boxShadow="0px 0px 9px rgba(0, 0, 0, 0.5)"
      borderRadius={"2xl"}
      height={"max-content"}
    >
      <LoadingOverlay isLoading={isLoading} />
      <Box>
        <Grid
          gap={2}
          templateColumns="repeat(5, 1fr)"
          templateRows="repeat(5, 1fr)"
        >
          <GridItem>
            <DashboardComponents
              data={formatPrice(tableData?.total_valuation)}
              text={"Total Valuation"}
            />
          </GridItem>
          <GridItem>
            <DashboardComponents
              data={formatPrice(tableData?.total_investment)}
              text={"Total Investments"}
            />
          </GridItem>
          <GridItem>
            <DashboardComponents
              data={tableData?.top_gainer}
              text={"Top Gainer"}
            />
          </GridItem>
          <GridItem colSpan={2} rowSpan={2}>
            <Flex
              p={2}
              width={"100%"}
              height={"100%"}
              bg={bgcolor}
              borderRadius={"xl"}
              border={"1px solid #ccc"}
            >
              <Doughnut
                ref={doughnutChartRef}
                data={doughnutData}
                options={doughnutOptions}
              />
            </Flex>
          </GridItem>
          <GridItem>
            <DashboardComponents
              data={formatPrice(tableData?.unrealised_pl)}
              text={"Unrealized P/L"}
            />
          </GridItem>
          <GridItem>
            <DashboardComponents
              data={formatPercent(tableData?.percentage_pl)}
              text={"Profit / Loss %"}
            />
          </GridItem>
          <GridItem>
            <DashboardComponents
              data={tableData?.total_stocks}
              text={"No. of Stocks"}
            />
          </GridItem>
          <GridItem maxHeight={"370px"} colSpan={2} rowSpan={3}>
            <Flex
              p={2}
              width={"100%"}
              height={"100%"}
              maxHeight={"370px"}
              bg={bgcolor}
              borderRadius={"xl"}
              border={"1px solid #ccc"}
            >
              <Bar ref={barChartRef} data={barData} options={barOptions} />
            </Flex>
          </GridItem>
          <GridItem maxHeight={"370px"} colSpan={3} rowSpan={3}>
            <TableContainer
              borderRadius={"xl"}
              maxHeight={"370px"}
              bg={bgcolor}
              overflowY={"auto"}
            >
              <Table>
                <Thead>
                  <Tr>
                    {tableHeaderList?.map((item, index) => {
                      return (
                        <Th
                          backgroundColor={"black"}
                          color={"white"}
                          style={{
                            position: "sticky",
                            top: -1,
                            zIndex: 1,
                          }}
                          border={"1px solid #ccc"}
                          px={"9px"}
                        >
                          {item}
                        </Th>
                      );
                    })}
                  </Tr>
                </Thead>
                <Tbody overflowX={"scroll"}>
                  {tableData?.table_data?.map((item, index) => {
                    return (
                      <Tr key={index}>
                        <Td border={"1px solid #ccc"} p={"9px"}>
                          {item?.Symbol}
                        </Td>
                        <Td border={"1px solid #ccc"} p={"9px"}>
                          {item?.Quantity}
                        </Td>
                        <Td border={"1px solid #ccc"} p={"9px"}>
                          {item?.average_price}
                        </Td>
                        <Td border={"1px solid #ccc"} p={"9px"}>
                          {item?.current_price}
                        </Td>
                        <Td border={"1px solid #ccc"} p={"9px"}>
                          {item?.Valuation}
                        </Td>
                        <Td border={"1px solid #ccc"} p={"9px"}>
                          {item?.profit_loss}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </GridItem>
        </Grid>
      </Box>
    </Flex>
  );
}
