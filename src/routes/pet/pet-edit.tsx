import { Box, Spinner, useToast, VStack } from "@chakra-ui/react";
import { dataAttr } from "@chakra-ui/utils";
import { Pet } from "api/Pet";
import axios from "axios";
import EditForm from "components/feature/EditForm";
import { Feature, Off, On } from "lib/components/feature/Feature";
import useFeature from "lib/components/feature/useFeature";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "routes/main";

export default function PetEdit() {
  let params = useParams();
  let navigate = useNavigate();
  const [pet, setPet] = useState<Pet | undefined>(undefined);
  const [loading, setLoading] = useState(Boolean(params.petId));
  const [error, setError] = useState<string | undefined>(undefined);
  const toast = useToast();
  const canRead = useFeature("pet-read");
  const canAdd = useFeature("pet-add");

  useEffect(() => {
    if (canRead && params.petId) {
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
  }, [params.petId]);

  if (loading) {
    return <Spinner />;
  }
  if (error) return <Box>{error}</Box>;

  return (
    <VStack px="20px">
      <Box maxW="400px" w="100%">
          {(canRead || canAdd) ? (
            <EditForm pet={pet} />
          ) : "You're not authorized to use this feature"}
      </Box>
    </VStack>
  );
}
