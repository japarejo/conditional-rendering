import React, { Suspense, useContext } from "react";
import { FeatureContext, FeatureMap } from "./FeatureContext";

interface FeatureProps {
  id: string;
  children: React.ReactNode;
}

export function On({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Off({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Loading({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Feature({ id, children }: FeatureProps) {

  const context = useContext<FeatureMap>(FeatureContext);

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

  // TODO: Inject loading property here to the lazy components

  if (context[id]) {
    return <Suspense fallback={loading}>{onChildren}</Suspense>;
  } else {
    return <>{offChildren}</>;
  }
}
