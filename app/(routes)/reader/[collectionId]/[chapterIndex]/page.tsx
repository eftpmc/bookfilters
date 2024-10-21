"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCollection } from '@/contexts/CollectionContext';
import { Collection, Chapter } from '@/types'; // Import types
import { ChevronLeft, ChevronRight, List, ArrowLeft } from 'lucide-react';

const Reader = () => {
    const { collectionId, chapterIndex } = useParams(); // Get collection and chapter index from the route
    const { collections } = useCollection(); // Get collections from the context
    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [contentType, setContentType] = useState<'text' | 'image'>('text');
    const [collection, setCollection] = useState<Collection | null>(null);
    const router = useRouter(); // Get router for navigation

    useEffect(() => {
        if (collectionId && chapterIndex) {
            // Find the collection and chapter based on the route parameters
            const selectedCollection = collections.find(c => c.id === collectionId);
            if (selectedCollection) {
                setCollection(selectedCollection);
                const selectedChapter = selectedCollection.chapters[parseInt(chapterIndex, 10)];
                setChapter(selectedChapter);
                setContentType(selectedCollection.contentType);
            }
        }
    }, [collectionId, chapterIndex, collections]);

    const handleNavigation = (newIndex: number) => {
        if (collection && newIndex >= 0 && newIndex < collection.chapters.length) {
            router.push(`/reader/${collectionId}/${newIndex}`);
        }
    };

    const handleTableOfContents = () => {
        // Navigate to a TOC page or implement a modal for chapter selection
        console.log("Table of contents clicked");
    };

    const handleBackToCollections = () => {
        router.push(`/`); // Adjust this path according to your collections page route
    };

    if (!chapter) return <p>Loading...</p>;

    return (
        <div className="min-h-screen flex flex-col bg-base-300 shadow-lg text-gray-200">
            {/* Header */}
            <header className="bg-base-100 p-4 flex justify-between items-center">
                <button onClick={handleBackToCollections} className="text-gray-400 hover:text-white flex items-center space-x-2">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>
                <h1 className="text-xl font-semibold">{collection?.name || 'Untitled Collection'}</h1>
                <div className="flex space-x-4">
                    <button
                        onClick={() => handleNavigation(parseInt(chapterIndex, 10) - 1)}
                        disabled={parseInt(chapterIndex, 10) === 0}
                        className="text-gray-400 hover:text-white"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button onClick={handleTableOfContents} className="text-gray-400 hover:text-white flex items-center space-x-2">
                        <List className="w-6 h-6" />
                        <span>Table of contents</span>
                    </button>
                    <button
                        onClick={() => handleNavigation(parseInt(chapterIndex, 10) + 1)}
                        disabled={parseInt(chapterIndex, 10) >= (collection?.chapters.length || 0) - 1}
                        className="text-gray-400 hover:text-white"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* Reader Content */}
            <div className="flex-grow p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">{chapter.chapterTitle}</h2>

                {contentType === 'text' && chapter.paragraphs ? (
                    <div className="space-y-4 text-base leading-relaxed">
                        {chapter.paragraphs.map((paragraph, index) => (
                            <p key={index} className="text-gray-300">{paragraph}</p>
                        ))}
                    </div>
                ) : contentType === 'image' && chapter.images ? (
                    <div className="grid grid-cols-1 gap-4">
                        {chapter.images.map((image, index) => (
                            <img key={index} src={image} alt={`Chapter Image ${index + 1}`} className="rounded-lg shadow-md" />
                        ))}
                    </div>
                ) : (
                    <p>No content available for this chapter.</p>
                )}
            </div>

            {/* Footer with Chapter Navigation */}
            <footer className="bg-base-100 shadow-lg p-4 flex justify-between items-center">
                <button
                    onClick={() => handleNavigation(parseInt(chapterIndex, 10) - 1)}
                    disabled={parseInt(chapterIndex, 10) === 0}
                    className="btn btn-sm bg-base-content text-base-300 flex items-center space-x-2"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Previous Chapter</span>
                </button>

                <button
                    onClick={() => handleNavigation(parseInt(chapterIndex, 10) + 1)}
                    disabled={parseInt(chapterIndex, 10) >= (collection?.chapters.length || 0) - 1}
                    className="btn btn-sm bg-base-content text-base-300 flex items-center space-x-2"
                >
                    <span>Next Chapter</span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            </footer>
        </div>
    );
};

export default Reader;