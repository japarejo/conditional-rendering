import React from "react";
import FeatureRetriever from "./FeatureRetriever";

interface AppContext {
  // featureRetrievers: {
  //   feature: (featureName: string) => NAryFunction<boolean>;
  //   attribute: (featureName: string) => NAryFunction<AttributeValue>;
  // };
  featureRetriever: FeatureRetriever;
}

export const FeatureContext = React.createContext<AppContext>({
  // featureRetrievers: {
  //   ...makeFeatureAttributeRetrievers(new FeatureRetriever()),
  // },
  featureRetriever: new FeatureRetriever(),
});
