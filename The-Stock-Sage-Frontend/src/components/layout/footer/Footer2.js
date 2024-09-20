import { Box, Flex, Heading, Link, Spacer, Text } from "@chakra-ui/react";
import React from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookSquare,
  FaLinkedin,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";

export default function Footer2() {
  const iconsLinks = [
    {
      href: "https://www.facebook.com/",
      element: <FaFacebookSquare size={"20px"} />,
    },
    {
      href: "https://in.linkedin.com/",
      element: <FaLinkedin size={"20px"} />,
    },
    {
      href: "https://www.instagram.com/",
      element: <FaInstagram size={"20px"} />,
    },
    {
      href: "https://www.youtube.com/",
      element: <FaYoutube size={"20px"} />,
    },
    {
      href: "https://x.com/",
      element: <FaTwitter size={"20px"} />,
    },
  ];

  const navigateLinks = [
    {
      navigateLink: "/portfolio",
      label: "Portfolio",
    },
    {
      navigateLink: "/insights",
      label: "Insights",
    },
  ];

  return (
    <Flex direction={"row"} width={"70%"} mb={10} mt={8}>
      <Box>
        <Heading as="h2" size="sm" mb={4} textAlign={"left"}>
          Find Us On
        </Heading>
        <Flex>
          {iconsLinks?.map((item, index) => {
            return (
              <Box key={index} ml={2}>
                <Link isExternal={true} href={item.href}>
                  {item.element}
                </Link>
              </Box>
            );
          })}
        </Flex>
      </Box>
      <Spacer />
      <Box textAlign={"left"}>
        {navigateLinks?.map((item, index) => {
          return (
            <ReactRouterLink key={index} to={item.navigateLink}>
              <Text mb={2}>{item.label}</Text>
            </ReactRouterLink>
          );
        })}
      </Box>
      <Spacer />
      <Box textAlign={"left"}>
        <Text mb={2}>Help and Support</Text>
        <Text>support@thestocksage.com</Text>
      </Box>
    </Flex>
  );
}
