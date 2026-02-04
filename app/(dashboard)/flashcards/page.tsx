"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/file-upload";
import { Flashcard } from "@/components/flashcard";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Download } from "lucide-react";

interface FlashcardData {
    question: string;
    answer: string;
}

export default function FlashcardsPage() {
    const [text, setText] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleGenerate = async (inputType: "text" | "file") => {
        setLoading(true);
        setFlashcards([]);

        try {
            let content = text;

            if (inputType === "file" && file) {
                const formData = new FormData();
                formData.append("file", file);

                const extractResponse = await fetch("/api/summarize", {
                    method: "POST",
                    body: formData,
                });

                if (!extractResponse.ok) throw new Error("Failed to extract text");
                const extractData = await extractResponse.json();
                content = extractData.summary;
            }

            if (!content.trim()) {
                throw new Error("No content to generate flashcards from");
            }

            const response = await fetch("/api/generate-flashcards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: content }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to generate flashcards");
            }

            const data = await response.json();
            setFlashcards(data.flashcards);

            toast({
                title: "Success",
                description: `Generated ${data.flashcards.length} flashcards`,
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to generate flashcards",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const content = flashcards
            .map((card, i) => `Card ${i + 1}\nQ: ${card.question}\nA: ${card.answer}\n`)
            .join("\n");

        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "flashcards.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">AI Flashcard Generator</h1>
                <p className="text-muted-foreground">
                    Convert your notes into interactive Q&A flashcards automatically
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Input Section */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Input Content</CardTitle>
                        <CardDescription>Provide text or upload a file</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="text" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="text">Text</TabsTrigger>
                                <TabsTrigger value="file">File</TabsTrigger>
                            </TabsList>
                            <TabsContent value="text" className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="text">Enter your notes</Label>
                                    <Textarea
                                        id="text"
                                        placeholder="Paste your notes here..."
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        rows={10}
                                    />
                                </div>
                                <Button
                                    onClick={() => handleGenerate("text")}
                                    disabled={!text.trim() || loading}
                                    className="w-full"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        "Generate Flashcards"
                                    )}
                                </Button>
                            </TabsContent>
                            <TabsContent value="file" className="space-y-4">
                                <FileUpload accept=".pdf,.txt,.docx" onFileSelect={setFile} />
                                <Button
                                    onClick={() => handleGenerate("file")}
                                    disabled={!file || loading}
                                    className="w-full"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        "Generate Flashcards"
                                    )}
                                </Button>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Flashcards Display */}
                <div className="lg:col-span-2">
                    {loading ? (
                        <div className="flex items-center justify-center h-96">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : flashcards.length > 0 ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">
                                    {flashcards.length} Flashcards Generated
                                </h2>
                                <Button onClick={handleDownload} variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {flashcards.map((card, index) => (
                                    <Flashcard
                                        key={index}
                                        question={card.question}
                                        answer={card.answer}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <Card className="h-96 flex items-center justify-center">
                            <p className="text-muted-foreground">
                                Enter text or upload a file to generate flashcards
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
