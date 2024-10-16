// DownloadContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the context structure
interface DownloadContextType {
    downloads: any[];
    addDownload: (chapters: any[]) => void;
}

// Create the context
const DownloadContext = createContext<DownloadContextType | undefined>(undefined);

// Create a provider component
export const DownloadProvider = ({ children }: { children: ReactNode }) => {
    const [downloads, setDownloads] = useState<any[]>([]); // Manage downloads

    // Function to add a new download
    const addDownload = (chapters: any[]) => {
        setDownloads((prevDownloads) => [...prevDownloads, chapters]);
    };

    return (
        <DownloadContext.Provider value={{ downloads, addDownload }}>
            {children}
        </DownloadContext.Provider>
    );
};

// Custom hook to use the download context
export const useDownload = () => {
    const context = useContext(DownloadContext);
    if (!context) {
        throw new Error('useDownload must be used within a DownloadProvider');
    }
    return context;
};
