import { Heading, Text } from "@chakra-ui/react";
import PetList from "components/feature/PetList";
import { Feature, Off, On } from "lib/components/feature/Feature";

export default function Welcome() {
  return (
    <>
      <Heading mb="10px">Welcome to Pet Shop</Heading>
      <Text mb="20px">Simple featurized Pet Shop app using ReactJS</Text>
      <Feature id="pet-list">
        <On><PetList /></On>
        <Off>No puedes ver la lista de mascotas...</Off>
      </Feature>
    </>
  );
}
