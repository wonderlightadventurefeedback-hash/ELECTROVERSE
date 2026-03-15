
"use client";

import { useState } from "react";
import { explainElectricalConcept, ElectricalConceptExplainerOutput } from "@/ai/flows/electrical-concept-explainer-flow";
import { generateElectricalStudyResource, ElectricalStudyResourceGeneratorOutput } from "@/ai/flows/electrical-study-resource-generator-flow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, Search, Sparkles, BookOpen, Calculator, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function AITutorPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<ElectricalConceptExplainerOutput | null>(null);
  const [studyGuide, setStudyGuide] = useState<ElectricalStudyResourceGeneratorOutput | null>(null);

  async function handleAnalyze() {
    if (!query.trim()) return;
    setIsLoading(true);
    setExplanation(null);
    setStudyGuide(null);
    try {
      const [exp, guide] = await Promise.all([
        explainElectricalConcept({ concept: query }),
        generateElectricalStudyResource({ topic: query })
      ]);
      setExplanation(exp);
      setStudyGuide(guide);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-xs font-bold uppercase tracking-widest">
          <BrainCircuit className="h-3 w-3" /> AI Academic Assistant
        </div>
        <h1 className="font-headline text-5xl font-bold">ElectroVerse AI Tutor</h1>
        <p className="text-muted-foreground text-lg">
          Master complex electrical engineering concepts with our advanced AI assistant. Instant explanations, formulas, and study guides.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="flex gap-2 p-2 bg-card border border-border rounded-2xl shadow-xl">
          <Input 
            placeholder="Describe an electrical concept (e.g., Maxwell's Equations, Three-Phase Transformers)..." 
            className="border-none bg-transparent focus-visible:ring-0 text-lg h-14"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
          />
          <Button 
            className="bg-primary hover:bg-primary/90 h-14 px-8 rounded-xl accent-glow"
            onClick={handleAnalyze}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="relative h-6 w-6 animate-spin">
                <Image 
                  src="https://img.sanishtech.com/u/9f0b300f902c453fd35e891c43099af1.png"
                  alt="Loading"
                  fill
                  className="object-contain"
                />
              </div>
            ) : <Search className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {(explanation || studyGuide) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Explanation Section */}
          <Card className="bg-card border-border shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-5 w-5 text-secondary" />
                <CardTitle className="font-headline text-2xl">Conceptual Analysis</CardTitle>
              </div>
              <CardDescription>A deep dive into the fundamentals of {query}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {explanation?.explanation}
                </p>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-border">
                <h4 className="font-bold flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-secondary" /> Key Definitions
                </h4>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {explanation?.definitions}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-border">
                <h4 className="font-bold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-secondary" /> Suggested Resources
                </h4>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {explanation?.academicResources}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Study Guide Section */}
          <Card className="bg-card border-border shadow-2xl">
            <CardHeader className="luxury-gradient rounded-t-xl">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-5 w-5 text-secondary" />
                <CardTitle className="font-headline text-2xl">Exam Preparation Guide</CardTitle>
              </div>
              <CardDescription className="text-white/70">Structured summary and essential formulas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-8">
              <div className="space-y-3">
                <h4 className="font-bold text-sm uppercase tracking-widest text-secondary">Summary</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{studyGuide?.summary}</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-widest text-secondary flex items-center gap-2">
                  <Calculator className="h-4 w-4" /> Essential Formulas
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {studyGuide?.formulas.map((formula, i) => (
                    <div key={i} className="p-3 bg-background border border-border rounded-lg font-mono text-sm text-center text-secondary border-l-4 border-l-secondary">
                      {formula}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-widest text-secondary">Foundational Principles</h4>
                <ul className="space-y-2">
                  {studyGuide?.foundationalPrinciples.map((principle, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="text-secondary">•</span>
                      {principle}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-widest text-secondary">Key Terms</h4>
                <div className="flex flex-wrap gap-2">
                  {studyGuide?.keyTerms.map((term, i) => (
                    <Badge key={i} variant="outline" className="border-border bg-background py-1.5 px-3">
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="relative h-16 w-16 animate-spin">
            <Image 
              src="https://img.sanishtech.com/u/9f0b300f902c453fd35e891c43099af1.png"
              alt="Loading"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-muted-foreground animate-pulse font-medium">ElectroVerse AI is generating your comprehensive tutor guide...</p>
        </div>
      )}

      {!explanation && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          {['Kirchhoff’s Laws', 'Faraday’s Law of Induction', 'Operational Amplifiers'].map((topic) => (
            <button 
              key={topic}
              onClick={() => { setQuery(topic); }}
              className="p-6 text-left bg-card border border-border rounded-2xl hover:border-secondary transition-all hover:translate-y-[-4px]"
            >
              <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Try explaining</p>
              <h4 className="font-headline font-bold text-lg">{topic}</h4>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
