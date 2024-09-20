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
import React, { useEffect, useState } from "react";
import { postProfileDetailsApi } from "./api/postProfileDetailsApi";
import LoadingOverlay from "../../components/loading overlay/LoadingOverlay";
import useAuth from "../../hooks/useAuth";
import {
  FaLock,
  FaRegEye,
  FaRegEyeSlash,
  FaRegUserCircle,
} from "react-icons/fa";
import { updateProfileApi } from "./api/updateProfileApi";
import { toast } from "react-toastify";
import { validateEmail } from "../../components/common/formatFunctions";

export default function Profile() {
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState("");
  const [editProfile, setEditProfile] = useState(false);
  const editProfileFields = {
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
  };
  const [profile, setProfile] = useState(editProfileFields);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false); //to hide and show password

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setProfile((prev) => ({
      ...prev,
      name: userData?.name,
      email: userData?.email,
      mobileNumber: userData?.mobileNumber,
    }));
  }, [userData]);

  const fetchProfile = async () => {
    setIsLoading(true);
    const token = authState?.accessToken;
    const userProfileData = await postProfileDetailsApi(token);
    setUserData(userProfileData);
    setIsLoading(false);
  };

  const startEditProfile = () => {
    setEditProfile(!editProfile);
  };

  const cancelEditProfile = () => {
    setProfile((prev) => ({
      ...prev,
      name: userData?.name,
      email: userData?.email,
      mobileNumber: userData?.mobileNumber,
    }));
    setEditProfile(!editProfile);
  };

  const openPasswordModal = () => {
    if (
      profile?.name === "" ||
      profile?.email === "" ||
      !validateEmail(profile?.email) ||
      String(profile?.mobileNumber).length !== 10 ||
      Number.isNaN(profile?.mobileNumber)
    ) {
      toast.error("Please enter correct data.", {
        position: "top-center",
        toastId: "enterCorrectData",
      });
      return;
    }
    setShowPasswordModal(true);
  };

  const handleUpdateProfile = async () => {
    if (profile?.password === "") {
      toast.error("Password cannot be empty.", {
        position: "top-center",
        toastId: "emptyPassword",
      });
      return;
    }
    setIsLoading(true);
    const token = authState?.accessToken;
    const res = await updateProfileApi(token, profile);
    if (res?.status !== 200) {
      setIsLoading(false);
      toast.error(res?.message, {
        position: "top-center",
        toastId: "profileUpdateFail",
      });
    } else {
      setIsLoading(false);
      setEditProfile(!editProfile);
      toast.success(res?.message, {
        position: "top-center",
        toastId: "profileUpdated",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    setShowPasswordModal(false);
    setProfile((prev) => ({
      ...prev,
      password: "",
    }));
  };

  const handleEditProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({
      ...prev,
      [name]: name === "mobileNumber" ? parseInt(value) : value,
    }));
  };

  const closeModal = () => {
    setShowPasswordModal(false);
    setProfile((prev) => ({
      ...prev,
      password: "",
    }));
  };

  return (
    <Box p={6} pt={2} align="center">
      <LoadingOverlay isLoading={isLoading} />
      <Text textAlign={"left"} fontSize={"28px"} fontWeight={600} ml={4} mb={4}>
        Profile
      </Text>
      <Flex
        p={6}
        height={"max-content"}
        align="center"
        justifyContent="center"
        direction={"column"}
        border={"1px solid #ccc"}
        borderRadius={"2xl"}
        boxShadow="0px 0px 10px rgba(0, 0, 0, 0.5)"
        width={"100%"}
      >
        <Flex width={"100%"} justifyContent={"space-between"}>
          <Box p={4} width={"30%"}>
            <FaRegUserCircle size={"200px"} />
            <Text fontSize={"18"} ml={4} textAlign={"left"} mt={4}>
              {userData?.name}
            </Text>
            <Text fontSize={"18"} ml={4} textAlign={"left"}>
              {userData?.username}
            </Text>
            {!editProfile ? (
              <Button onClick={startEditProfile} width={"100%"} mt={2}>
                Edit Profile
              </Button>
            ) : (
              <>
                <Flex justifyContent={"space-between"} width={"100%"} mt={2}>
                  <Button onClick={openPasswordModal} width={"45%"}>
                    Save
                  </Button>
                  <Button onClick={cancelEditProfile} width={"45%"}>
                    Cancel
                  </Button>
                </Flex>
              </>
            )}
          </Box>
          <Flex mr={16} width={"50%"} direction={"column"}>
            <Box mb={4}>
              <Text fontSize={"20"}>User Details</Text>
            </Box>
            <Flex justifyContent={"space-between"} align={"center"}>
              <Text fontSize={"18"}>Name</Text>
              <Input
                type="text"
                width={"300px"}
                name="name"
                autoComplete="off"
                disabled={!editProfile}
                value={profile?.name || ""}
                onChange={(event) => {
                  handleEditProfileChange(event);
                }}
              />
            </Flex>
            <Flex mt={6} justifyContent={"space-between"} align={"center"}>
              <Text fontSize={"18"}>Mobile Number</Text>
              <Input
                type="number"
                width={"300px"}
                name="mobileNumber"
                autoComplete="off"
                disabled={!editProfile}
                value={profile?.mobileNumber || ""}
                onChange={(event) => {
                  handleEditProfileChange(event);
                }}
                onWheel={(event) => event.target.blur()}
              />
            </Flex>
            <Flex mt={6} justifyContent={"space-between"} align={"center"}>
              <Text fontSize={"18"}>Email ID</Text>
              <Input
                type="email"
                width={"300px"}
                name="email"
                autoComplete="off"
                disabled={!editProfile}
                value={profile?.email || ""}
                onChange={(event) => {
                  handleEditProfileChange(event);
                }}
              />
            </Flex>
          </Flex>
        </Flex>
        <Modal
          size={"sm"}
          isOpen={showPasswordModal}
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
              <Text fontSize={"24"}>Update Profile</Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box px={4}>
                <form autoComplete="off">
                  <Grid templateColumns={"repeat(1, 1fr)"} gap={4}>
                    <FormControl>
                      <FormLabel>Confirm Password</FormLabel>
                      <InputGroup>
                        <InputLeftElement>
                          <FaLock />
                        </InputLeftElement>
                        <Input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          autoComplete="new-password"
                          value={profile?.password || ""}
                          onChange={(event) => {
                            handleEditProfileChange(event);
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
                  </Grid>
                </form>
              </Box>
            </ModalBody>
            <ModalFooter justifyContent="flex-start">
              <Button onClick={handleUpdateProfile}>Save</Button>
              <Button ml={4} onClick={closeModal}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </Box>
  );
}
