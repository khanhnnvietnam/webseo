'use client';

import { useEffect, useState } from 'react';
import { Lightbulb, Wand2 } from 'lucide-react';

import { generateActionableInsights } from '@/lib/actions';
import type { OnPageData, TechnicalData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';

interface ActionableInsightsProps {
  onPageData: OnPageData;
  technicalData: TechnicalData;
}

export function ActionableInsights({ onPageData, technicalData }: ActionableInsightsProps) {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      setLoading(true);
      const result = await generateActionableInsights(onPageData, technicalData);
      setInsights(result);
      setLoading(false);
    }
    fetchInsights();
  }, [onPageData, technicalData]);

  return (
    <Card className="bg-primary/5 border-primary/20 print:bg-transparent print:border-none print:shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Wand2 /> AI Actionable Insights
        </CardTitle>
        <CardDescription>
          AI-powered recommendations to improve your SEO score, focusing on the most impactful changes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {insights && !loading && <p className="text-foreground/90 leading-relaxed">{insights}</p>}
      </CardContent>
    </Card>
  );
}
