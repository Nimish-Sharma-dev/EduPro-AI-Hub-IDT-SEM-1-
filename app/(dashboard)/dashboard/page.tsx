import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Brain, FileCheck, Sparkles, Globe, ArrowRight } from "lucide-react";

const modules = [
    {
        title: "AI Notes Summarizer",
        description: "Upload documents and get instant AI-powered summaries",
        icon: FileText,
        href: "/notes-summarizer",
        color: "from-blue-500/10 to-blue-500/5",
    },
    {
        title: "AI Flashcard Generator",
        description: "Transform your notes into interactive flashcards",
        icon: Brain,
        href: "/flashcards",
        color: "from-purple-500/10 to-purple-500/5",
    },
    {
        title: "AI Resume Analyzer",
        description: "Get detailed feedback and improve your resume",
        icon: FileCheck,
        href: "/resume-analyzer",
        color: "from-green-500/10 to-green-500/5",
    },
    {
        title: "Portfolio Generator",
        description: "Create a professional portfolio website instantly",
        icon: Sparkles,
        href: "/portfolio-generator",
        color: "from-orange-500/10 to-orange-500/5",
    },
    {
        title: "Chat with Website",
        description: "Extract and chat with content from any website",
        icon: Globe,
        href: "/chat-website",
        color: "from-pink-500/10 to-pink-500/5",
    },
];

export default function DashboardPage() {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                    Choose a tool to get started with AI-powered productivity
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module) => (
                    <Card key={module.title} className="group hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center mb-4`}>
                                <module.icon className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle>{module.title}</CardTitle>
                            <CardDescription>{module.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href={module.href}>
                                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    Open
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
