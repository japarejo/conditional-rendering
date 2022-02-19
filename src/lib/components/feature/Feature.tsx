import React from "react";
import { FeatureValue } from "./FeatureRetriever";
import useNonBooleanFeature from "./useNonBooleanFeature";

type FeatureProps =
  | {
      flags: string | string[];
      value?: undefined;
      expectedValue?: FeatureValue
    }
  | {
      flags?: undefined;
      value: boolean;
      expectedValue?: undefined
    };

type FeaturePropsWithChildren = FeatureProps & { children: React.ReactNode };

export function On({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Off({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Loading({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function ErrorFallback({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Feature({ flags, value, children, expectedValue }: FeaturePropsWithChildren) {
  // Gets children of Feature.On
  const onChildren = React.Children.toArray(children).filter((child) => {
    const c = child as React.ReactElement;
    return c.type === On;
  });

  // Gets children of Feature.Off
  const offChildren = React.Children.toArray(children).filter((child) => {
    const c = child as React.ReactElement;
    return c.type === Off;
  });

  // Gets children of Feature.Loading
  const loading = React.Children.toArray(children).filter((child) => {
    const c = child as React.ReactElement;
    return c.type === Loading;
  });

  // Gets children of Feature.Error
  const error = React.Children.toArray(children).filter((child) => {
    const c = child as React.ReactElement;
    return c.type === ErrorFallback;
  });

  let flagObj = {};
  if (flags) {
    if (Array.isArray(flags))
    {
      flagObj = {
        ids: flags
      }
    } else {
      flagObj = {
        id: flags
      }
    }
  }
  
  const feature = useNonBooleanFeature({
    ...flagObj,
    value,
    on: onChildren,
    off: offChildren,
    loading,
    error,
    expectedValue: expectedValue??true
  });

  return <>{feature}</>;

  // return <Suspense fallback={loading}>{feature.feature}</Suspense>;

  // // TODO: Inject properties into children

}
