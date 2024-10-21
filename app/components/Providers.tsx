// providers/Providers.tsx
"use client"; // Ensure this is a client component

import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { CollectionProvider } from "@/contexts/CollectionContext";
import { store } from "@/utils/redux/store";

interface ProvidersProps {
    children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <ReduxProvider store={store}>
            <CollectionProvider>{children}</CollectionProvider>
        </ReduxProvider>
    );
};

export default Providers;
