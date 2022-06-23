// Basic express endpoint that returns true
// Code below
import express from "express";
import PetController from "./PetController";

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


// SOURCE: 
// https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue

// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  //res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


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

// Defining a route
app.use('/api/pet', PetController);

app.listen(4000, () => {
  console.log("Example app listening on port 4000!");
});
