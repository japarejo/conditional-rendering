import FeatureRetriever, { AttributeValue } from "lib/components/feature/FeatureRetriever";
import NAryFunction from "./NAryFunction";
import { error, ResultValue, value } from "./ResultValue";

export class Attribute implements NAryFunction<AttributeValue> {
    attributeId: string;
    featureRetriever: FeatureRetriever;

    constructor(featureId: string, featureRetriever: FeatureRetriever) {
        this.attributeId = featureId;
        this.featureRetriever = featureRetriever;
    }

    async eval(): Promise<ResultValue<AttributeValue>> {
        try {
            const attribute = await this.featureRetriever.getAttribute(this.attributeId);
            if (typeof attribute === "boolean") {
                return error("Error evaluating Attribute " + this.attributeId + ". Got a boolean, expected number or string. Recv value: " + attribute);
            } else {
                return value(attribute);
            }
        } catch {
            return error("Error evaluating Attribute: " + this.attributeId + " Retrieval error");
        }
    }
}

/**
 * NAryFunction that returns an attribute value, which resolves to a number or string.
 * @param attributeId Id of the attribute
 * @param featureRetriever FeatureRetriever instance. Recommended to just call featureRetriever.getLogicAttribute()
 * @returns 
 */
export function attribute(attributeId: string, featureRetriever: FeatureRetriever): NAryFunction<AttributeValue> {
    return new Attribute(attributeId, featureRetriever);
}
