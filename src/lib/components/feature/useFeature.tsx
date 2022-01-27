import { useContext } from "react";
import { FeatureContext } from "./FeatureContext";

export default function useFeature(id: string) {
    const featureMap = useContext(FeatureContext);
    return Boolean(featureMap[id]);
}