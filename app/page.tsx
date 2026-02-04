import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Brain, FileCheck, Sparkles, Globe, ArrowRight } from "lucide-react";

const features = [
    {
        title: "AI Notes Summarizer",
        description: "Upload PDF, TXT, or DOCX files and get instant AI-powered summaries",
        icon: FileText,
        href: "/notes-summarizer",
    },
    {
        title: "AI Flashcard Generator",
        description: "Convert your notes into interactive Q&A flashcards automatically",
        icon: Brain,
        href: "/flashcards",
    },
    {
        title: "AI Resume Analyzer",
        description: "Get detailed analysis, scoring, and improvement suggestions for your resume",
        icon: FileCheck,
        href: "/resume-analyzer",
    },
    {
        title: "Portfolio Generator",
        description: "Create a professional portfolio website with downloadable HTML/CSS",
        icon: Sparkles,
        href: "/portfolio-generator",
    },
    {
        title: "Chat with Website",
        description: "Extract content from any website and chat with it using AI",
        icon: Globe,
        href: "/chat-website",
    },
];

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                        Unified Smart Productivity Suite
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        AI-powered tools to supercharge your productivity
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/login">
                            <Button size="lg">Get Started</Button>
                        </Link>
                        <Link href="/signup">
                            <Button size="lg" variant="outline">Sign Up</Button>
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((feature) => (
                        <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href={feature.href}>
                                    <Button variant="ghost" className="w-full group-hover:bg-primary/10">
                                        Try it now
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Footer */}
                <div className="text-center mt-16 text-sm text-muted-foreground">
                    <p>Built with Next.js 15, React, TypeScript, Supabase, and AI</p>
                </div>
            </div>
        </div>
    );
}
