"use client";

import { useState } from 'react';
import UrlForm from './components/UrlForm';
import axios from 'axios';
import { Download, X } from 'lucide-react';  // Import the download and close icons from Lucide
import FileView from './components/FileView'; // Import the FileView component
import { useDownload } from '@/contexts/DownloadContext'; // Import useDownload hook

export default function Home() {
    const { downloads, addDownload } = useDownload(); // Access downloads and addDownload from context
    const [chapters, setChapters] = useState<any[] | null>(null); // Track current chapters being downloaded
    const [isModalOpen, setModalOpen] = useState(false); // Manage modal visibility

    const handleUrlSubmit = async (data: { url: string; startChapter: number; endChapter: number }) => {
        try {
            // Make a POST request to the API, sending URL and chapter range
            const response = await axios.post("/api/create-book", {
                url: data.url,
                startChapter: data.startChapter,
                endChapter: data.endChapter,
            });

            // Set the downloaded chapters in state
            setChapters(response.data.chapters);

            // Add the chapters to the download context
            addDownload(response.data.chapters);

            // Close the modal after submission
            setModalOpen(false);
        } catch (error) {
            console.error('Failed to download content:', error);
        }
    };

    return (
        <div className="flex flex-col w-full md:max-w-2xl mx-auto p-2 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-base-content">File View</h1>
                <button className="btn btn-primary flex items-center space-x-2" onClick={() => setModalOpen(true)}>
                    <Download className="w-5 h-5" />
                </button>
            </div>

            {/* Show the downloaded chapters or a message */}
            {chapters ? (
                <FileView chapters={chapters} />
            ) : (
                <div className="text-center text-gray-600">
                    <Download className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-base-content">No chapters downloaded yet.</p>
                    <p className="text-gray-500 mt-2">Start by downloading chapters!</p>
                </div>
            )}

            {/* Modal for URL form */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box relative">
                        <button
                            className="absolute top-2 right-2 btn btn-sm btn-circle"
                            onClick={() => setModalOpen(false)}
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

// Component to render previously downloaded chapters from context
const DownloadedChaptersView = () => {
    const { downloads } = useDownload();

    if (downloads.length === 0) {
        return (
            <div className="text-center text-gray-600">
                <Download className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl">No downloads available.</p>
                <p className="text-gray-500 mt-2">Once you download chapters, they’ll appear here.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {downloads.map((download, index) => (
                <div key={index} className="p-4 border rounded-md shadow-sm">
                    <FileView chapters={download} />
                </div>
            ))}
        </div>
    );
}