// openai.ts
import OpenAI from 'openai';
import { cleanAndFixJson } from './helpers';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeSelectorsWithAI(htmlChunk: string) {
    try {
        const aiResponse = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `You are an AI that analyzes web pages hosting books. 
                    Your task is to identify CSS selectors for book title, story content, and next page navigation buttons. 
                    Return the response as a valid JSON object with the format:
                    {
                      "titleSelector": "<CSS selector for title>",
                      "contentSelector": "<CSS selector for content>",
                      "nextPageSelector": "<CSS selector for next page button>"
                    }. Make sure this response is valid JSON.`,
                },
                {
                    role: 'user',
                    content: `Here is a section of HTML content from a page hosting a book:\n\n${htmlChunk}`,
                },
            ],
        });

        const rawResponse = aiResponse.choices[0]?.message?.content?.trim();
        const cleanedResponse = cleanAndFixJson(rawResponse || '');

        return JSON.parse(cleanedResponse);
    } catch (error) {
        console.error('Error analyzing selectors with AI:', error);
        return null;
    }
}