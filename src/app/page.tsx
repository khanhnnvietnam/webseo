import { Logo } from '@/components/logo';
import { UrlForm } from '@/components/url-form';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="flex flex-col items-center text-center max-w-2xl w-full">
        <Logo />
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-4">Báo cáo SEO</h1>
        <p className="mt-4 text-lg text-muted-foreground text-balance">
          Nhập URL trang web để phân tích các chỉ số SEO quan trọng và tạo báo cáo chuyên nghiệp có thể tải xuống.
        </p>
        <div className="w-full mt-10">
          <UrlForm />
        </div>
      </div>
    </main>
  );
}
