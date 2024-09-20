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
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import LoadingOverlay from "../../components/loading overlay/LoadingOverlay";
import { postLoginApi } from "./api/postLoginApi";

export default function Login() {
  const navigate = useNavigate();
  const { setAuthState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    userInput: "",
    password: "",
  });
  const [credentialsError, setCredentialsError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    if (credentials.userInput === "" || credentials.password === "") {
      setCredentialsError("Credentials cannot be empty.");
      setIsLoading(false);
    } else {
      const res = await postLoginApi(credentials);
      if (res?.status !== 200) {
        setIsLoading(false);
        toast.error(res?.response?.data?.message, {
          position: "top-center",
          autoClose: 5000,
          toastId: "loginFail",
        });
      } else {
        localStorage.setItem("accessToken", res.accessToken);
        setAuthState((prev) => ({
          ...prev,
          isAuthenticated: true,
          accessToken: res.accessToken,
        }));
        setIsLoading(false);
        navigate("/portfolio");
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (value !== "") {
      setCredentialsError("");
    }
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
        <Heading mb={6}>Login</Heading>
        <form autoComplete="off">
          <FormControl mb={4}>
            <FormLabel mb={2}>Username</FormLabel>
            <InputGroup>
              <InputLeftElement>
                <FaUser />
              </InputLeftElement>
              <Input
                type="text"
                name="userInput"
                autoComplete="off"
                border={"1px solid black"}
                onChange={(event) => {
                  handleChange(event);
                }}
              />
            </InputGroup>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel mb={2}>Password</FormLabel>
            <InputGroup>
              <InputLeftElement>
                <FaLock />
              </InputLeftElement>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                border={"1px solid black"}
                onChange={(event) => {
                  handleChange(event);
                }}
              />
              <InputRightElement
                cursor={"pointer"}
                onClick={() => {
                  setShowPassword((prev) => !prev);
                }}
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </InputRightElement>
            </InputGroup>
          </FormControl>
          {credentialsError && (
            <Text mb={4} color="red">
              {credentialsError}
            </Text>
          )}
          <Text mb={4} _hover={{ color: "blue" }} width={"max-content"}>
            <Link to="/forgot-password">Forgot Password?</Link>
          </Text>
          <Button
            mb={4}
            color="white"
            bg={"black"}
            onClick={() => {
              handleSubmit();
            }}
          >
            Submit
          </Button>
        </form>
        <Flex>
          <Text>New User?</Text>
          <Text _hover={{ color: "blue" }} width={"max-content"}>
            <Link to="/signup">Signup</Link>
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}
