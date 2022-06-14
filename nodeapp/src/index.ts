// Basic express endpoint that returns true
// Code below
import express from "express";
import PetController from "./PetController";
import cors from "cors";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const FEATURE_MAP = {
  "pet-list": true,
  "pet-read": true,
  "pet-edit": true,
  "pet-add": true,
  "pet-delete": true,
  "pet-requests-remaining": 5,
  "pet-allowed-types": "dog cat bird snake",
};

// /feature
// Takes a JSON body list of string features
// Returns a Map with the requested feature and its value
// taken from the FEATURE_MAP above
app.post("/api/feature", async (req, res) => {
  console.log(req.body);
  const features = req.body as string[];
  const result = {};
  for (const feature of features) {
    console.log(feature);
    result[feature] = FEATURE_MAP[feature];
  }
  console.log(result);
  res.send(result);
});

app.use('/api/pet', PetController);

app.use(cors({
  origin: "http://localhost:3000"
}))

app.listen(4000, () => {
  console.log("Example app listening on port 4000!");
});
