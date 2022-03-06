import FeatureRetriever from "lib/components/feature/FeatureRetriever";
import NAryFunction from "./NAryFunction";
import { error, ResultValue, value } from "./ResultValue";

export class Feature implements NAryFunction<boolean> {
    featureId: string;
    featureRetriever: FeatureRetriever;

    constructor(featureId: string, featureRetriever: FeatureRetriever) {
        this.featureId = featureId;
        this.featureRetriever = featureRetriever;
    }

    async eval(): Promise<ResultValue<boolean>> {
        try {
            const feature = await this.featureRetriever.getFeature(this.featureId);
            if (typeof feature === "boolean") {
                return value(feature);
            } else {
                return error("Error evaluating Feature " + this.featureId + ". It was not a boolean. Recv value: " + feature);
            }
        } catch {
            return error("Error evaluating Feature: " + this.featureId + " Retrieval error");
        }
    }
}

/**
 * NAryFunction that returns a feature boolean value.
 * @param featureId Id of the feature
 * @param featureRetriever FeatureRetriever instance. Recommended to just call featureRetriever.getLogicFeature()
 * @returns 
 */
export function feature(featureId: string, featureRetriever: FeatureRetriever): NAryFunction<boolean> {
    return new Feature(featureId, featureRetriever);
}
