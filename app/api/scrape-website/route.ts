import { NextRequest, NextResponse } from "next/server";
import { scrapeWebsite } from "@/utils/web-scraper";

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { error: "URL is required" },
                { status: 400 }
            );
        }

        const scrapedData = await scrapeWebsite(url);

        return NextResponse.json(scrapedData);
    } catch (error: any) {
        console.error("Scraping error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to scrape website" },
            { status: 500 }
        );
    }
}
