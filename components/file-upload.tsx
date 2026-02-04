"use client";

import { useState, useCallback } from "react";
import { Upload, X, FileText } from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
    accept?: string;
    maxSize?: number;
    onFileSelect: (file: File) => void;
    className?: string;
}

export function FileUpload({ accept = ".pdf,.txt,.docx", maxSize = 10 * 1024 * 1024, onFileSelect, className }: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string>("");

    const handleFile = useCallback((selectedFile: File) => {
        setError("");

        if (maxSize && selectedFile.size > maxSize) {
            setError(`File size exceeds ${formatFileSize(maxSize)}`);
            return;
        }

        setFile(selectedFile);
        onFileSelect(selectedFile);
    }, [maxSize, onFileSelect]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, [handleFile]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    }, [handleFile]);

    const removeFile = useCallback((e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering file input
        setFile(null);
        setError("");
    }, []);

    return (
        <div className={cn("w-full", className)}>
            <div
                className={cn(
                    "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                    dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                    error && "border-destructive"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept={accept}
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {!file ? (
                    <div className="flex flex-col items-center gap-2">
                        <Upload className="w-10 h-10 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Drop your file here or click to browse</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Supported formats: {accept.split(',').join(', ')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Max size: {formatFileSize(maxSize)}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-between gap-4 bg-muted p-4 rounded-md">
                        <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-primary" />
                            <div className="text-left">
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={removeFile}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>

            {error && (
                <p className="text-sm text-destructive mt-2">{error}</p>
            )}
        </div>
    );
}
