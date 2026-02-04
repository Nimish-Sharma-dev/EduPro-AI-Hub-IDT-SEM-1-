import { NextRequest, NextResponse } from "next/server";
import { extractTextFromFile } from "@/utils/file-processors";
import { generateCompletion } from "@/lib/llm";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Extract text from file
        const text = await extractTextFromFile(file);

        if (!text || text.trim().length === 0) {
            return NextResponse.json(
                { error: "No text could be extracted from the file" },
                { status: 400 }
            );
        }

        // Generate summary using LLM
        const systemPrompt = "You are a helpful assistant that creates concise, well-structured summaries of documents. Focus on key points, main ideas, and important details.";
        const userPrompt = `Please provide a comprehensive summary of the following text:\n\n${text}`;

        const summary = await generateCompletion(userPrompt, systemPrompt, 1000);

        return NextResponse.json({ summary });
    } catch (error: any) {
        console.error("Summarization error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to summarize document" },
            { status: 500 }
        );
    }
}
