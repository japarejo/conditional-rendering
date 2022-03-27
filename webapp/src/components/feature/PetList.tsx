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
import { PetRequest } from "api/PetRequest";
import axios from "axios";
import LinkButton from "components/common/LinkButton";
import { Default, Feature, On } from "lib/components/feature/Feature";
import useGenericFeature from "lib/components/feature/useGenericFeature";
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

  // !!! CREATE FEATURE COMPONENT SO WE CAN PASS PROPS
  // const tableButton = useGenericFeature({
  //   on: [
  //     {
  //       expression: feature("pet-read"),
  //       on: (
  //         <Td>
  //           <LinkButton to={`/pet/${pet.id}`} as={Button} colorScheme="green">
  //             {buttonText}
  //           </LinkButton>
  //         </Td>
  //       ),
  //     },
  //   ],
  // });

  useEffect(() => {
    axios
      .get<PetRequest<Pet[]>>("http://localhost:8080/pet/list")
      .then((data) => {
        setPets(data.data.content);
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
              <On expression={feature("pet-read")}>
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
                <On expression={feature("pet-read")}>
                  <Td>
                    <LinkButton
                      to={`/pet/${pet.id}`}
                      as={Button}
                      colorScheme="green"
                    >
                      {/* Performance of recursive calls? */}
                      <Feature>
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
