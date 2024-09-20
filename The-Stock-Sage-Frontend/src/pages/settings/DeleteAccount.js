import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import LoadingOverlay from "../../components/loading overlay/LoadingOverlay";
import { FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { postDeleteAccountApi } from "./api/postDeleteAccountApi";

export default function DeleteAccount() {
  const { authState, logout } = useAuth();
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const requestBodyFields = {
    password: "",
  };
  const [requestBody, setRequestBody] = useState(requestBodyFields);

  const openModal = () => {
    setShowDeleteAccountModal(true);
  };

  const closeModal = () => {
    setShowDeleteAccountModal(false);
    setRequestBody(requestBodyFields);
    setShowPassword(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRequestBody((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDeleteAccountClick = async () => {
    if (requestBody?.password === "") {
      toast.error("Password cannot be empty.", {
        position: "top-center",
        autoClose: 5000,
        toastId: "deleteAccount",
      });
      return;
    }
    setIsLoading(true);
    const token = authState?.accessToken;
    const response = await postDeleteAccountApi(token, requestBody);
    if (response?.status === 200) {
      setIsLoading(false);
      closeModal();
      toast.success(response?.message, {
        position: "top-center",
        toastId: "passwordUpdated",
      });
      setTimeout(() => {
        logout();
        window.location.reload();
      }, 1000);
    } else {
      setIsLoading(false);
      toast.error(response?.message, {
        position: "top-center",
        toastId: "passwordUpdateFail",
        autoClose: 5000,
      });
    }
  };

  return (
    <>
      <Flex justifyContent={"flex-start"} width={"100%"}>
        <LoadingOverlay isLoading={isLoading} />
        <Button
          color={"white"}
          bg={"red"}
          ml={6}
          _hover={{
            bg: "red.400",
          }}
          onClick={openModal}
        >
          Delete Account
        </Button>
      </Flex>
      <Modal
        size={"sm"}
        isOpen={showDeleteAccountModal}
        onClose={() => {
          setShowDeleteAccountModal(false);
        }}
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay zIndex="15" />
        <ModalContent
          containerProps={{
            zIndex: "15",
          }}
        >
          <ModalHeader>
            <Text fontSize={"24"}>Delete Account</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Text color={"red"} mb={4} fontSize={"18px"}>
                Are you sure you want to delete your account?
              </Text>
              <form autoComplete="off">
                <Grid px={4} templateColumns={"repeat(1, 1fr)"} gap={4}>
                  <FormControl>
                    <FormLabel htmlFor="password">Enter Password</FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <FaLock />
                      </InputLeftElement>
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        autoComplete="new-password"
                        value={requestBody?.password}
                        onChange={(event) => handleChange(event)}
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
                </Grid>
              </form>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              color={"white"}
              bg={"red"}
              _hover={{
                bg: "red.400",
              }}
              onClick={handleDeleteAccountClick}
            >
              Delete
            </Button>
            <Button ml={4} onClick={closeModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
