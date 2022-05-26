import { Box, Spinner, useToast, VStack } from "@chakra-ui/react";
import { Pet } from "api/Pet";
import axios from "axios";
import EditForm from "components/feature/EditForm";
import useGenericFeature from "lib/components/feature/useGenericFeature";
import { or } from "lib/logic/model/BinaryLogicalPredicate";
import { feature } from "lib/logic/model/Feature";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PetEdit() {
  let params = useParams();
  const [pet, setPet] = useState<Pet | undefined>(undefined);
  const [loading, setLoading] = useState(Boolean(params.petId));
  const [error, setError] = useState<string | undefined>(undefined);
  const toast = useToast();

  const readAddFeature = useGenericFeature({
    on: [
      {
        expression: feature("pet-add"),
        on: <EditForm pet={pet} />
      },
      {
        expression: feature("pet-read"),
        on: <EditForm pet={pet} readOnly />
      },
    ],
    default: "You're not authorized to use this feature"
  })

  useEffect(() => {
    if (params.petId) {
      axios
        .get<Pet>(`/api/pet/${params.petId}`)
        .then((data) => {
          if (!data.data) throw new Error("Pet not found!");
          else setPet(data.data);
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Error loading pet",
            status: "error",
          });
          setError("Pet not found!");
        })
        .finally(() => setLoading(false));
    }
  }, [toast, params.petId]);

  if (loading) {
    return <Spinner />;
  }
  if (error) return <Box>{error}</Box>;

  return (
    <VStack px="20px">
      <Box maxW="400px" w="100%">
          {readAddFeature}
      </Box>
    </VStack>
  );
}
