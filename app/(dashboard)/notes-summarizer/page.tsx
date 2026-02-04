"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Download, FileText } from "lucide-react";

export default function NotesSummarizerPage() {
    const [file, setFile] = useState<File | null>(null);
    const [summary, setSummary] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSummarize = async () => {
        if (!file) return;

        setLoading(true);
        setSummary("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/summarize", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to summarize");
            }

            const data = await response.json();
            setSummary(data.summary);

            toast({
                title: "Success",
                description: "Document summarized successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to summarize document",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([summary], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `summary-${file?.name || "document"}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">AI Notes Summarizer</h1>
                <p className="text-muted-foreground">
                    Upload your PDF, TXT, or DOCX files and get instant AI-powered summaries
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Document</CardTitle>
                        <CardDescription>
                            Select a file to summarize (PDF, TXT, or DOCX)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FileUpload
                            accept=".pdf,.txt,.docx"
                            onFileSelect={setFile}
                        />
                        <Button
                            onClick={handleSummarize}
                            disabled={!file || loading}
                            className="w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Summarizing...
                                </>
                            ) : (
                                <>
                                    <FileText className="w-4 h-4 mr-2" />
                                    Generate Summary
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Summary Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                        <CardDescription>
                            AI-generated summary of your document
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : summary ? (
                            <div className="space-y-4">
                                <div className="bg-muted p-4 rounded-md max-h-96 overflow-y-auto">
                                    <p className="whitespace-pre-wrap">{summary}</p>
                                </div>
                                <Button onClick={handleDownload} variant="outline" className="w-full">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Summary
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-muted-foreground">
                                <p>Upload a document and click "Generate Summary" to see results</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
