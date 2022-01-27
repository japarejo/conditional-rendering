import React from "react";

export interface FeatureMap {
    [key: string]: boolean;
}

export const FeatureContext = React.createContext<FeatureMap>({});


