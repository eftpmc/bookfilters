"use client";

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';  // Import the icons

interface FileViewProps {
    chapters: any[];
}

const FileView = ({ chapters }: FileViewProps) => {
    const [selectedChapters, setSelectedChapters] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    // Handle individual chapter selection
    const handleChapterSelect = (index: number) => {
        if (selectedChapters.includes(index)) {
            setSelectedChapters(selectedChapters.filter(chapterIndex => chapterIndex !== index));
        } else {
            setSelectedChapters([...selectedChapters, index]);
        }
    };

    // Handle "Select All" checkbox
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedChapters([]);
        } else {
            setSelectedChapters(chapters.map((_, index) => index));
        }
        setSelectAll(!selectAll);
    };

    return (
        <div>
            <div className="flex items-center mx-auto space-y-2 w-full border-b-2 border-primary pb-2">
                <input
                    type="checkbox"
                    className="checkbox checkbox-primary hover:bg-base-300"
                    checked={selectAll}
                    onChange={handleSelectAll}
                />
                <span className="ml-2 text-xs text-gray-600">
                    Select All
                </span>
            </div>
            <div className="space-y-2 mt-2">
                {chapters.map((chapter, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-base-100 rounded-md">
                        <input
                            type="checkbox"
                            className="checkbox checkbox-primary"
                            checked={selectedChapters.includes(index)}
                            onChange={() => handleChapterSelect(index)}
                        />
                        <div className="flex-grow text-xs font-medium truncate">
                            {chapter.chapterTitle}
                        </div>
                        {chapter.chapterTitle ? (
                            <CheckCircle className="text-green-500 w-5 h-5" />
                        ) : (
                            <XCircle className="text-red-500 w-5 h-5" />
                        )}
                    </div>
                ))}
            </div>
            <button
                className="btn btn-primary mt-4 w-32 text-xs"  // Adjusted the size of the button
                onClick={() => exportChapters(selectedChapters)}
                disabled={selectedChapters.length === 0}  // Disable the button if no chapters are selected
            >
                Export ({selectedChapters.length})
            </button>
        </div>
    );
};

// Dummy export function
const exportChapters = (selectedChapters: number[]) => {
    console.log("Exporting chapters:", selectedChapters);
    // Add logic to handle exporting of the selected chapters
};

export default FileView;