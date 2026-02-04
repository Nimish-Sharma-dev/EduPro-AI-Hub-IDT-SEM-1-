import { NextRequest, NextResponse } from "next/server";
import { generateCompletion } from "@/lib/llm";

export async function POST(request: NextRequest) {
    try {
        const { message, websiteContent, websiteTitle } = await request.json();

        if (!message || !websiteContent) {
            return NextResponse.json(
                { error: "Message and website content are required" },
                { status: 400 }
            );
        }

        const systemPrompt = `You are a helpful AI assistant that answers questions about website content. You have been provided with the content from a website titled "${websiteTitle}". Answer questions based solely on this content. If the answer cannot be found in the provided content, say so clearly.

Website Content:
${websiteContent}`;

        const response = await generateCompletion(message, systemPrompt, 1000);

        return NextResponse.json({ response });
    } catch (error: any) {
        console.error("Chat error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate response" },
            { status: 500 }
        );
    }
}
