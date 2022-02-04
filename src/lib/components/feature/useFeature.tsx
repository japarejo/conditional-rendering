import { useWhatChanged } from "@simbathesailor/use-what-changed";
import React, { useContext, useEffect, useState } from "react";
import { FeatureContext } from "./FeatureContext";

export interface FeatureHookOptions {
  id?: string;
  ids?: string[];
  value?: boolean;
  on?: React.ReactNode;
  off?: React.ReactNode;
  loading?: React.ReactNode;
  error?: React.ReactNode;
}

export interface FeatureResponse {
  feature: JSX.Element;
  enabled: boolean;
  loading: boolean;
  error: boolean;
}

export default function useFeature(options: FeatureHookOptions): FeatureResponse {
  const featureRetriever = useContext(FeatureContext);
  const [errored, setErrored] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState<boolean | undefined>();

  if (!options.id && !options.ids) {
    throw new Error("Feature id or ids must be provided");
  }

  useEffect(() => {
    // console.error("triggered");
    if ((options.id || options.ids) && options.value === undefined) {
      let idArray: string[] = [];
      if (options.ids) {
        idArray = options.ids;
      } else {
        idArray = [options.id!];
      }
    //   console.log(options.id ?? options.ids, "STARTED USEEFFECT");
      featureRetriever
        .getFeature(idArray)
        .then((v) => {
          setValue(v);
          setIsLoading(false);
        //   console.log(options.id ?? options.ids, "WE THEN");
        })
        .catch(() => {
          setErrored(true);
          setIsLoading(false);
        //   console.log(options.id ?? options.ids, "WE CAUGHT");
        })
        // .finally(() => {
        //   setIsLoading(false);
        //   console.log(options.id ?? options.ids, "WE FINALLY");
        // });
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
//   console.log(options.id ?? options.ids, isLoading);
  let returnedComponent: React.ReactNode;
  if (errored) {
    // console.error(options.id ?? options.ids, options.error);
    returnedComponent = options.error ?? <></>;
  } else if (isLoading) {
    returnedComponent = options.loading ?? <></>;
  } else if (value!) {
    returnedComponent = options.on ?? <></>;
  } else {
    returnedComponent = options.off ?? <></>;
  }
  // console.warn(returnedComponent);
  return {
    feature: <>{returnedComponent}</>,
    enabled: value!,
    loading: isLoading,
    error: errored,
  };
}
