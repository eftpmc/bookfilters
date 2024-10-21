"use client";

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/redux/store';
import {
    addCollection as addReduxCollection,
    updateCollection as updateReduxCollection,
    updateCollectionSelectors as updateReduxCollectionSelectors,
    deleteCollection as deleteReduxCollection,
} from '@/utils/redux/collectionsSlice';
import { Collection, ContentType } from '@/types';  // Import types from types.ts

// Define the context structure
interface CollectionContextType {
    collections: Collection[];
    addCollection: (name: string, chapters: any[], contentType: ContentType) => void;
    updateCollection: (id: string, newCollection: Collection) => void;
    updateCollectionSelectors: (id: string, selectors: number[]) => void;
    deleteCollection: (id: string) => void;
    isLoading: boolean;  // Tracks loading state
}

// Create the context
const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

// Create a provider component
export const CollectionProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);  // State to track if data is loading
    const collections = useSelector((state: RootState) => state.collections.collections);
    const dispatch = useDispatch();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Function to add a new collection with contentType
    const addCollection = (name: string, chapters: any[], contentType: ContentType) => {
        const newCollection: Collection = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            selectors: [],
            chapters,
            contentType,  // Use contentType here from types
        };
        dispatch(addReduxCollection(newCollection));
    };

    // Function to update the selectors for a specific collection
    const updateCollectionSelectors = (id: string, selectors: number[]) => {
        dispatch(updateReduxCollectionSelectors({ id, selectors }));
    };

    // Function to update a collection
    const updateCollection = (id: string, updatedCollection: Collection) => {
        dispatch(updateReduxCollection({ ...updatedCollection, id }));
    };

    // Function to delete a collection
    const deleteCollection = (id: string) => {
        dispatch(deleteReduxCollection(id));
    };

    return (
        <CollectionContext.Provider
            value={{
                collections: isLoading ? [] : collections,  // Return empty array while loading
                addCollection,
                updateCollection,
                updateCollectionSelectors,
                deleteCollection,
                isLoading,  // Pass loading state to consumers
            }}
        >
            {children}
        </CollectionContext.Provider>
    );
};

// Custom hook to use the collection context
export const useCollection = () => {
    const context = useContext(CollectionContext);
    if (!context) {
        throw new Error('useCollection must be used within a CollectionProvider');
    }
    return context;
};
