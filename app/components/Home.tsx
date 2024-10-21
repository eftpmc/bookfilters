"use client";

import { X } from 'lucide-react';
import CollectionCard from './CollectionCard';
import UrlForm from './UrlForm';
import axios from 'axios';
import React, { useState } from 'react';
import { useCollection } from '@/contexts/CollectionContext';

interface HomeProps {
    isUrlFormOpen: boolean;
    setUrlFormOpen: (open: boolean) => void;
    activeCollection: any;
    setActiveCollection: (collection: any) => void;
}

export default function Home({ isUrlFormOpen, setUrlFormOpen, activeCollection, setActiveCollection }: HomeProps) {
    const { collections, addCollection, updateCollection } = useCollection();
    const [tempName, setTempName] = useState<string | null>(null); // State to store temporary name changes

    const handleUrlSubmit = async (data: { url: string; startChapter: number; endChapter: number, contentType: 'text' | 'image' }) => {
        try {
            // Update the API call to use the new route that scrapes chapters
            const response = await axios.post("/api/get-url-chapters", {
                url: data.url,
                startChapter: data.startChapter,
                endChapter: data.endChapter,
                contentType: data.contentType,  // Include the contentType in the request
            });

            const chapters = response.data.chapters;

            if (activeCollection) {
                // Don't overwrite the content type if the collection already exists
                const updatedChapters = [...activeCollection.chapters, ...chapters];
                const updatedContentType = activeCollection.contentType || data.contentType;

                const updatedCollection = {
                    ...activeCollection,
                    chapters: updatedChapters,
                    contentType: updatedContentType
                };

                // Update in context and state
                updateCollection(activeCollection.id, updatedCollection);
                setActiveCollection(updatedCollection);
            } else {
                // Create a new collection if there isn't an active one
                const newCollectionName = `Collection ${collections.length + 1}`;
                const newCollection = addCollection(newCollectionName, chapters, data.contentType);

                // Set the newly created collection as the active one
                setActiveCollection(newCollection);
            }

            // Close the modal after submission
            setUrlFormOpen(false);
        } catch (error) {
            console.error('Failed to scrape content:', error);
        }
    };

    const handleNameChange = (newName: string) => {
        setTempName(newName); // Temporarily store the name
    };

    const persistNameChange = () => {
        if (activeCollection && tempName !== null) {
            const updatedCollection = { ...activeCollection, name: tempName };

            // Commit the name change to context and state
            updateCollection(activeCollection.id, { name: tempName }); // Use partial update here
            setActiveCollection(updatedCollection); // Update active collection with the new name

            // Reset temporary name after saving
            setTempName(null);
        }
    };

    const cancelNameChange = () => {
        // Reset tempName when user cancels
        setTempName(null);
    };

    return (
        <div className="flex flex-col w-full md:max-w-2xl mx-auto p-2 min-h-screen">
            {/* Show the selected active collection's chapters */}
            {activeCollection ? (
                <CollectionCard
                    collections={[activeCollection]}
                    tempName={tempName || activeCollection.name} // Pass tempName or the saved name to CollectionCard
                    onNameChange={handleNameChange} // Pass handler for name changes
                    onSave={persistNameChange} // Pass handler for saving the name
                    onCancel={cancelNameChange} // Pass handler for canceling the name change
                />
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[80%]">
                    <p className="text-xl text-base-content">No collection selected.</p>
                    <p className="text-gray-500 mt-2 mb-4">Please select a collection or create a new one.</p>
                    <button className="btn btn-primary" onClick={() => setUrlFormOpen(true)}>
                        Create New Collection
                    </button>
                </div>
            )}

            {/* Modal for URL form */}
            {isUrlFormOpen && (
                <div className="modal modal-open">
                    <div className="modal-box relative">
                        <button
                            className="absolute top-2 right-2 btn btn-sm btn-circle"
                            onClick={() => setUrlFormOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="font-bold text-lg mb-4">Scrape URL</h3>
                        <UrlForm onSubmit={handleUrlSubmit} />
                    </div>
                </div>
            )}
        </div>
    );
}
