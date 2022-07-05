// Basic express endpoint that returns true
// Code below
import express from "express";
import { createClient } from "redis";
import PetController from "./PetController";
import { FeatureRequest } from "./protobuf/featureRequest";
import {
  FeatureResponse,
  FeatureResponse_Feature_ValueType,
} from "./protobuf/featureResponse";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const client = createClient();

// /feature
// Takes a JSON body list of string features
// Returns a Map with the requested feature and its value
// taken from the FEATURE_MAP above
app.post(
  "/api/feature",
  express.raw({ type: "application/octet-stream", limit: "2mb" }),
  async (req, res) => {
    console.log(req.body);
    const decodedBody = FeatureRequest.decode(req.body);
    const features = decodedBody.features as string[];
    console.log(decodedBody);
    const result: FeatureResponse = { featureMap: {} };
    for (const feature of features) {
      let type, featureValue;
      try {
        const redisValue = await client.get(feature);
        console.log(feature, redisValue);
        [type, featureValue] = redisValue.split("__");
      } catch {
        res.status(400).send("Feature doesnt exist");
        return;
      }
      if (type === "number") {
        result.featureMap[feature] = {
          valueType: FeatureResponse_Feature_ValueType.NUMERIC,
          numericValue: Number(featureValue),
          booleanValue: undefined,
          stringValue: undefined,
        };
      } else if (type === "boolean") {
        result.featureMap[feature] = {
          valueType: FeatureResponse_Feature_ValueType.BOOLEAN,
          numericValue: undefined,
          booleanValue: featureValue === "true",
          stringValue: undefined,
        };
      } else if (type === "string") {
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
  }
);

app.use("/api/pet", PetController);

(async () => {
  await client.connect();
  app.listen(4000, async () => {
    console.log("Example app listening on port 4000!");
  });
})();
