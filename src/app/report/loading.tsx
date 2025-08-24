import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-4 items-center">
            <Logo />
            <h1 className="text-xl font-bold">Báo cáo SEO</h1>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Button disabled>
              <Download className="mr-2 h-4 w-4" />
              Tải Báo cáo
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-24 w-24 rounded-full" />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Actionable Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>SEO On-Page</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>SEO Kỹ thuật</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          <p className="text-lg">Đang phân tích trang web của bạn, vui lòng đợi...</p>
        </div>
      </main>
    </div>
  );
}
