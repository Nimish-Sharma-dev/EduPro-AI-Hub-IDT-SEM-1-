import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedContent {
    title: string;
    content: string;
    url: string;
}

export async function scrapeWebsite(url: string): Promise<ScrapedContent> {
    try {
        // Validate URL
        const urlObj = new URL(url);

        // Fetch the page
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
            timeout: 10000,
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // Remove script and style elements
        $('script, style, nav, footer, header').remove();

        // Extract title
        const title = $('title').text() || $('h1').first().text() || 'Untitled';

        // Extract main content
        let content = '';

        // Try to find main content area
        const mainContent = $('main, article, .content, #content, .post, .article');

        if (mainContent.length > 0) {
            content = mainContent.text();
        } else {
            // Fallback to body
            content = $('body').text();
        }

        // Clean up the content
        content = content
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, '\n')
            .trim();

        // Limit content length
        if (content.length > 50000) {
            content = content.substring(0, 50000) + '...';
        }

        return {
            title: title.trim(),
            content,
            url: urlObj.href,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Failed to fetch website: ${error.message}`);
        }
        throw new Error('Failed to scrape website');
    }
}
