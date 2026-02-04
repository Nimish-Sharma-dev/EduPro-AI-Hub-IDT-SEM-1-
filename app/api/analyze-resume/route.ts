import { NextRequest, NextResponse } from "next/server";
import { extractTextFromFile } from "@/utils/file-processors";
import { generateCompletion } from "@/lib/llm";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Extract text from resume
        const resumeText = await extractTextFromFile(file);

        if (!resumeText || resumeText.trim().length === 0) {
            return NextResponse.json(
                { error: "No text could be extracted from the resume" },
                { status: 400 }
            );
        }

        // Analyze resume using LLM
        const systemPrompt = `You are an expert resume reviewer and career coach. Analyze resumes and provide detailed feedback including:
1. An overall score (0-100)
2. Key strengths (3-5 points)
3. Weaknesses or areas for improvement (3-5 points)
4. Specific actionable suggestions (3-5 points)
5. A brief improved version of key sections

Return your response as a valid JSON object with this exact structure:
{
  "score": number,
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "suggestions": ["suggestion1", "suggestion2", ...],
  "improvedVersion": "text"
}`;

        const userPrompt = `Analyze this resume and provide detailed feedback:\n\n${resumeText}`;

        const completion = await generateCompletion(userPrompt, systemPrompt, 2000);

        // Parse the JSON response
        let analysis;
        try {
            const jsonMatch = completion.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                analysis = JSON.parse(jsonMatch[0]);
            } else {
                analysis = JSON.parse(completion);
            }
        } catch (parseError) {
            console.error("Failed to parse LLM response:", parseError);
            return NextResponse.json(
                { error: "Failed to generate valid analysis format" },
                { status: 500 }
            );
        }

        // Validate the response structure
        if (
            typeof analysis.score !== "number" ||
            !Array.isArray(analysis.strengths) ||
            !Array.isArray(analysis.weaknesses) ||
            !Array.isArray(analysis.suggestions)
        ) {
            return NextResponse.json(
                { error: "Invalid analysis format received" },
                { status: 500 }
            );
        }

        return NextResponse.json(analysis);
    } catch (error: any) {
        console.error("Resume analysis error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to analyze resume" },
            { status: 500 }
        );
    }
}
