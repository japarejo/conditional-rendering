import FeatureRetriever from "lib/components/feature/FeatureRetriever";
import { attribute } from "./Attribute";
import { feature } from "./Feature";

export function makeFeatureAttributeRetrievers(featureRetriever: FeatureRetriever)
{
    return {
        feature: (featureId: string) => feature(featureId, featureRetriever),
        attribute: (attributeId: string) => attribute(attributeId, featureRetriever)
    };
}