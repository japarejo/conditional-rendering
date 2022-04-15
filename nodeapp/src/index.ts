// Basic express endpoint that returns true
// Code below
import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const FEATURE_MAP = {
    "pet-list": true,
    "pet-read": true,
    "pet-edit": false,
    "pet-add": false,
    "pet-delete": false,
    "pet-requests-remaining": 5,
    "pet-allowed-types": "dog cat bird snake"
}

// /feature
// Takes a JSON body list of string features
// Returns a Map with the requested feature and its value
// taken from the FEATURE_MAP above
app.post("/feature", async (req, res) => {
    const features = req.body as string[];
    const result = new Map<string, any>();
    for (const feature of features) {
        result.set(feature, FEATURE_MAP[feature]);
    }
    res.send(result);
});

app.listen(4000, () => {
    console.log("Example app listening on port 4000!");
});