import { Button, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export default function DeleteButton({petId, onDeleted} : {petId: string, onDeleted?: () => void}) {

    const [loading, setLoading] = useState(false);
    const toast = useToast();
    function onDeletePet() {
        setLoading(true);
        axios.delete(`/api/pet/${petId}`)
        .then(() => {
            toast({
                title: "Success",
                description: "Pet deleted",
                status: "success",
            });
            if (onDeleted)
                onDeleted();
        })
        .catch(() => {
            toast({
                title: "Error",
                description: "Error deleting pet",
                status: "error",
            });
        })
        .finally(() => setLoading(false));
    }

    return (
        <Button colorScheme="red" isLoading={loading} onClick={onDeletePet}>Delete</Button>
    )
}