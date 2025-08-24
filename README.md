# 🚀 Trình tạo Báo cáo SEO (SEO Report Generator)

![Giao diện ứng dụng](https://placehold.co/800x400.png)
*Giao diện trang chủ, nơi người dùng có thể nhập URL để phân tích.*

Một ứng dụng web được xây dựng bằng Next.js để phân tích các chỉ số SEO on-page và kỹ thuật của một trang web, sau đó tạo ra một báo cáo chuyên nghiệp, có thể tải xuống với các đề xuất cải thiện được cung cấp bởi trí tuệ nhân tạo (AI).

## ✨ Tính năng chính

- **Phân tích URL động:** Nhập bất kỳ URL trang web nào để bắt đầu quá trình phân tích SEO.
- **Báo cáo SEO toàn diện:**
    - **On-Page SEO:** Phân tích thẻ tiêu đề, mô tả meta, cấu trúc thẻ heading (H1, H2), thuộc tính alt của hình ảnh, mật độ từ khóa, độ dài nội dung và các liên kết.
    - **Technical SEO:** Đánh giá tốc độ trang (di động và máy tính), Core Web Vitals (LCP, INP, CLS), chứng chỉ SSL, tệp `robots.txt`, sitemap XML, tính thân thiện với thiết bị di động, dữ liệu có cấu trúc và URL chính tắc.
- **Điểm số SEO tổng thể:** Một điểm số được tính toán để đánh giá nhanh chóng hiệu suất SEO của trang.
- **💡 Đề xuất từ AI:** Sử dụng Google Gemini để cung cấp các đề xuất cụ thể, hữu ích nhằm cải thiện các vấn đề SEO được phát hiện.
- **Tải xuống PDF:** Xuất báo cáo phân tích đầy đủ dưới dạng tệp PDF chuyên nghiệp, sẵn sàng để chia sẻ.
- **Giao diện đáp ứng:** Thiết kế hiện đại, sạch sẽ, hoạt động tốt trên cả máy tính và thiết bị di động.

## 🛠️ Công nghệ sử dụng

- **Framework:** [Next.js](https://nextjs.org/) (với App Router)
- **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/)
- **Tạo kiểu (Styling):** [Tailwind CSS](https://tailwindcss.com/) và [ShadCN/UI](https://ui.shadcn.com/) cho các thành phần giao diện người dùng.
- **AI / Generative:** [Google AI (Gemini) thông qua Genkit](https://firebase.google.com/docs/genkit) để tạo ra các đề xuất thông minh.
- **Biểu đồ:** [Recharts](https://recharts.org/) để hiển thị điểm số tổng thể.
- **Tạo PDF:** [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) để chuyển đổi báo cáo HTML thành PDF.
- **Quản lý Form:** [React Hook Form](https://react-hook-form.com/) và [Zod](https://zod.dev/) để xác thực.

## 🚀 Bắt đầu

Làm theo các bước sau để thiết lập và chạy dự án trên máy cục bộ của bạn.

### Điều kiện tiên quyết

- [Node.js](https://nodejs.org/) (phiên bản 20.x hoặc mới hơn)
- [npm](https://www.npmjs.com/) hoặc [yarn](https://yarnpkg.com/)

### Cài đặt

1.  **Sao chép kho lưu trữ:**
    ```bash
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```

2.  **Cài đặt các gói phụ thuộc:**
    ```bash
    npm install
    ```

3.  **Thiết lập biến môi trường:**
    Tạo một tệp `.env` ở thư mục gốc của dự án và thêm khóa API Google AI của bạn vào đó.
    ```env
    GOOGLE_API_KEY="YOUR_GEMINI_API_KEY"
    ```
    Bạn có thể lấy khóa API từ [Google AI Studio](https://aistudio.google.com/app/apikey).

### Chạy ứng dụng

Chạy máy chủ phát triển cục bộ:
```bash
npm run dev
```

Mở [http://localhost:9002](http://localhost:9002) trong trình duyệt của bạn để xem ứng dụng.

## 部署 (Triển khai)

Dự án này bao gồm một tập lệnh triển khai tự động (`deploy.sh`) được thiết kế cho máy chủ Ubuntu 24.04.

### Hướng dẫn sử dụng tập lệnh

1.  **Sao chép tập lệnh vào máy chủ:**
    ```bash
    scp deploy.sh user@your_server_ip:~/
    ```

2.  **Cấp quyền thực thi:**
    ```bash
    chmod +x deploy.sh
    ```

3.  **Cấu hình:**
    Mở tệp `deploy.sh` và chỉnh sửa các biến sau cho phù hợp với dự án của bạn:
    - `GIT_REPO_URL`: URL kho Git của bạn.
    - `PROJECT_DIR_NAME`: Tên thư mục dự án.
    - `DOMAIN_NAME`: Tên miền của bạn.

4.  **Chạy tập lệnh:**
    ```bash
    ./deploy.sh
    ```
    Tập lệnh sẽ tự động cài đặt Nginx, Node.js, PM2, cấu hình dự án và khởi động ứng dụng.

## 📄 Giấy phép

Dự án này được cấp phép theo Giấy phép MIT. Xem tệp `LICENSE` để biết chi tiết.
