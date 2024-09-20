import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  PinInput,
  PinInputField,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaUser, FaLock, FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { AiFillMail } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingOverlay from "../../components/loading overlay/LoadingOverlay";
import useAuth from "../../hooks/useAuth";
import {
  validateEmail,
  validateStrongPassword,
} from "../../components/common/formatFunctions";
import { postSendOTP } from "./api/postSendOTP";
import { postVerifyOTP } from "./api/postVerifyOTP";
import { postSignupApi } from "./api/postSignupApi";

export default function SignUp() {
  const navigate = useNavigate();
  const { setAuthState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const userDataArray = {
    name: "",
    username: "",
    email: "",
    mobileNumber: " ",
    password: "",
  };
  const [userData, setUserData] = useState(userDataArray);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [showPassword, setShowPassword] = useState(false); //to hide and show password
  const [otp, setOtp] = useState("");
  const [otpIsCorrect, setOtpIsCorrect] = useState(false);
  const [error, setError] = useState({
    inputError: false,
    otpError: false,
    passwordError: false,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (value !== "") {
      setError((prev) => ({
        ...prev,
        inputError: false,
      }));
    }
    setUserData((prevData) => ({
      ...prevData,
      [name]: name === "mobileNumber" ? parseInt(value, 10) : value,
    }));
  };

  const handleOTPChange = (value) => {
    if (value !== "") {
      setError((prev) => ({
        ...prev,
        otpError: "",
      }));
    }
    setOtp(value);
  };

  const handleSubmit = async () => {
    if (
      userData?.name === "" ||
      userData?.email === "" ||
      !validateEmail(userData?.email) ||
      String(userData?.mobileNumber).length !== 10 ||
      Number.isNaN(userData?.mobileNumber) ||
      userData?.username === ""
    ) {
      setError((prev) => ({
        ...prev,
        inputError: true,
      }));
    } else {
      const requestBody = {
        email: userData?.email,
        username: userData?.username,
      };
      setIsLoading(true);
      const res = await postSendOTP(requestBody);
      if (res === true) {
        setIsLoading(false);
        setShowOtpScreen(true);
      } else {
        setIsLoading(false);
        toast.error(res?.message, {
          position: "top-center",
          toastId: "invalidInput",
        });
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (otp === "") {
      setError((prev) => ({
        ...prev,
        otpError: "OTP cannot be empty.",
      }));
      return;
    }
    const requestBody = {
      otp: otp,
      email: userData?.email,
    };
    setIsLoading(true);
    const res = await postVerifyOTP(requestBody);
    //check if otp is correct
    if (res === true) {
      setOtpIsCorrect(true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setError((prev) => ({
        ...prev,
        otpError: "Please enter correct OTP.",
      }));
      setOtp("");
    }
  };

  const handlePasswordSubmit = async () => {
    if (userData?.password === "") {
      setError((prev) => ({
        ...prev,
        passwordError: "Password cannot be empty.",
      }));
    } else if (!validateStrongPassword(userData?.password)) {
      setError((prev) => ({
        ...prev,
        passwordError:
          "Password must contain a capital alpabhet, a small alpabhet, a numerical digit, a special charcter from @$!%*?& and atleast contain 8 characters.",
      }));
    } else {
      setIsLoading(true);
      const res = await postSignupApi(userData);
      if (res?.status !== 200) {
        setIsLoading(false);
        toast.error("Something went wrong", {
          position: "top-center",
          autoClose: 5000,
          toastId: "signupFail",
        });
      } else {
        localStorage.setItem("accessToken", res?.accessToken);
        setAuthState((prev) => ({
          ...prev,
          isAuthenticated: true,
          accessToken: res?.accessToken,
        }));
        setIsLoading(false);
        navigate("/portfolio");
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
        <Heading mb={6}>Sign Up</Heading>

        {!showOtpScreen ? (
          <>
            <Box width={"55%"}>
              <form autoComplete="off">
                <FormControl mb={4}>
                  <FormLabel htmlFor="name" mb={2}>
                    Name
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <FaUser />
                    </InputLeftElement>
                    <Input
                      isRequired
                      type="text"
                      id="name"
                      name="name"
                      autoComplete="off"
                      value={userData?.name}
                      border={"1px solid black"}
                      onChange={(event) => {
                        handleChange(event);
                      }}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel htmlFor="email" mb={2}>
                    Email
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <AiFillMail />
                    </InputLeftElement>
                    <Input
                      isRequired
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="off"
                      value={userData?.email}
                      border={"1px solid black"}
                      onChange={(event) => {
                        handleChange(event);
                      }}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel htmlFor="mobileNumber" mb={2}>
                    Mobile Number
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <FaPhone />
                    </InputLeftElement>
                    <Input
                      isRequired
                      type="number"
                      id="mobileNumber"
                      name="mobileNumber"
                      autoComplete="off"
                      value={userData?.mobileNumber}
                      border={"1px solid black"}
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      onWheel={(event) => event.target.blur()}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel htmlFor="username" mb={2}>
                    Username
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <FaUser />
                    </InputLeftElement>
                    <Input
                      isRequired
                      type="text"
                      id="username"
                      name="username"
                      autoComplete="off"
                      value={userData?.username}
                      border={"1px solid black"}
                      onChange={(event) => {
                        handleChange(event);
                      }}
                    />
                  </InputGroup>
                </FormControl>
                {error?.inputError && (
                  <Text mb={4} color={"red"}>
                    Please enter correct data.
                  </Text>
                )}
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
                <Flex justify={"center"} direction={"row"}>
                  <Text>Already a User?</Text>
                  <Text _hover={{ color: "blue" }} width={"max-content"}>
                    <Link to="/login">Login</Link>
                  </Text>
                </Flex>
              </form>
            </Box>
          </>
        ) : !otpIsCorrect ? (
          <>
            <Box>
              <form autoComplete="off">
                <FormControl mb={4}>
                  <Text mb={2}>OTP</Text>
                  <HStack>
                    <PinInput
                      onChange={handleOTPChange}
                      size="lg"
                      type="number"
                      otp
                      placeholder=""
                      value={otp}
                      autoFocus
                      errorBorderColor="red"
                    >
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                    </PinInput>
                  </HStack>
                </FormControl>
                {error?.otpError && (
                  <Text mb={4} color={"red"}>
                    {error?.otpError}
                  </Text>
                )}
                <Button color="white" bg={"black"} onClick={handleVerifyOtp}>
                  Submit
                </Button>
              </form>
            </Box>
          </>
        ) : (
          <Box>
            <form autoComplete="off">
              <FormControl mb={4}>
                <FormLabel htmlFor="password" mb={2}>
                  Password
                </FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <FaLock />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    value={userData?.password}
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
              {error?.passwordError && (
                <Text mb={4} color={"red"}>
                  {error?.passwordError}
                </Text>
              )}
              <Button
                color="white"
                bg={"black"}
                onClick={() => {
                  handlePasswordSubmit();
                }}
              >
                Submit
              </Button>
            </form>
          </Box>
        )}
      </Flex>
    </Box>
  );
}
