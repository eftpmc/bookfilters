"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Edit, Trash2, MoreVertical, Save, X, FileText, ImageIcon } from 'lucide-react';
import { useCollection } from '@/contexts/CollectionContext';
import { Collection, Chapter } from '@/types';

interface CollectionCardProps {
    collections: Collection[];
    tempName: string;
    onNameChange: (newName: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

const CollectionCard = ({ collections, tempName, onNameChange, onSave, onCancel }: CollectionCardProps) => {
    const { updateCollection, deleteCollection } = useCollection();
    const [isModalOpen, setModalOpen] = useState<{ [index: string]: boolean }>({});
    const [currentEditingId, setCurrentEditingId] = useState<string | null>(null);
    const router = useRouter(); // Use Next.js router for navigation

    // Handle modal opening and setting tempName (for editing collection name)
    const toggleModal = (id: string, isOpen: boolean) => {
        setModalOpen({ ...isModalOpen, [id]: isOpen });
        if (isOpen) {
            setCurrentEditingId(id);
        } else {
            setCurrentEditingId(null);
            onCancel(); // Reset tempName when modal closes
        }
    };

    // Function to render the content type indicator
    const renderContentTypeIndicator = (contentType: 'text' | 'image') => {
        if (contentType === 'text') {
            return (
                <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                </div>
            );
        } else if (contentType === 'image') {
            return (
                <div className="flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5 text-green-500" />
                </div>
            );
        }
    };

    // Handle chapter click to navigate to the reader
    const handleChapterClick = (collectionId: string, chapterIndex: number) => {
        // Navigate to the reader route with collection ID and chapter index
        router.push(`/reader/${collectionId}/${chapterIndex}`);
    };

    return (
        <div>
            {collections.map((collection) => (
                <div key={collection.id} className="mb-6 p-4 rounded-lg bg-base-100 shadow-md">
                    {/* Collection Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <h2 className="text-lg font-semibold">{collection.name}</h2>
                            {renderContentTypeIndicator(collection.contentType)}
                        </div>

                        {/* Actions Dropdown */}
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-sm btn-ghost">
                                <MoreVertical className="w-5 h-5" />
                            </label>
                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                <li>
                                    <a onClick={() => exportChapters(collection.name)}>
                                        <Download className="w-5 h-5" /> Export
                                    </a>
                                </li>
                                <li>
                                    <a onClick={() => toggleModal(collection.id, true)}>
                                        <Edit className="w-5 h-5" /> Edit Name
                                    </a>
                                </li>
                                <li>
                                    <a onClick={() => deleteCollection(collection.id)}>
                                        <Trash2 className="w-5 h-5" /> Delete
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Chapter List */}
                    <div className="space-y-2">
                        {collection.chapters?.map((chapter, chapterIndex) => (
                            <div
                                key={chapterIndex}
                                className="flex items-center justify-between bg-base-300 p-2 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => handleChapterClick(collection.id, chapterIndex)} // Navigate on click
                            >
                                <div className="flex-grow text-sm font-medium truncate">
                                    {chapter.chapterTitle}
                                </div>
                            </div>
                        )) || <p>No chapters available.</p>}
                    </div>

                    {/* Modal for Editing Collection Name */}
                    {isModalOpen[collection.id] && (
                        <div className="modal modal-open">
                            <div className="modal-box relative">
                                <button
                                    className="absolute top-2 right-2 btn btn-sm btn-circle"
                                    onClick={() => toggleModal(collection.id, false)}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <h3 className="font-bold text-lg mb-4">Edit Collection Name</h3>
                                <div className="flex items-center space-x-2">
                                    <input
                                        className="input input-bordered w-full"
                                        value={tempName}
                                        onChange={(e) => onNameChange(e.target.value)}
                                    />
                                    <button className="btn btn-primary" onClick={onSave}>
                                        <Save className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// Dummy export function
const exportChapters = (collectionName: string) => {
    console.log(`Exporting chapters from Collection ${collectionName}`);
};

export default CollectionCard;