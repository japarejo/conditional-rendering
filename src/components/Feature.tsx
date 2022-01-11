import React from "react";
import { RecoilValue, useRecoilValue } from "recoil";


interface FeatureProps {
    id: RecoilValue<boolean>;
    children: (React.ReactElement<OnProps> | React.ReactElement<OffProps>)[];
}

interface OffProps {}
interface OnProps {}

export function On({children}: {children: React.ReactNode}) {
    return <>{children}</>;
}

export function Off({children}: {children: React.ReactNode}) {
    return <>{children}</>;
}

export function Loading({children}: {children: React.ReactNode}) {
    return <>{children}</>;
}

export function Feature({id, children}: FeatureProps) {
    const feature = useRecoilValue(id);

    // Gets children of Feature.On
    const onChildren = React.Children.toArray(children).filter(child => {
        const c = child as React.ReactElement;
        return c.type === On;
    });

    // Gets children of Feature.Off
    const offChildren = React.Children.toArray(children).filter(child => {
        const c = child as React.ReactElement;
        return c.type === Off;
    });

    // TODO: Inject loading property here to the lazy components

    if (feature)
    {
        return <>{onChildren}</>;
    }
    else {
        return <>{offChildren}</>;
    }
}