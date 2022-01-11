import { lazy, Suspense } from "react";

interface LazyComponentProps {
    Component: React.LazyExoticComponent<any>;
    loading: React.ReactChild;
}

// Passing it as a string prop with the import path
// doesn't work because it messes up webpack's static analysis
// and won't know what to bundle

export default function LazyComponent({Component, loading}: LazyComponentProps) {
    // Using suspense
    // const Component = lazy(async () => {
    //     const c = await import(importPath);
    //     return {default: c.default};
    // });
    return (
        <Suspense fallback={loading}>
            <Component />
        </Suspense>
    )
}