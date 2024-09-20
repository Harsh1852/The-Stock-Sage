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
import { postUpdatePasswordApi } from "./api/postUpdatePasswordApi";
import useAuth from "../../hooks/useAuth";
import { validateStrongPassword } from "../../components/common/formatFunctions";

export default function Security() {
  const { authState } = useAuth();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const requestBodyFields = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };
  const showPasswordFields = {
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  };
  const [requestBody, setRequestBody] = useState(requestBodyFields);
  const [showPassword, setShowPassword] = useState(showPasswordFields);

  const openModal = () => {
    setShowChangePasswordModal(true);
  };

  const closeModal = () => {
    setShowChangePasswordModal(false);
    setRequestBody(requestBodyFields);
    setShowPassword(showPasswordFields);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRequestBody((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleShowPassword = (name) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const isInputCorrect = () => {
    let msg = "";
    if (requestBody?.oldPassword === "") {
      msg = "Old password cannot be empty.";
    } else if (requestBody?.newPassword === "") {
      msg = "New password cannot be empty.";
    } else if (requestBody?.confirmNewPassword === "") {
      msg = "Confirm password cannot be empty.";
    } else if (!validateStrongPassword(requestBody?.newPassword)) {
      msg =
        "Password must contain a capital alpabhet, a small alpabhet, a numerical digit, a special charcter from @$!%*?& and atleast contain 8 characters.";
    } else if (requestBody?.newPassword !== requestBody?.confirmNewPassword) {
      msg = "New Password and confirm password must match.";
    }
    if (msg !== "") {
      toast.error(msg, {
        position: "top-center",
        autoClose: 5000,
        toastId: "passwordValidation",
      });
      return false;
    }
    return true;
  };

  const handleChangePasswordClick = async () => {
    if (!isInputCorrect()) {
      return;
    }
    setIsLoading(true);
    const token = authState?.accessToken;
    const response = await postUpdatePasswordApi(token, requestBody);
    if (response?.status === 200) {
      setIsLoading(false);
      closeModal();
      toast.success(response?.message, {
        position: "top-center",
        toastId: "passwordUpdated",
      });
      setTimeout(() => {
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
    <Box p={6} pt={0} align="center">
      <LoadingOverlay isLoading={isLoading} />
      <Text textAlign={"left"} fontSize={"28px"} fontWeight={600} ml={4} mb={4}>
        Security
      </Text>
      <Flex
        p={6}
        height={"max-content"}
        direction={"column"}
        border={"1px solid #ccc"}
        borderRadius={"2xl"}
        boxShadow="0px 0px 10px rgba(0, 0, 0, 0.5)"
        width={"100%"}
      >
        <Text mb={2} fontSize={"22px"} fontWeight={600} textAlign={"left"}>
          Password
        </Text>
        <Box borderTop={"1px solid"} width={"100%"}></Box>
        <Flex mt={4} align="center" justifyContent={"space-between"}>
          <Text fontSize={"18px"}>Change Password</Text>
          <Button onClick={openModal}>Change</Button>
        </Flex>
      </Flex>
      <Modal
        size={"2xl"}
        isOpen={showChangePasswordModal}
        onClose={closeModal}
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
            <Text fontSize={"24"}>Change Password</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Text mb={4} fontSize={"18px"}>
                Are you sure you want to change your password?
              </Text>
              <form autoComplete="off">
                <Grid pl={4} pr={12} templateColumns={"repeat(2, 1fr)"} gap={4}>
                  <FormControl>
                    <FormLabel htmlFor="oldPassword">
                      Enter Old Password
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <FaLock />
                      </InputLeftElement>
                      <Input
                        type={showPassword?.oldPassword ? "text" : "password"}
                        name="oldPassword"
                        id="oldPassword"
                        autoComplete="new-password"
                        value={requestBody?.oldPassword}
                        onChange={(event) => handleChange(event)}
                      />
                      <InputRightElement
                        cursor={"pointer"}
                        onClick={() => handleShowPassword("oldPassword")}
                      >
                        {showPassword?.oldPassword ? (
                          <FaRegEyeSlash />
                        ) : (
                          <FaRegEye />
                        )}
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <Box></Box>
                  {/* Hidden box used for rowing 2 inputs below  */}
                  <FormControl>
                    <FormLabel htmlFor="oldPassword">
                      Enter New Password
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <FaLock />
                      </InputLeftElement>
                      <Input
                        type={showPassword?.newPassword ? "text" : "password"}
                        name="newPassword"
                        id="newPassword"
                        autoComplete="new-password"
                        value={requestBody?.newPassword}
                        onChange={(event) => handleChange(event)}
                      />
                      <InputRightElement
                        cursor={"pointer"}
                        onClick={() => handleShowPassword("newPassword")}
                      >
                        {showPassword?.newPassword ? (
                          <FaRegEyeSlash />
                        ) : (
                          <FaRegEye />
                        )}
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="oldPassword">
                      Confirm New Password
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <FaLock />
                      </InputLeftElement>
                      <Input
                        type={
                          showPassword?.confirmNewPassword ? "text" : "password"
                        }
                        name="confirmNewPassword"
                        id="confirmNewPassword"
                        autoComplete="new-password"
                        value={requestBody?.confirmNewPassword}
                        onChange={(event) => handleChange(event)}
                      />
                      <InputRightElement
                        cursor={"pointer"}
                        onClick={() => handleShowPassword("confirmNewPassword")}
                      >
                        {showPassword?.confirmNewPassword ? (
                          <FaRegEyeSlash />
                        ) : (
                          <FaRegEye />
                        )}
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </Grid>
              </form>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleChangePasswordClick}>Save</Button>
            <Button ml={4} onClick={closeModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
