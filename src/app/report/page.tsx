import { redirect } from 'next/navigation';
import { ReportClient } from '@/components/report-client';
import type { SeoData, SeoStatus } from '@/lib/types';

// This function generates mock data. In a real app, this would involve API calls.
function generateMockData(url: string): SeoData {
  const getStatus = (val: number): SeoStatus => {
    if (val > 0.8) return 'good';
    if (val > 0.5) return 'improvement';
    return 'error';
  };

  const urlSeed = url.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const titleLength = 30 + Math.floor(random(urlSeed + 1) * 40);
  const descLength = 70 + Math.floor(random(urlSeed + 2) * 90);
  const h1Count = random(urlSeed + 3) > 0.1 ? 1 : Math.random() > 0.5 ? 0 : 2;
  const imgCount = 5 + Math.floor(random(urlSeed + 4) * 15);
  const missingAlts = Math.floor(random(urlSeed + 5) * (imgCount / 4));
  const mobileScore = 50 + Math.floor(random(urlSeed + 6) * 50);
  const desktopScore = 60 + Math.floor(random(urlSeed + 7) * 40);

  const onPage = {
    title: {
      value: `Tiêu đề mẫu cho ${url}`,
      status: titleLength > 60 || titleLength < 30 ? 'improvement' : 'good',
      message: `Độ dài tiêu đề là ${titleLength} ký tự. Khuyến nghị: 30-60.`,
    },
    metaDescription: {
      value: 'Đây là mô tả meta mẫu để minh họa phân tích SEO cho URL được cung cấp.',
      status: descLength > 160 || descLength < 70 ? 'improvement' : 'good',
      message: `Độ dài mô tả meta là ${descLength} ký tự. Khuyến nghị: 70-160.`,
    },
    headings: {
      h1: {
        value: Array(h1Count).fill('Tiêu đề H1 mẫu'),
        status: h1Count === 1 ? 'good' : 'error',
        message: `Tìm thấy ${h1Count} thẻ <h1>. Khuyến nghị chính xác một thẻ.`,
      },
      h2: {
        value: ['Tiêu đề phụ 1', 'Tiêu đề phụ 2'],
        status: 'good',
        message: 'Tìm thấy 2 thẻ <h2>.',
      },
    },
    imageAlts: {
      value: { count: imgCount, missing: missingAlts },
      status: missingAlts > 0 ? 'improvement' : 'good',
      message: `${missingAlts} trên ${imgCount} hình ảnh thiếu văn bản thay thế.`,
    },
    keywordDensity: {
      value: { keyword: 'ví dụ', density: 1.5 + random(urlSeed+8) },
      status: 'good',
      message: 'Mật độ từ khóa nằm trong phạm vi tối ưu.',
    },
  };
  
  const technical = {
    pageSpeed: {
      mobile: {
        value: mobileScore,
        status: getStatus(mobileScore / 100),
        message: `Điểm PageSpeed trên di động là ${mobileScore}.`,
      },
      desktop: {
        value: desktopScore,
        status: getStatus(desktopScore / 100),
        message: `Điểm PageSpeed trên máy tính là ${desktopScore}.`,
      },
    },
    coreWebVitals: {
      lcp: { value: 1.8 + random(urlSeed+9), status: 'good', message: 'Largest Contentful Paint tốt.'},
      inp: { value: 150 + random(urlSeed+10)*100, status: 'good', message: 'Interaction to Next Paint tốt.'},
      cls: { value: 0.05 + random(urlSeed+11)*0.1, status: 'good', message: 'Cumulative Layout Shift tốt.'},
    },
    ssl: {
      value: random(urlSeed + 12) > 0.05,
      status: random(urlSeed + 12) > 0.05 ? 'good' : 'error',
      message: 'Chứng chỉ SSL hợp lệ và được định cấu hình đúng.',
    },
    robotsTxt: {
      value: random(urlSeed + 13) > 0.1,
      status: random(urlSeed + 13) > 0.1 ? 'good' : 'error',
      message: 'Tệp robots.txt có mặt và có thể truy cập.',
    },
    sitemap: {
      value: random(urlSeed + 14) > 0.15,
      status: random(urlSeed + 14) > 0.15 ? 'good' : 'error',
      message: 'Sitemap XML có mặt và được định dạng chính xác.',
    },
  };

  const score = (Object.values(onPage).flat().concat(Object.values(technical).flat()))
    .reduce((acc: number, check: any) => {
        if (typeof check !== 'object' || check === null || !('status' in check)) return acc;
        if(check.status === 'good') return acc + 1;
        if(check.status === 'improvement') return acc + 0.5;
        return acc;
    }, 0) / 10 * 100;

  return { url, onPage, technical, score: Math.round(score) };
}

export default async function ReportPage({
  searchParams,
}: {
  searchParams: { url?: string };
}) {
  const url = searchParams.url ? decodeURIComponent(searchParams.url) : null;
  if (!url) {
    redirect('/');
  }

  // Simulate analysis delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const reportData = generateMockData(url);

  return <ReportClient data={reportData} />;
}
