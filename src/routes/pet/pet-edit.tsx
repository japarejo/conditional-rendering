import { Box, Spinner, useToast, VStack } from "@chakra-ui/react";
import { Pet } from "api/Pet";
import axios from "axios";
import EditForm from "components/feature/EditForm";
import useFeature from "lib/components/feature/useFeature";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PetEdit() {
  let params = useParams();
  const [pet, setPet] = useState<Pet | undefined>(undefined);
  const [loading, setLoading] = useState(Boolean(params.petId));
  const [error, setError] = useState<string | undefined>(undefined);
  const toast = useToast();
  const readFeature = useFeature({
    id: "pet-read"
  });
  const addFeature = useFeature({
    id: "pet-add"
  });

  useEffect(() => {
    if (params.petId) {
      axios
        .get<Pet>(`http://localhost:8080/pet/${params.petId}`)
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
          {(readFeature || addFeature) ? (
            <EditForm pet={pet} />
          ) : "You're not authorized to use this feature"}
      </Box>
    </VStack>
  );
}
