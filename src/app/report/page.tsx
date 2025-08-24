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

  const wordCount = 300 + Math.floor(random(urlSeed + 15) * 1200);
  const internalLinks = 2 + Math.floor(random(urlSeed + 16) * 10);
  const externalLinks = 1 + Math.floor(random(urlSeed + 17) * 5);
  const brokenLinks = Math.floor(random(urlSeed + 18) * 3);
  const isMobileFriendly = random(urlSeed + 19) > 0.1;
  const hasSchema = random(urlSeed + 20) > 0.3;
  const hasCanonical = random(urlSeed + 21) > 0.2;


  const onPage = {
    title: {
      value: `Tiêu đề mẫu cho ${url}`,
      status: titleLength > 60 || titleLength < 30 ? 'improvement' : 'good',
      message: `Độ dài tiêu đề là ${titleLength} ký tự.`,
      details: 'Thẻ tiêu đề nên có độ dài từ 30 đến 60 ký tự để hiển thị tối ưu trên các trang kết quả của công cụ tìm kiếm. Tiêu đề của bạn hiện tại có thể quá dài hoặc quá ngắn.',
    },
    metaDescription: {
      value: 'Đây là mô tả meta mẫu để minh họa phân tích SEO cho URL được cung cấp.',
      status: descLength > 160 || descLength < 70 ? 'improvement' : 'good',
      message: `Độ dài mô tả meta là ${descLength} ký tự.`,
      details: 'Mô tả meta nên có độ dài từ 70 đến 160 ký tự. Mô tả của bạn hiện không nằm trong phạm vi này, điều này có thể ảnh hưởng đến tỷ lệ nhấp chuột từ kết quả tìm kiếm.',
    },
    headings: {
      h1: {
        value: Array(h1Count).fill('Tiêu đề H1 mẫu'),
        status: h1Count === 1 ? 'good' : 'error',
        message: `Tìm thấy ${h1Count} thẻ <h1>.`,
        details: 'Trang nên có chính xác một thẻ <h1> để xác định rõ ràng chủ đề chính của nó cho các công cụ tìm kiếm. Việc có nhiều hoặc không có thẻ <h1> nào có thể gây nhầm lẫn cho trình thu thập thông tin và làm giảm hiệu suất SEO của bạn.',
      },
      h2: {
        value: ['Tiêu đề phụ 1', 'Tiêu đề phụ 2'],
        status: 'good',
        message: 'Tìm thấy 2 thẻ <h2>.',
        details: 'Việc sử dụng các thẻ <h2> giúp cấu trúc nội dung của bạn và cải thiện khả năng đọc. Bạn đã sử dụng chúng một cách chính xác.',
      },
    },
    imageAlts: {
      value: { count: imgCount, missing: missingAlts },
      status: missingAlts > 0 ? 'improvement' : 'good',
      message: `${missingAlts} trên ${imgCount} hình ảnh thiếu văn bản thay thế.`,
      details: 'Văn bản thay thế (thuộc tính alt) rất quan trọng cho khả năng truy cập và SEO hình ảnh. Nó cung cấp ngữ cảnh cho các công cụ tìm kiếm và trình đọc màn hình. Hãy thêm văn bản alt mô tả cho tất cả các hình ảnh.',
    },
    keywordDensity: {
      value: { keyword: 'ví dụ', density: 1.5 + random(urlSeed+8) },
      status: 'good',
      message: 'Mật độ từ khóa nằm trong phạm vi tối ưu.',
      details: 'Mật độ từ khóa của bạn cho thấy việc sử dụng thuật ngữ một cách tự nhiên trong toàn bộ nội dung, đây là điều tốt cho SEO.',
    },
    contentLength: {
      value: wordCount,
      status: wordCount < 500 ? 'improvement' : 'good',
      message: `Trang chứa ${wordCount} từ.`,
      details: 'Nội dung dài hơn (trên 500 từ) có xu hướng xếp hạng tốt hơn vì nó cung cấp nhiều giá trị hơn cho người đọc. Hãy xem xét việc mở rộng nội dung của bạn với thông tin hữu ích và có liên quan.'
    },
    links: {
      value: { internal: internalLinks, external: externalLinks, broken: brokenLinks },
      status: brokenLinks > 0 ? 'error' : (internalLinks > 0 && externalLinks > 0 ? 'good' : 'improvement'),
      message: `Tìm thấy ${internalLinks} liên kết nội bộ, ${externalLinks} liên kết bên ngoài và ${brokenLinks} liên kết hỏng.`,
      details: 'Liên kết nội bộ giúp các công cụ tìm kiếm hiểu cấu trúc trang web của bạn. Liên kết bên ngoài đến các trang web có uy tín có thể tăng độ tin cậy. Các liên kết hỏng tạo ra trải nghiệm người dùng xấu và nên được sửa chữa.'
    }
  };
  
  const technical = {
    pageSpeed: {
      mobile: {
        value: mobileScore,
        status: getStatus(mobileScore / 100),
        message: `Điểm PageSpeed trên di động là ${mobileScore}.`,
        details: 'Tốc độ trang trên di động rất quan trọng cho trải nghiệm người dùng và xếp hạng tìm kiếm. Điểm số dưới 90 cho thấy có cơ hội để cải thiện. Hãy xem xét việc tối ưu hóa hình ảnh, giảm JavaScript và tận dụng bộ nhớ đệm của trình duyệt.',
      },
      desktop: {
        value: desktopScore,
        status: getStatus(desktopScore / 100),
        message: `Điểm PageSpeed trên máy tính là ${desktopScore}.`,
        details: 'Tốc độ trang trên máy tính để bàn ảnh hưởng đến sự hài lòng của người dùng. Điểm số dưới 90 cho thấy các khu vực cần tối ưu hóa tiềm năng như thời gian phản hồi của máy chủ hoặc các tài nguyên chặn hiển thị.',
      },
    },
    coreWebVitals: {
      lcp: { value: 1.8 + random(urlSeed+9), status: 'good', message: 'Largest Contentful Paint tốt.', details: 'LCP đo lường hiệu suất tải. Điểm số tốt có nghĩa là nội dung chính của trang tải nhanh chóng, mang lại trải nghiệm tốt cho người dùng.'},
      inp: { value: 150 + random(urlSeed+10)*100, status: 'good', message: 'Interaction to Next Paint tốt.', details: 'INP đo lường khả năng phản hồi. Điểm số tốt cho thấy trang của bạn phản hồi nhanh chóng với các tương tác của người dùng.'},
      cls: { value: 0.05 + random(urlSeed+11)*0.1, status: 'good', message: 'Cumulative Layout Shift tốt.', details: 'CLS đo lường sự ổn định về mặt hình ảnh. Điểm số thấp có nghĩa là người dùng không gặp phải các thay đổi bố cục bất ngờ.'},
    },
    ssl: {
      value: random(urlSeed + 12) > 0.05,
      status: random(urlSeed + 12) > 0.05 ? 'good' : 'error',
      message: random(urlSeed + 12) > 0.05 ? 'Chứng chỉ SSL hợp lệ và được định cấu hình đúng.' : 'Không tìm thấy chứng chỉ SSL hoặc đã hết hạn.',
      details: 'SSL (HTTPS) mã hóa dữ liệu giữa trang web của bạn và khách truy cập, điều này rất cần thiết cho lòng tin và bảo mật. Nó cũng là một yếu tố xếp hạng của Google.',
    },
    robotsTxt: {
      value: random(urlSeed + 13) > 0.1,
      status: random(urlSeed + 13) > 0.1 ? 'good' : 'error',
      message: random(urlSeed + 13) > 0.1 ? 'Tệp robots.txt có mặt và có thể truy cập.' : 'Không tìm thấy tệp robots.txt.',
      details: 'Tệp robots.txt hướng dẫn các công cụ tìm kiếm cách thu thập thông tin trang web của bạn. Việc có một tệp được định cấu hình đúng là rất quan trọng để đảm bảo các trang quan trọng được lập chỉ mục.',
    },
    sitemap: {
      value: random(urlSeed + 14) > 0.15,
      status: random(urlSeed + 14) > 0.15 ? 'good' : 'error',
      message: random(urlSeed + 14) > 0.15 ? 'Sitemap XML có mặt và được định dạng chính xác.' : 'Không tìm thấy sitemap XML.',
      details: 'Sitemap XML giúp các công cụ tìm kiếm khám phá tất cả các trang trên trang web của bạn. Nó rất quan trọng đối với các trang web lớn hoặc các trang có cấu trúc phức tạp.',
    },
    mobileFriendly: {
      value: isMobileFriendly,
      status: isMobileFriendly ? 'good' : 'error',
      message: isMobileFriendly ? 'Trang web thân thiện với thiết bị di động.' : 'Trang web không thân thiện với thiết bị di động.',
      details: 'Google ưu tiên các trang web thân thiện với thiết bị di động. Một thiết kế không đáp ứng có thể làm tổn hại đến thứ hạng của bạn và mang lại trải nghiệm người dùng kém trên điện thoại thông minh và máy tính bảng.',
    },
    structuredData: {
      value: hasSchema ? ['Article', 'BreadcrumbList'] : [],
      status: hasSchema ? 'good' : 'improvement',
      message: hasSchema ? 'Tìm thấy dữ liệu có cấu trúc.' : 'Không tìm thấy dữ liệu có cấu trúc.',
      details: 'Dữ liệu có cấu trúc (Schema markup) giúp các công cụ tìm kiếm hiểu nội dung của bạn và có thể dẫn đến các đoạn mã chi tiết (rich snippets) trong kết quả tìm kiếm, có thể cải thiện tỷ lệ nhấp chuột.',
    },
    canonicalUrl: {
      value: hasCanonical ? url : null,
      status: hasCanonical ? 'good' : 'improvement',
      message: hasCanonical ? 'Thẻ Canonical có mặt.' : 'Thiếu thẻ canonical.',
      details: 'Thẻ canonical ngăn chặn các vấn đề về nội dung trùng lặp bằng cách chỉ định phiên bản "chính tắc" hoặc "ưa thích" của một trang web. Điều quan trọng là phải có một thẻ cho mỗi trang.',
    }
  };

  const allChecks = [
      ...Object.values(onPage),
      ...Object.values(onPage.headings),
      ...Object.values(technical),
      ...Object.values(technical.pageSpeed),
      ...Object.values(technical.coreWebVitals)
    ].filter(check => typeof check === 'object' && check !== null && 'status' in check);

  const score = allChecks.reduce((acc: number, check: any) => {
      if(check.status === 'good') return acc + 1;
      if(check.status === 'improvement') return acc + 0.5;
      return acc;
  }, 0) / allChecks.length * 100;

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
