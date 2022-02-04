import { Box, HStack, Image } from "@chakra-ui/react";
import { Feature, On } from "lib/components/feature/Feature";
import { Outlet } from "react-router-dom";
import AppLink from "../components/common/AppLink";

export default function Main() {
  return (
    <>
        <HStack
          as="header"
          w="100%"
          h="50px"
          justify="space-between"
          bg="#dbffc2"
          boxShadow="0 2px 6px #0003"
          px="50px"
          py="10px"
          position="relative"
        >
          <HStack h="100%">
            <Image h="100%" src="/media/logo.svg" alt="logo" />
            <h1>Pet Shop</h1>
          </HStack>
          <HStack spacing="20px">
            <AppLink to="/">Home</AppLink>
            <Feature flags="pet-add" >
              <On><AppLink to="/pet">Add a pet</AppLink></On>
            </Feature>
          </HStack>
        </HStack>
      <main>
        <Box bg="#eee" minH="calc(100vh - 50px)" py="50px">
          <Outlet />
        </Box>
      </main>
    </>
  );
}
