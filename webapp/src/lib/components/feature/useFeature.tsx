import useNonBooleanFeature, { BooleanFeatureHookOptions, FeatureResponse } from "./useNonBooleanFeature";


export default function useFeature(options: BooleanFeatureHookOptions): FeatureResponse {
 
  return useNonBooleanFeature({
    ...options,
    expectedValue: true
  });
}
