import React, { useContext, useEffect, useState } from "react";
import { FeatureContext } from "./FeatureContext";

export type FeatureValue = boolean | number | string;

export interface BooleanFeatureHookOptions {
  id?: string;
  ids?: string[];
  /**
   * Hardcoded value
   */
  value?: boolean;
  on?: React.ReactNode;
  off?: React.ReactNode;
  loading?: React.ReactNode;
  error?: React.ReactNode;
}

export interface ExpectedValueFeatureHookOptions
  extends BooleanFeatureHookOptions {
  /**
   * The flag will evaluate to true if the retrieved flag value if equal to this parameter.
   */
  expectedValue: FeatureValue;
}

export interface FeatureResponse {
  feature: JSX.Element;
}

export default function useNonBooleanFeature(
  options: ExpectedValueFeatureHookOptions
): FeatureResponse {
  const featureRetriever = useContext(FeatureContext);
  const [errored, setErrored] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState<FeatureValue | undefined>();

  if (!options.id && !options.ids) {
    throw new Error("Feature id or ids must be provided");
  }

  useEffect(() => {
    if ((options.id || options.ids) && options.value === undefined) {
      let idArray: string[] = [];
      if (options.ids) {
        idArray = options.ids;
      } else {
        idArray = [options.id!];
      }
      // Get the flag value
      featureRetriever
        .getFeature(idArray)
        .then((v) => {
          setValue(v);
          setIsLoading(false);
        })
        .catch(() => {
          setErrored(true);
          setIsLoading(false);
        });
    } else if (options.value) {
      setValue(options.value);
      setErrored(false);
      setIsLoading(false);
    }
  }, [
    options,
    options.id,
    options.ids,
    options.value,
    featureRetriever,
    featureRetriever.featureMap,
  ]);

  let returnedComponent: React.ReactNode;
  if (errored) {
    returnedComponent = options.error ?? <></>;
  } else if (isLoading) {
    returnedComponent = options.loading ?? <></>;
  } else {
    if (typeof value !== typeof options.expectedValue) {
      console.warn(
        "Feature value and expected value are not of the same type. Was this intended? Value=",
        value,
        " ExpectedValue=",
        options.expectedValue
      );
    }
    if (value === options.expectedValue) {
      returnedComponent = options.on ?? <></>;
    } else {
      returnedComponent = options.off ?? <></>;
    }
  }

  return {
    feature: <>{returnedComponent}</>,
  };
}
