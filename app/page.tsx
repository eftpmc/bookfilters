"use client";

import { useEffect, useState } from 'react';
import { Download, Search, Plus, X } from 'lucide-react'; // Import icons
import Home from './components/Home';
import { useCollection } from '@/contexts/CollectionContext';

export default function Page() {
    const { collections, addCollection } = useCollection(); // Get collections and addCollection
    const [activeCollection, setActiveCollection] = useState(null); // State for active collection
    const [isModalOpen, setModalOpen] = useState(false); // Modal state for creating a new collection
    const [isUrlFormOpen, setUrlFormOpen] = useState(false); // State to control URL form modal
    const [newCollectionName, setNewCollectionName] = useState(''); // State for new collection name
    const [newContentType, setNewContentType] = useState<'text' | 'image'>('text'); // State for content type

    useEffect(() => {
        // Automatically select the first collection if available
        if (collections.length > 0 && !activeCollection) {
            setActiveCollection(collections[0]);
        }
    }, [collections, activeCollection]);

    // Handler for adding a new collection
    const handleAddCollection = () => {
        if (newCollectionName.trim() === '') {
            alert('Collection name cannot be empty');
            return;
        }
        // Ensure contentType defaults to 'text' if not set
        const newCollection = { name: newCollectionName, contentType: newContentType || 'text', chapters: [] };
        addCollection(newCollection.name, newCollection.chapters, newCollection.contentType); // Add collection with content type
        setModalOpen(false); // Close modal after adding
        setNewCollectionName(''); // Reset name input
    };

    const handleSetActiveCollection = (collection) => {
        setActiveCollection(collection);
    };

    return (
        <div className="drawer drawer-start">
            {/* Drawer checkbox to control open/close state */}
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col w-full mx-auto min-h-screen">
                {/* Navbar */}
                <div className="navbar bg-base-100">
                    <div className="navbar-start">
                        {/* Drawer toggle button */}
                        <label htmlFor="my-drawer" className="btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                        </label>
                    </div>
                    <div className="navbar-center">
                        <a className="btn btn-ghost text-xl">filterbooks</a>
                    </div>
                    <div className="navbar-end">
                        <button className="btn btn-ghost btn-circle">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="btn btn-ghost btn-circle" onClick={() => setUrlFormOpen(true)}>
                            <Download className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Main content */}
                <Home
                    activeCollection={activeCollection}
                    setActiveCollection={setActiveCollection}
                    setModalOpen={setModalOpen}
                    isModalOpen={isModalOpen}
                    isUrlFormOpen={isUrlFormOpen}  // Pass URL form modal state
                    setUrlFormOpen={setUrlFormOpen}  // Control URL form modal from Home
                />
            </div>

            {/* Drawer content */}
            <div className="drawer-side">
                {/* Drawer overlay for closing when clicking outside */}
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <div className="p-4 w-80 bg-base-300 text-base-content min-h-full">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-semibold">Collections</span>
                        {/* Add button to create a new collection */}
                        <button className="btn btn-ghost btn-circle" onClick={() => setModalOpen(true)}>
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                    <ul>
                        {collections.map((collection, index) => (
                            <li key={index} className="mb-2">
                                <a
                                    className="text-base-content cursor-pointer hover:underline"
                                    onClick={() => handleSetActiveCollection(collection)}
                                >
                                    {collection.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Modal for adding a new collection */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box relative">
                        <button
                            className="absolute top-2 right-2 btn btn-sm btn-circle"
                            onClick={() => setModalOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="font-bold text-lg mb-4">Create New Collection</h3>
                        <div className="flex flex-col space-y-4">
                            <input
                                type="text"
                                placeholder="Collection Name"
                                className="input input-bordered w-full"
                                value={newCollectionName}
                                onChange={(e) => setNewCollectionName(e.target.value)}
                            />
                            <select
                                className="select select-bordered w-full"
                                value={newContentType}
                                onChange={(e) => setNewContentType(e.target.value as 'text' | 'image')}
                            >
                                <option value="text">Text</option>
                                <option value="image">Image</option>
                            </select>
                            <button
                                className="btn btn-primary w-full"
                                onClick={handleAddCollection}
                            >
                                Add Collection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}