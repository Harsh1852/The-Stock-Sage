import { Center, Spinner } from "@chakra-ui/react";

const LoadingOverlay = ({ isLoading }) => {
  return (
    <>
      {isLoading && (
        <Center
          position="fixed"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="rgba(255, 255, 255, 0.7)" // Semi-transparent white background
          zIndex="9999" // Ensure it appears above other content
        >
          <Spinner size="xl" color="blue.500" />
        </Center>
      )}
    </>
  );
};

export default LoadingOverlay;
