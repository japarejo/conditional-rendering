import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  HStack,
  IconButton,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { Pet } from "api/Pet";
import { PetRequest } from "api/PetRequest";
import axios from "axios";
import AppLink from "components/common/AppLink";
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
  const canRead = useFeature("pet-read");
  const canEdit = useFeature("pet-edit");

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
      {/* <HStack spacing="20px">
        <IconButton
          colorScheme="blue"
          aria-label="Back"
          icon={<ArrowBackIcon />}
        />
        <Text>Page 1</Text>
        <IconButton
          colorScheme="blue"
          aria-label="Forward"
          icon={<ArrowForwardIcon />}
        />
      </HStack> */}
      <Table maxW="1000px">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Quantity</Th>
            <Th>Category</Th>
            {canRead && <Th>Edit</Th>}
            <Feature id="pet-delete">
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
              {canRead && (
                <Td>
                  <LinkButton
                    to={`/pet/${pet.id}`}
                    as={Button}
                    colorScheme="green"
                  >
                    {canEdit ? "Edit" : "View"}
                  </LinkButton>
                </Td>
              )}
              <Feature id="pet-delete">
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
