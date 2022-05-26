import { Heading, Text } from "@chakra-ui/react";
import PetList from "components/feature/PetList";
import { Default, ErrorFallback, Feature, Loading, On, } from "lib/components/feature/Feature";
import { gte } from "lib/logic/model/BinaryRelationalPredicate";
import { feature } from "lib/logic/model/Feature";
import { numericAttribute } from "lib/logic/model/NumericAttribute";

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
        <ErrorFallback>Error recuperando la feature pet-list</ErrorFallback>
        <Default>No puedes ver la lista de mascotas...</Default>
      </Feature>
      <Feature>
        <On expression={gte(numericAttribute("pet-requests-remaining"), 2)}>
          Tienes suficientes API requests disponibles
        </On>
        <Default>
          NO tienes suficientes API requests disponibles
        </Default>
      </Feature>
    </>
  );
}
