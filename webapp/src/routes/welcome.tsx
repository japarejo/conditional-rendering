import { Heading, Text } from "@chakra-ui/react";
import PetList from "components/feature/PetList";
import { Default, Feature, Loading, On } from "lib/components/feature/Feature";
import { feature } from "lib/logic/model/Feature";

export default function Welcome() {
  return (
    <>
      <Heading mb="10px">Welcome to Pet Shop</Heading>
      <Text mb="20px">Simple featurized Pet Shop app using ReactJS</Text>
      <Feature>
        <On expression={feature("pet-list")}>
          <PetList />
        </On>
        <Loading>
          <b>Loading</b>
        </Loading>
        <Default>No puedes ver la lista de mascotas...</Default>
      </Feature>
    </>
  );
}
