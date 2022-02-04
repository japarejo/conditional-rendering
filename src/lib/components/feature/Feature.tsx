import React, { Suspense } from "react";
import useFeature from "./useFeature";

type FeatureProps =
  | {
      flags: string | string[];
      value?: undefined;
    }
  | {
      flags?: undefined;
      value: boolean;
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

export function Feature({ flags, value, children }: FeaturePropsWithChildren) {
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
  const feature = useFeature({
    ...flagObj,
    value,
    on: onChildren,
    off: offChildren,
    loading,
    error,
  });

  // console.log(feature);
  return <>{feature.feature}</>;

  // return <Suspense fallback={loading}>{feature.feature}</Suspense>;

  // // TODO: Inject loading property here to the lazy components

  // if (context[id]) {
  //   return <Suspense fallback={loading}>{onChildren}</Suspense>;
  // } else {
  //   return <>{offChildren}</>;
  // }
}
