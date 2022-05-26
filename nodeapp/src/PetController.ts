import express from "express";
import { InputPet, OutputPet } from "./model/Pet";

const PET_CATEGORIES = {
  1: { id: 1, name: "Dog" },
  2: { id: 2, name: "Cat" },
  3: { id: 3, name: "Bird" },
  4: { id: 4, name: "Reptile" },
  5: { id: 5, name: "Rodent" },
  6: { id: 6, name: "Horse" },
  7: { id: 7, name: "Fish" },
};

let petCounter = 0;

const PETS: { [key: number]: OutputPet } = {
  [++petCounter]: {
    name: "Labrador chocolate",
    quantity: 1,
    category: PET_CATEGORIES[1],
  },
  [++petCounter]: {
    name: "Yellow bird",
    quantity: 2,
    category: PET_CATEGORIES[3],
  },
};

// Express router controller
const PetController = express.Router();

PetController.post("/", (req, res) => {
  const pet = req.body as InputPet;
  // Validate
  if (
    !pet.name ||
    !pet.quantity ||
    !pet.category ||
    !PET_CATEGORIES[pet.category.id]
  ) {
    res.status(400).send("Missing required fields");
    return;
  }
  PETS[++petCounter] = { ...pet, category: PET_CATEGORIES[pet.category.id] };
  res.send(pet);
});

PetController.put("/", (req, res) => {
  // Update pet
  const pet = req.body as InputPet & { id: number };
  if (!pet.id) {
    res.status(400).send("Missing required fields");
    return;
  }
  if (!PETS[pet.id]) {
    res.status(404).send("Pet not found");
    return;
  }

  if (pet.category) {
    if (!PET_CATEGORIES[pet.category.id]) {
      res.status(400).send("Invalid category");
      return;
    }
  }
  PETS[pet.id] = {
    ...PETS[pet.id],
    ...pet,
    ...(pet.category && { category: PET_CATEGORIES[pet.category.id] }),
  };
  res.sendStatus(200);
});

PetController.get("/list", (req, res) => {
  // Map pets object to list of pets with id property using Object.entries
  const pets = Object.entries(PETS).map(([id, pet]) => ({ ...pet, id }));
  res.send(pets);
});

PetController.get("/category/list", (req, res) => {
  const cats = Object.values(PET_CATEGORIES);
  res.send(cats);
});

PetController.get("/:petId", (req, res) => {
  const petId = req.params.petId;
  if (!PETS[petId]) {
    res.status(404).send("Pet not found");
    return;
  }
  res.send(PETS[petId]);
});

PetController.delete("/:petId", (req, res) => {
  const petId = req.params.petId;
  if (!PETS[petId]) {
    res.status(404).send("Pet not found");
    return;
  }
  delete PETS[petId];
  res.sendStatus(200);
});

export default PetController;
