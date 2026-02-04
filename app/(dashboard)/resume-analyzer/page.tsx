"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Download, CheckCircle2, AlertCircle } from "lucide-react";

interface ResumeAnalysis {
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    improvedVersion: string;
}

export default function ResumeAnalyzerPage() {
    const [file, setFile] = useState<File | null>(null);
    const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleAnalyze = async () => {
        if (!file) return;

        setLoading(true);
        setAnalysis(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/analyze-resume", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to analyze resume");
            }

            const data = await response.json();
            setAnalysis(data);

            toast({
                title: "Success",
                description: "Resume analyzed successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to analyze resume",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!analysis) return;

        const content = `RESUME ANALYSIS REPORT
Score: ${analysis.score}/100

STRENGTHS:
${analysis.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

AREAS FOR IMPROVEMENT:
${analysis.weaknesses.map((w, i) => `${i + 1}. ${w}`).join('\n')}

SUGGESTIONS:
${analysis.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

IMPROVED VERSION:
${analysis.improvedVersion}
`;

        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resume-analysis.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">AI Resume Analyzer</h1>
                <p className="text-muted-foreground">
                    Get detailed analysis, scoring, and improvement suggestions for your resume
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Upload Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Resume</CardTitle>
                        <CardDescription>Upload your resume (PDF, TXT, or DOCX)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FileUpload accept=".pdf,.txt,.docx" onFileSelect={setFile} />
                        <Button onClick={handleAnalyze} disabled={!file || loading} className="w-full">
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                "Analyze Resume"
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Analysis Results */}
                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-96">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : analysis ? (
                        <>
                            {/* Score Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Overall Score</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-4xl font-bold">{analysis.score}/100</span>
                                        <Progress value={analysis.score} className="w-2/3" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Strengths */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        Strengths
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {analysis.strengths.map((strength, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-green-500 mt-1">•</span>
                                                <span>{strength}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Weaknesses */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-orange-500" />
                                        Areas for Improvement
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {analysis.weaknesses.map((weakness, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-orange-500 mt-1">•</span>
                                                <span>{weakness}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Suggestions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Improvement Suggestions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {analysis.suggestions.map((suggestion, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-primary mt-1">•</span>
                                                <span>{suggestion}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Download Button */}
                            <Button onClick={handleDownload} className="w-full">
                                <Download className="w-4 h-4 mr-2" />
                                Download Full Report
                            </Button>
                        </>
                    ) : (
                        <Card className="h-96 flex items-center justify-center">
                            <p className="text-muted-foreground">
                                Upload your resume to get started
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
