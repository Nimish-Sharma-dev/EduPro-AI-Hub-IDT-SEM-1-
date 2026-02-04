import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { generatePortfolioHTML, generatePortfolioCSS, type PortfolioData } from "@/lib/portfolio-templates";

export async function POST(request: NextRequest) {
    try {
        const data: PortfolioData = await request.json();

        // Validate required fields
        if (!data.name || !data.title || !data.email) {
            return NextResponse.json(
                { error: "Missing required fields: name, title, email" },
                { status: 400 }
            );
        }

        // Generate HTML and CSS
        const html = generatePortfolioHTML(data);
        const css = generatePortfolioCSS();

        // Create ZIP file
        const zip = new JSZip();
        zip.file("index.html", html);
        zip.file("styles.css", css);

        // Add README
        const readme = `# ${data.name}'s Portfolio

This is a generated portfolio website.

## How to Use

1. Extract this ZIP file
2. Open index.html in your web browser
3. Customize the content in index.html and styles.css as needed

## Deployment

You can deploy this portfolio to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

Simply upload the files to your hosting provider.
`;
        zip.file("README.md", readme);

        // Generate ZIP buffer
        const zipData = await zip.generateAsync({ type: "uint8array" });
        const zipBuffer = Buffer.from(zipData);

        // Return ZIP file
        return new NextResponse(zipBuffer, {
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename="${data.name.replace(/\s+/g, '-').toLowerCase()}-portfolio.zip"`,
            },
        });
    } catch (error: any) {
        console.error("Portfolio generation error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate portfolio" },
            { status: 500 }
        );
    }
}
