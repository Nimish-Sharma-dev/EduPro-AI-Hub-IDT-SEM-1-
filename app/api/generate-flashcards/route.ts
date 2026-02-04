import { NextRequest, NextResponse } from "next/server";
import { generateCompletion } from "@/lib/llm";

export async function POST(request: NextRequest) {
    try {
        const { text } = await request.json();

        if (!text || text.trim().length === 0) {
            return NextResponse.json(
                { error: "No text provided" },
                { status: 400 }
            );
        }

        const systemPrompt = `You are a helpful assistant that creates educational flashcards. Generate Q&A pairs from the provided text. Return ONLY a valid JSON array of objects with "question" and "answer" fields. Each question should be clear and concise, and each answer should be informative but brief. Generate 5-10 flashcards depending on the content length.`;

        const userPrompt = `Create flashcards from this text:\n\n${text}\n\nReturn only a JSON array like: [{"question": "...", "answer": "..."}]`;

        const completion = await generateCompletion(userPrompt, systemPrompt, 2000);

        // Parse the JSON response
        let flashcards;
        try {
            // Try to extract JSON from the response
            const jsonMatch = completion.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                flashcards = JSON.parse(jsonMatch[0]);
            } else {
                flashcards = JSON.parse(completion);
            }
        } catch (parseError) {
            // If parsing fails, create a fallback structure
            console.error("Failed to parse LLM response:", parseError);
            return NextResponse.json(
                { error: "Failed to generate valid flashcards format" },
                { status: 500 }
            );
        }

        if (!Array.isArray(flashcards) || flashcards.length === 0) {
            return NextResponse.json(
                { error: "No flashcards generated" },
                { status: 500 }
            );
        }

        return NextResponse.json({ flashcards });
    } catch (error: any) {
        console.error("Flashcard generation error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate flashcards" },
            { status: 500 }
        );
    }
}
