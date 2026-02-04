"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Download, Plus, X } from "lucide-react";
import type { PortfolioData } from "@/lib/portfolio-templates";

export default function PortfolioGeneratorPage() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState<PortfolioData>({
        name: "",
        title: "",
        email: "",
        phone: "",
        github: "",
        linkedin: "",
        about: "",
        skills: [""],
        projects: [{ name: "", description: "", technologies: "", link: "" }],
        experience: [{ company: "", position: "", duration: "", description: "" }],
        education: [{ institution: "", degree: "", year: "" }],
    });

    const updateField = (field: keyof PortfolioData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addSkill = () => {
        setFormData(prev => ({ ...prev, skills: [...prev.skills, ""] }));
    };

    const updateSkill = (index: number, value: string) => {
        const newSkills = [...formData.skills];
        newSkills[index] = value;
        setFormData(prev => ({ ...prev, skills: newSkills }));
    };

    const removeSkill = (index: number) => {
        setFormData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
    };

    const addProject = () => {
        setFormData(prev => ({
            ...prev,
            projects: [...prev.projects, { name: "", description: "", technologies: "", link: "" }],
        }));
    };

    const updateProject = (index: number, field: string, value: string) => {
        const newProjects = [...formData.projects];
        newProjects[index] = { ...newProjects[index], [field]: value };
        setFormData(prev => ({ ...prev, projects: newProjects }));
    };

    const removeProject = (index: number) => {
        setFormData(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }));
    };

    const handleGenerate = async () => {
        setLoading(true);

        try {
            // Filter out empty skills
            const cleanedData = {
                ...formData,
                skills: formData.skills.filter(s => s.trim()),
            };

            const response = await fetch("/api/generate-portfolio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cleanedData),
            });

            if (!response.ok) {
                throw new Error("Failed to generate portfolio");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${formData.name.replace(/\s+/g, '-').toLowerCase()}-portfolio.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast({
                title: "Success",
                description: "Portfolio generated and downloaded successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to generate portfolio",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Portfolio Generator</h1>
                <p className="text-muted-foreground">
                    Create a professional portfolio website with downloadable HTML/CSS
                </p>
            </div>

            <div className="space-y-6">
                {/* Personal Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => updateField("name", e.target.value)}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Professional Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => updateField("title", e.target.value)}
                                placeholder="Full Stack Developer"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateField("email", e.target.value)}
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => updateField("phone", e.target.value)}
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="github">GitHub URL</Label>
                            <Input
                                id="github"
                                value={formData.github}
                                onChange={(e) => updateField("github", e.target.value)}
                                placeholder="https://github.com/johndoe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn URL</Label>
                            <Input
                                id="linkedin"
                                value={formData.linkedin}
                                onChange={(e) => updateField("linkedin", e.target.value)}
                                placeholder="https://linkedin.com/in/johndoe"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="about">About *</Label>
                            <Textarea
                                id="about"
                                value={formData.about}
                                onChange={(e) => updateField("about", e.target.value)}
                                placeholder="Brief description about yourself..."
                                rows={4}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Skills */}
                <Card>
                    <CardHeader>
                        <CardTitle>Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {formData.skills.map((skill, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={skill}
                                    onChange={(e) => updateSkill(index, e.target.value)}
                                    placeholder="e.g., React, Node.js, Python"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => removeSkill(index)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addSkill} className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Skill
                        </Button>
                    </CardContent>
                </Card>

                {/* Projects */}
                <Card>
                    <CardHeader>
                        <CardTitle>Projects</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {formData.projects.map((project, index) => (
                            <div key={index} className="p-4 border rounded-lg space-y-3">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-medium">Project {index + 1}</h4>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeProject(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Input
                                    value={project.name}
                                    onChange={(e) => updateProject(index, "name", e.target.value)}
                                    placeholder="Project Name"
                                />
                                <Textarea
                                    value={project.description}
                                    onChange={(e) => updateProject(index, "description", e.target.value)}
                                    placeholder="Project Description"
                                    rows={2}
                                />
                                <Input
                                    value={project.technologies}
                                    onChange={(e) => updateProject(index, "technologies", e.target.value)}
                                    placeholder="Technologies Used"
                                />
                                <Input
                                    value={project.link || ""}
                                    onChange={(e) => updateProject(index, "link", e.target.value)}
                                    placeholder="Project Link (optional)"
                                />
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addProject} className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Project
                        </Button>
                    </CardContent>
                </Card>

                {/* Generate Button */}
                <Button
                    onClick={handleGenerate}
                    disabled={loading || !formData.name || !formData.title || !formData.email}
                    className="w-full"
                    size="lg"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating Portfolio...
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4 mr-2" />
                            Generate & Download Portfolio
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
