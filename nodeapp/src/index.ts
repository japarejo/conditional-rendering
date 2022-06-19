// Basic express endpoint that returns true
// Code below
import express from "express";
import PetController from "./PetController";
import { FeatureRequest } from "./protobuf/featureRequest";
import {
  FeatureResponse,
  FeatureResponse_Feature_ValueType,
} from "./protobuf/featureResponse";
import { Buffer } from "buffer";

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

// Check if is number, boolean or string, with a type guard
function isNumber(value: any): value is number {
  return typeof value === "number";
}

function isBoolean(value: any): value is boolean {
  return typeof value === "boolean";
}

function isString(value: any): value is string {
  return typeof value === "string";
}

// /feature
// Takes a JSON body list of string features
// Returns a Map with the requested feature and its value
// taken from the FEATURE_MAP above
app.post("/api/feature", express.raw({type: 'application/octet-stream', limit : '2mb'}), async (req, res) => {
  console.log(req.body);
  const decodedBody = FeatureRequest.decode(req.body);
  const features = decodedBody.features as string[];
  console.log(decodedBody);
  const result: FeatureResponse = { featureMap: {} };
  for (const feature of features) {
    console.log(feature);
    const featureValue = FEATURE_MAP[feature];
    if (isNumber(featureValue)) {
      result.featureMap[feature] = {
        valueType: FeatureResponse_Feature_ValueType.NUMERIC,
        numericValue: featureValue,
        booleanValue: undefined,
        stringValue: undefined,
      };
    } else if (isBoolean(featureValue)) {
      result.featureMap[feature] = {
        valueType: FeatureResponse_Feature_ValueType.BOOLEAN,
        numericValue: undefined,
        booleanValue: featureValue,
        stringValue: undefined,
      };
    } else if (isString(featureValue)) {
      result.featureMap[feature] = {
        valueType: FeatureResponse_Feature_ValueType.STRING,
        numericValue: undefined,
        booleanValue: undefined,
        stringValue: featureValue,
      };
    } else {
      throw new Error("Unknown feature type");
    }
  }
  const writer = FeatureResponse.encode(result);
  res.send(writer.finish());
});

app.use("/api/pet", PetController);

app.listen(4000, () => {
  console.log("Example app listening on port 4000!");
});
