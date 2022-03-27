import FeatureRetriever from "lib/components/feature/FeatureRetriever";
import { ResultValue } from "./ResultValue";

export interface NAryFunctionOptions {
    featureRetriever?: FeatureRetriever;
}

export interface NAryFunction<T>
{
    eval: (options?: NAryFunctionOptions) => Promise<ResultValue<T>>;
}