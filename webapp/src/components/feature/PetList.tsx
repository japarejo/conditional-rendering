import {
  Button,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { Pet } from "api/Pet";
import axios from "axios";
import LinkButton from "components/common/LinkButton";
import { Default, Feature, On } from "lib/components/feature/Feature";
import useGenericFeature from "lib/components/feature/useGenericFeature";
import { plus } from "lib/logic/model/ArithmeticFunction";
import { attribute } from "lib/logic/model/Attribute";
import { and, or } from "lib/logic/model/BinaryLogicalPredicate";
import { gte } from "lib/logic/model/BinaryRelationalPredicate";
import constant from "lib/logic/model/Constant";
import { feature } from "lib/logic/model/Feature";
import { useEffect, useState } from "react";
import DeleteButton from "./DeleteButton";

export default function PetList() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetCounter, setResetCounter] = useState(0);

  const editHeader = useGenericFeature({
    on: [
      {
        expression: feature("pet-read"),
        on: <Th>Edit</Th>,
      },
    ],
  });

  const buttonText = useGenericFeature({
    on: [
      {
        expression: feature("pet-edit"),
        on: "Edit",
      },
    ],
    default: "View",
  });

  useEffect(() => {
    axios
      .get<Pet[]>("/api/pet/list")
      .then((data) => {
        setPets(data.data);
        setLoading(false);
      });
  }, [resetCounter]);

  if (loading) return <Spinner />;

  return (
    <VStack w="100%">
      <Table maxW="1000px">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Quantity</Th>
            <Th>Category</Th>
            <Feature>
              <On expression={and(feature("pet-read"), feature("pet-edit"))}>
                <Th>Edit</Th>
              </On>
            </Feature>
            <Feature>
              <On expression={feature("pet-delete")}>
                <Th>Delete</Th>
              </On>
            </Feature>
          </Tr>
        </Thead>
        <Tbody>
          {pets.map((pet) => (
            <Tr key={pet.id}>
              <Td>{pet.id}</Td>
              <Td>{pet.name}</Td>
              <Td>{pet.quantity}</Td>
              <Td>{pet.category.name}</Td>
              <Feature>
                <On expression={and(feature("pet-read"), feature("pet-edit"))}>
                  <Td>
                    <LinkButton
                      to={`/pet/${pet.id}`}
                      as={Button}
                      colorScheme="green"
                    >
                      {/* Performance of recursive calls? */}
                      <Feature>
                        <On expression={gte(plus(3, 1), 5)}>
                          Edit
                        </On>
                        <On expression={feature("pet-edit")}>Edit</On>
                        <Default>View</Default>
                      </Feature>
                    </LinkButton>
                  </Td>
                </On>
              </Feature>
              <Feature>
                <On expression={feature("pet-delete")}>
                  <Td>
                    <DeleteButton
                      petId={pet.id}
                      onDeleted={() => setResetCounter(resetCounter + 1)}
                    />
                  </Td>
                </On>
              </Feature>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
}
