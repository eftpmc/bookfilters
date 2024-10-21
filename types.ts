// Define the type of content a chapter can have
export type ContentType = 'text' | 'image';

export interface Chapter {
    chapterTitle: string;
    paragraphs?: string[]; // Used if the content is text
    images?: string[]; // Used if the content is images
}

// Collection interface now includes contentType to indicate if it's a text or image collection
export interface Collection {
    id: string;
    name: string;
    selectors: number[];
    contentType: ContentType; // 'text' or 'image', indicating the type of content this collection holds
    chapters: Chapter[]; // Chapters can now either be text-based or image-based
}
