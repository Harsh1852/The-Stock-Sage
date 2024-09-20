import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import LoadingOverlay from "../../components/loading overlay/LoadingOverlay";
import { postForgotPasswordApi } from "./api/postForgotPasswordApi";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [inputError, setInputError] = useState("");
  const [passwordSent, setPasswordSent] = useState(false);

  const handleSubmit = async () => {
    if (username === "") {
      setInputError("Enter appropriate username.");
    } else {
      setIsLoading(true);
      const requestBody = {
        username: username,
      };
      const res = await postForgotPasswordApi(requestBody);
      if (res === true) {
        setPasswordSent(true);
        setIsLoading(false);
        setTimeout(() => {
          navigate("/login");
        }, 3500);
      } else {
        setIsLoading(false);
        toast.error("Something went wrong.", {
          position: "top-center",
          toastId: "passwordChangeFail",
        });
      }
    }
  };

  return (
    <Box align="center">
      <LoadingOverlay isLoading={isLoading} />
      <Flex
        align="center"
        border={"1px solid #ccc"}
        borderRadius={"2xl"}
        boxShadow="0px 0px 10px rgba(0, 0, 0, 0.5)"
        height={"max-content"}
        width={"80%"}
        minWidth={"500px"}
        direction={"column"}
        p={6}
      >
        <Heading mb={6}>Forgot Password</Heading>
        {!passwordSent ? (
          <Box>
            <form autoComplete="off">
              <FormControl mb={4}>
                <FormLabel mb={2} htmlFor="username">
                  Enter Username
                </FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <FaUser />
                  </InputLeftElement>
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    border={"1px solid black"}
                    autoComplete="off"
                    onChange={(event) => {
                      setUsername(event.target.value);
                      if (event.target.value !== "") {
                        setInputError("");
                      }
                    }}
                  />
                </InputGroup>
              </FormControl>
              {inputError && (
                <Text mb={4} color={"red"}>
                  {inputError}
                </Text>
              )}
              <Button
                color="white"
                bg={"black"}
                onClick={() => {
                  handleSubmit();
                }}
              >
                Submit
              </Button>
            </form>
          </Box>
        ) : (
          <Box>
            <Text color={"green"}>New password is sent to your email.</Text>
            <Text color={"green"}>
              Now you will be redirected to login page.
            </Text>
          </Box>
        )}
      </Flex>
    </Box>
  );
}
