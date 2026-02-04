"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface FlashcardProps {
    question: string;
    answer: string;
    className?: string;
}

export function Flashcard({ question, answer, className }: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className={cn("perspective-1000 cursor-pointer", className)}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div
                className={cn(
                    "relative w-full h-64 transition-transform duration-500 transform-style-3d",
                    isFlipped && "rotate-y-180"
                )}
            >
                {/* Front */}
                <Card
                    className={cn(
                        "absolute inset-0 backface-hidden flex items-center justify-center p-6 bg-gradient-to-br from-primary/10 to-primary/5",
                        "border-2 border-primary/20"
                    )}
                >
                    <div className="text-center">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-4">Question</p>
                        <p className="text-lg font-medium">{question}</p>
                        <p className="text-xs text-muted-foreground mt-6">Click to reveal answer</p>
                    </div>
                </Card>

                {/* Back */}
                <Card
                    className={cn(
                        "absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center p-6 bg-gradient-to-br from-secondary/10 to-secondary/5",
                        "border-2 border-secondary/20"
                    )}
                >
                    <div className="text-center">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-4">Answer</p>
                        <p className="text-lg font-medium">{answer}</p>
                        <p className="text-xs text-muted-foreground mt-6">Click to see question</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
