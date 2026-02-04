"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    FileText,
    Brain,
    FileCheck,
    Globe,
    LayoutDashboard,
    LogOut,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Notes Summarizer", href: "/notes-summarizer", icon: FileText },
    { name: "Flashcard Generator", href: "/flashcards", icon: Brain },
    { name: "Resume Analyzer", href: "/resume-analyzer", icon: FileCheck },
    { name: "Portfolio Generator", href: "/portfolio-generator", icon: Sparkles },
    { name: "Chat with Website", href: "/chat-website", icon: Globe },
];

export function Navigation() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <nav className="flex flex-col h-full bg-card border-r">
            <div className="p-6">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Smart Suite
                </h1>
                <p className="text-xs text-muted-foreground mt-1">AI-Powered Productivity</p>
            </div>

            <div className="flex-1 px-3 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            <div className="p-3 border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    onClick={handleSignOut}
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </Button>
            </div>
        </nav>
    );
}
