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
import { Feature, On } from "lib/components/feature/Feature";
import useFeature from "lib/components/feature/useFeature";
import { useEffect, useState } from "react";
import DeleteButton from "./DeleteButton";

export default function PetList() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  //   const [currentPage, setCurrentPage] = useState(0);
  const [resetCounter, setResetCounter] = useState(0);
  const readFeature = useFeature({
    id: "pet-read",
    on: <Th>Edit</Th>,
  });
  const editFeature = useFeature({
    id: "pet-edit",
    on: "Edit",
    off: "View",
  });

  // TODO: Think about how to pass props to feature...

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
            {readFeature}
            <Feature flags="pet-delete">
              <On>
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
              <Feature flags="pet-read">
                <On>
                  <Td>
                    <LinkButton
                      to={`/pet/${pet.id}`}
                      as={Button}
                      colorScheme="green"
                    >
                      {editFeature}
                    </LinkButton>
                  </Td>
                </On>
              </Feature>
              <Feature flags="pet-delete">
                <On>
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
