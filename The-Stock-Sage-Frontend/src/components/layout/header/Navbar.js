import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { FaRegUserCircle } from "react-icons/fa";
import stockNames from "./../../../data/stocks.json";
import useAuth from "../../../hooks/useAuth";
import { BiLogOut } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authState, logout } = useAuth();
  const inputRef = useRef(null);
  const suggestionBoxRef = useRef(null);
  const profileRef = useRef(null);
  const menuRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target) &&
      suggestionBoxRef.current &&
      !suggestionBoxRef.current.contains(event.target)
    ) {
      setSearchQuery("");
      setResults([]);
    }
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target) &&
      menuRef.current &&
      !menuRef.current.contains(event.target)
    ) {
      setShowProfileMenu(false);
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length >= 3) {
      const searchedStocks = stockNames.filter(
        (stock) =>
          stock.Symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.stockName.toLowerCase().includes(query.toLowerCase())
      );
      setResults(searchedStocks.slice(0, 10));
    } else {
      setResults([]);
    }
  };

  const handleResultClick = (result) => {
    navigate(`/stocks/${result.Symbol}`);
    window.location.reload();
    setSearchQuery("");
    setResults([]);
  };

  const openProfilePage = () => {
    navigate("/settings");
  };

  return (
    <Flex width={"100%"} align="center" justify="center">
      <Flex width={"75%"} align="center" justifyContent={"space-between"}>
        <Flex align="center" justify="center">
          <Box width={"130px"}>
            <ChakraLink as={ReactRouterLink} to="/">
              <Image
                src="/assets/images/TheStockSage.png"
                height={"50px"}
                width={"130px"}
                alt="image"
              />
            </ChakraLink>
          </Box>
          <Flex ml={4} direction={"column"} position="relative" zIndex="10">
            <InputGroup>
              <InputLeftElement>
                <BiSearch />
              </InputLeftElement>
              <Input
                ref={inputRef}
                id="stockSearch"
                name="stockSearch"
                size={"md"}
                placeholder="Search any stock here"
                width={"400px"}
                borderRadius={"10px"}
                bg={"white"}
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {results.length > 0 && (
                <VStack
                  p={2}
                  ref={suggestionBoxRef}
                  position="absolute"
                  top="calc(100% + 5px)"
                  left="0"
                  width="100%"
                  backgroundColor="white"
                  border="1px solid #ccc"
                  borderRadius="md"
                  boxShadow="md"
                  zIndex="10"
                  maxHeight="250px" // Set a max height for the box
                  overflowY="auto" // Enable vertical scrolling
                >
                  {results.map((result, index) => (
                    <Text
                      key={index}
                      width={"100%"}
                      padding="2"
                      cursor="pointer"
                      _hover={{ backgroundColor: "#f0f0f0" }}
                      onClick={() => handleResultClick(result)}
                    >
                      {result.stockName}
                    </Text>
                  ))}
                </VStack>
              )}
            </InputGroup>
          </Flex>
        </Flex>
        <Flex align="center" justifyContent={"end"}>
          <ButtonGroup>
            <Button
              size={"md"}
              width={"100px"}
              onClick={() => {
                navigate("/portfolio");
              }}
            >
              Portfolio
            </Button>
            <Button
              size={"md"}
              width={"100px"}
              onClick={() => {
                navigate("/insights");
              }}
            >
              Insights
            </Button>
            {authState?.isAuthenticated && (
              <>
                <Box
                  onClick={() => {
                    setShowProfileMenu((prevState) => !prevState);
                  }}
                  direction={"column"}
                  position="relative"
                  ref={profileRef}
                >
                  <Box bg={"white"} borderRadius={"50%"}>
                    <FaRegUserCircle cursor={"pointer"} size={"40px"} />
                  </Box>
                  {showProfileMenu && (
                    <>
                      <VStack
                        ref={menuRef}
                        position="absolute"
                        top="calc(100% + 5px)"
                        right="0"
                        width="150px"
                        backgroundColor="white"
                        border="1px solid #ccc"
                        borderRadius="md"
                        boxShadow="md"
                        zIndex="9999"
                        height="max-content"
                        gap={0}
                      >
                        <Flex
                          p={"4px"}
                          pb={"8px"}
                          width={"100%"}
                          height={"max-content"}
                          align={"center"}
                          justifyContent={"center"}
                          cursor="pointer"
                          onClick={() => openProfilePage()}
                        >
                          <FaRegUser size={"20px"} />
                          <Text ml={"4px"}>Profile</Text>
                        </Flex>
                        <Flex
                          p={"4px"}
                          pb={"8px"}
                          width={"100%"}
                          height={"max-content"}
                          align={"center"}
                          justifyContent={"center"}
                          cursor="pointer"
                          onClick={() => logout()}
                        >
                          <BiLogOut size={"25px"} />
                          <Text ml={"4px"}>Logout</Text>
                        </Flex>
                      </VStack>
                    </>
                  )}
                </Box>
              </>
            )}
            {!authState?.isAuthenticated && location.pathname !== "/login" && (
              <Button
                size={"md"}
                width={"100px"}
                onClick={(e) => {
                  navigate("/login");
                }}
              >
                Login
              </Button>
            )}
            {!authState?.isAuthenticated && location.pathname !== "/signup" && (
              <Button
                size={"md"}
                width={"100px"}
                onClick={(e) => {
                  navigate("/signup");
                }}
              >
                Sign Up
              </Button>
            )}
          </ButtonGroup>
        </Flex>
      </Flex>
    </Flex>
  );
}
