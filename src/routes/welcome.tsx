import { Heading, Text } from "@chakra-ui/react";
import PetList from "components/feature/PetList";
import {  ErrorFallback, Feature, Loading, Off, On } from "lib/components/feature/Feature";
import useFeature from "lib/components/feature/useFeature";

export default function Welcome() {
  const petListFeature = useFeature({
     id: "pet-list",
     on: <PetList />,
     off: "No puedes ver la lista de mascotass...",
     loading: <b>Loading</b>,
     error: "A"
   });
  return (
    <>
      <Heading mb="10px">Welcome to Pet Shop</Heading>
      <Text mb="20px">Simple featurized Pet Shop app using ReactJS</Text>
      {petListFeature.feature}
      
    </>
  );
}

/*
<Feature flags="pet-list">
        <On><PetList /></On>
        <Off>No puedes ver la lista de mascotas...</Off>
        <Loading>LoadingAAAAAAAAAAAAAAAA</Loading>
        <ErrorFallback>Error</ErrorFallback>
      </Feature>*/