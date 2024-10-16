export function chunkHtmlContent(html: string, maxLength: number = 4000): string[] {
    const chunks = [];
    for (let i = 0; i < html.length; i += maxLength) {
        chunks.push(html.substring(i, i + maxLength));
    }
    return chunks;
}

export function cleanAndFixJson(response: string): string {
    let cleaned = response.trim();

    // Remove markdown fences if they exist
    if (cleaned.startsWith('```json')) {
        cleaned = cleaned.slice(7, -3).trim();
    }

    // Fix common JSON issues
    cleaned = cleaned.replace(/,\s*}/g, '}'); // Remove trailing commas in objects
    cleaned = cleaned.replace(/,\s*]/g, ']'); // Remove trailing commas in arrays
    cleaned = cleaned.replace(/(\w+):/g, '"$1":'); // Ensure property names are quoted
    cleaned = cleaned.replace(/""p":/g, '"p":'); // Fix specific misquoted case

    return cleaned;
}
