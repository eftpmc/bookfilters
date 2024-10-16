import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { chunkHtmlContent } from '@/utils/helpers';
import { analyzeSelectorsWithAI } from '@/utils/openai';
import { scrapeAllPages } from '@/utils/scraper';

// Function to analyze the entire HTML page by chunking it and extracting CSS selectors
async function analyzePageForSelectors(html: string) {
    const chunks = chunkHtmlContent(html);
    const selectors = {
        titleSelector: '',
        contentSelector: '',
    };

    for (const chunk of chunks) {
        const chunkSelectors = await analyzeSelectorsWithAI(chunk);
        if (chunkSelectors) {
            selectors.titleSelector = selectors.titleSelector || chunkSelectors.titleSelector;
            selectors.contentSelector = selectors.contentSelector || chunkSelectors.contentSelector;
        }
    }

    return selectors;
}

// Main POST route handler
export async function POST(request: NextRequest) {
    try {
        const { url, startChapter, endChapter } = await request.json();

        if (!url || typeof startChapter !== 'number' || typeof endChapter !== 'number') {
            return NextResponse.json({ error: 'URL, starting chapter, and ending chapter are required' }, { status: 400 });
        }

        const pageLimit = endChapter - startChapter + 1;
        const response = await axios.get(url);
        const html = response.data;
        const selectors = await analyzePageForSelectors(html);

        if (!selectors.contentSelector) {
            return NextResponse.json({ error: 'Unable to locate book content on the page.' }, { status: 404 });
        }

        const chapters = [];

        // Callback to update progress on each chapter scrape
        const onChapterScraped = (chapterData, progress) => {
            console.log(`Progress: ${progress}%`);
            // Here you could implement a mechanism to send progress back to the client (e.g., websockets or server-sent events)
            chapters.push(chapterData);
        };

        // Scrape all pages
        await scrapeAllPages(url, selectors, startChapter, endChapter, pageLimit, onChapterScraped);

        return NextResponse.json({
            message: 'Book content scraped successfully',
            chapters,
        });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const runtime = "edge";