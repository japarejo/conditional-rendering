import React from "react";
import FeatureRetriever from "./FeatureRetriever";


export const FeatureContext = React.createContext<FeatureRetriever>(new FeatureRetriever());


