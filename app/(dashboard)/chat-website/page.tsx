"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Send, Globe } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatWebsitePage() {
    const [url, setUrl] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [scraping, setScraping] = useState(false);
    const [websiteContent, setWebsiteContent] = useState<string>("");
    const [websiteTitle, setWebsiteTitle] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleScrape = async () => {
        if (!url.trim()) return;

        setScraping(true);
        setMessages([]);
        setWebsiteContent("");
        setWebsiteTitle("");

        try {
            const response = await fetch("/api/scrape-website", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to scrape website");
            }

            const data = await response.json();
            setWebsiteContent(data.content);
            setWebsiteTitle(data.title);

            toast({
                title: "Success",
                description: `Scraped content from: ${data.title}`,
            });

            setMessages([
                {
                    role: "assistant",
                    content: `I've successfully loaded the content from "${data.title}". You can now ask me questions about this website!`,
                },
            ]);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to scrape website",
                variant: "destructive",
            });
        } finally {
            setScraping(false);
        }
    };

    const handleSendMessage = async () => {
        if (!input.trim() || !websiteContent) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("/api/chat-website", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input,
                    websiteContent,
                    websiteTitle,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to get response");
            }

            const data = await response.json();
            const assistantMessage: Message = { role: "assistant", content: data.response };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to send message",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Chat with Website</h1>
                <p className="text-muted-foreground">
                    Extract content from any website and chat with it using AI
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* URL Input */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Website URL</CardTitle>
                        <CardDescription>Enter the URL to scrape and chat with</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            type="url"
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleScrape()}
                        />
                        <Button onClick={handleScrape} disabled={scraping || !url.trim()} className="w-full">
                            {scraping ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Scraping...
                                </>
                            ) : (
                                <>
                                    <Globe className="w-4 h-4 mr-2" />
                                    Load Website
                                </>
                            )}
                        </Button>

                        {websiteTitle && (
                            <div className="p-3 bg-muted rounded-md">
                                <p className="text-sm font-medium">Loaded:</p>
                                <p className="text-sm text-muted-foreground">{websiteTitle}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Chat Interface */}
                <Card className="lg:col-span-2 flex flex-col h-[600px]">
                    <CardHeader>
                        <CardTitle>Chat</CardTitle>
                        <CardDescription>
                            {websiteContent ? "Ask questions about the website" : "Load a website to start chatting"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                            {messages.length === 0 && !websiteContent ? (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    <p>Enter a URL and click "Load Website" to begin</p>
                                </div>
                            ) : (
                                messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                                }`}
                                        >
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-muted rounded-lg px-4 py-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="flex gap-2">
                            <Input
                                placeholder={websiteContent ? "Ask a question..." : "Load a website first"}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                                disabled={!websiteContent || loading}
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={!websiteContent || !input.trim() || loading}
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
