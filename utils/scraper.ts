import axios from 'axios';
import * as cheerio from 'cheerio';

// Helper function to extract book content from a single page
async function scrapeBookContentFromPage(url: string, selectors: any) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        // Use the AI-provided selectors to extract the title and paragraphs
        const title = $(selectors.titleSelector).text().trim();
        const paragraphs = $(selectors.contentSelector).map((i, el) => $(el).text().trim()).get();

        return { title, paragraphs };
    } catch (error) {
        console.error(`Error scraping page ${url}:`, error);
        return { title: '', paragraphs: [] };
    }
}

// Helper function to find the URL for the next page using AI-suggested selector and fallback options
async function getNextPageUrl($: cheerio.Root, currentUrl: string, selectors: any): Promise<string | null> {
    try {
        const nextPageLink = $(selectors.nextPageSelector).attr('href');
        if (nextPageLink) {
            return new URL(nextPageLink, currentUrl).href;
        }

        const fallbackNextPageLink = $('a[rel="next"], a:contains("Next"), button:contains("Next")').attr('href');
        if (fallbackNextPageLink) {
            return new URL(fallbackNextPageLink, currentUrl).href;
        }

        console.log('No next page found.');
    } catch (error) {
        console.error(`Error finding next page link:`, error);
    }
    return null;
}

// Function to scrape all pages for a book, based on chapter range and selectors
export async function scrapeAllPages(startUrl: string, selectors: any, startChapter: number, endChapter: number, pageLimit: number, onChapterScraped: (chapterData: any, progress: number) => void) {
    let currentPageUrl = startUrl;
    const allChapters = [];
    let currentChapter = startChapter;
    let pagesScraped = 0;

    try {
        while (currentPageUrl && currentChapter <= endChapter && pagesScraped < pageLimit) {
            console.log(`Scraping chapter ${currentChapter} at ${currentPageUrl}`);

            // Scrape content from the current page
            const { title, paragraphs } = await scrapeBookContentFromPage(currentPageUrl, selectors);

            const chapterData = { chapterTitle: `${title}`, paragraphs };
            allChapters.push(chapterData);

            // Increment counters
            pagesScraped++;
            currentChapter++;

            // Update progress and call the callback function to indicate the progress
            const progress = (pagesScraped / pageLimit) * 100;
            onChapterScraped(chapterData, progress);

            // Find the URL for the next page
            const response = await axios.get(currentPageUrl);
            const html = response.data;
            const $ = cheerio.load(html);
            currentPageUrl = await getNextPageUrl($, currentPageUrl, selectors);

            if (!currentPageUrl || pagesScraped >= pageLimit || currentChapter > endChapter) {
                break;
            }
        }

        return allChapters;
    } catch (error) {
        console.error('Error scraping all pages:', error);
        return allChapters; // Return whatever chapters we have even if an error occurs
    }
}