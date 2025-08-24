'use client';

import type { FC, ReactNode } from 'react';
import type { SeoData, SeoStatus, SeoCheck } from '@/lib/types';
import html2pdf from 'html2pdf.js';

import { CheckCircle2, Download, GaugeCircle, MessageCircleWarning, Server, Smartphone, Tags, XCircle, Link, FileText, Code, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


import { Logo } from './logo';
import { ActionableInsights } from './actionable-insights';
import { Separator } from './ui/separator';

const STATUS_MAP: Record<SeoStatus, { icon: ReactNode; color: string; text: string }> = {
  good: {
    icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    color: 'text-green-500',
    text: 'Tốt',
  },
  improvement: {
    icon: <MessageCircleWarning className="h-5 w-5 text-yellow-500" />,
    color: 'text-yellow-500',
    text: 'Cần cải thiện',
  },
  error: {
    icon: <XCircle className="h-5 w-5 text-destructive" />,
    color: 'text-destructive',
    text: 'Lỗi',
  },
};

const ScoreGauge: FC<{ score: number }> = ({ score }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];
  const color = score > 80 ? '#10B981' : score > 50 ? '#F59E0B' : '#EF4444';

  return (
    <div className="relative h-28 w-28">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <RechartsTooltip
            contentStyle={{
              background: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
            }}
          />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={45}
            startAngle={90}
            endAngle={450}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="hsl(var(--muted))" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
  );
};

const ReportItem: FC<{ check: SeoCheck<any>; title: ReactNode }> = ({ check, title }) => (
    <AccordionItem value={title?.toString() ?? ''}>
      <AccordionTrigger className='py-3'>
        <div className="flex items-center space-x-4">
          <div>{STATUS_MAP[check.status].icon}</div>
          <div className="flex-1 text-left">
            <div className="font-medium">{title}</div>
            <p className="text-sm text-muted-foreground">{check.message}</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="pl-9 text-muted-foreground text-sm border-l-2 border-border ml-2.5 pl-6 py-2">
         {check.details}
        </div>
      </AccordionContent>
    </AccordionItem>
);

export function ReportClient({ data }: { data: SeoData }) {
  const handleDownload = () => {
    const element = document.getElementById('printable-area');
    if (element) {
        const sanitizedUrl = data.url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const opt = {
            margin:       0.5,
            filename:     `bao_cao_seo_${sanitizedUrl}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save();
    }
  };

  const currentDate = new Date().toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-4 items-center">
            <Logo />
            <h1 className="text-xl font-bold">Báo cáo SEO</h1>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Tải Báo cáo
            </Button>
          </div>
        </div>
      </header>

      <main id="printable-area" className="container mx-auto py-8">
        <div className='bg-card p-8 rounded-lg print:rounded-none print:shadow-none shadow-md'>
          {/* Print Header */}
          <div className="hidden print:block mb-8">
            <div className="flex justify-between items-center border-b pb-4">
              <div className="flex gap-4 items-center">
                <Logo />
                <h1 className="text-2xl font-bold">Báo cáo SEO</h1>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{data.url}</p>
                <p className="text-sm text-muted-foreground">Ngày báo cáo: {currentDate}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-6">
            <div>
              <p className="text-sm font-medium text-primary">Báo cáo phân tích SEO</p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground break-all">{data.url}</h2>
              <p className="text-muted-foreground mt-1">Tạo vào {currentDate}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground mb-2">Điểm tổng thể</p>
              <ScoreGauge score={data.score} />
            </div>
          </div>

          <ActionableInsights onPageData={data.onPage} technicalData={data.technical} />

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'><Tags /> SEO On-Page</CardTitle>
                <CardDescription>Phân tích nội dung và các yếu tố mã nguồn HTML.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" defaultValue={['Thẻ tiêu đề']}>
                  <ReportItem check={data.onPage.title} title="Thẻ tiêu đề"/>
                  <ReportItem check={data.onPage.metaDescription} title="Mô tả Meta"/>
                  <ReportItem check={data.onPage.headings.h1} title="Tiêu đề H1"/>
                  <ReportItem check={data.onPage.imageAlts} title="Thuộc tính ALT của hình ảnh"/>
                  <ReportItem check={data.onPage.keywordDensity} title="Mật độ từ khóa"/>
                  <ReportItem check={data.onPage.contentLength} title={<div className="flex items-center gap-2"><FileText size={16}/> Độ dài nội dung</div>} />
                  <ReportItem check={data.onPage.links} title={<div className="flex items-center gap-2"><Link size={16}/> Phân tích liên kết</div>} />
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'><Server/> SEO Kỹ thuật</CardTitle>
                <CardDescription>Phân tích các khía cạnh kỹ thuật ảnh hưởng đến khả năng hiển thị trên công cụ tìm kiếm.</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className='flex gap-4 justify-around text-center p-4 border-b mb-2'>
                    <div>
                        <div className='flex items-center justify-center gap-2 text-muted-foreground'><Smartphone size={16}/> Di động</div>
                        <p className={`text-3xl font-bold ${STATUS_MAP[data.technical.pageSpeed.mobile.status].color}`}>{data.technical.pageSpeed.mobile.value}</p>
                    </div>
                     <Separator orientation="vertical" className="h-auto" />
                    <div>
                        <div className='flex items-center justify-center gap-2 text-muted-foreground'><GaugeCircle size={16}/> Máy tính</div>
                        <p className={`text-3xl font-bold ${STATUS_MAP[data.technical.pageSpeed.desktop.status].color}`}>{data.technical.pageSpeed.desktop.value}</p>
                    </div>
                </div>
                 <Accordion type="multiple">
                  <ReportItem check={data.technical.ssl} title="Chứng chỉ SSL"/>
                  <ReportItem check={data.technical.robotsTxt} title="robots.txt"/>
                  <ReportItem check={data.technical.sitemap} title="Sitemap XML"/>
                  <ReportItem check={data.technical.mobileFriendly} title={<div className="flex items-center gap-2"><Smartphone size={16}/> Thân thiện với di động</div>} />
                  <ReportItem check={data.technical.structuredData} title={<div className="flex items-center gap-2"><Code size={16}/> Dữ liệu có cấu trúc</div>} />
                  <ReportItem check={data.technical.canonicalUrl} title={<div className="flex items-center gap-2"><Globe size={16}/> URL chính tắc</div>} />
                 </Accordion>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground print:hidden">
              <p>Báo cáo SEO &copy; {new Date().getFullYear()}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
