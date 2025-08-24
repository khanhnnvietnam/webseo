#!/bin/bash

# ==============================================================================
# TẬP LỆNH TRIỂN KHAI TỰ ĐỘNG ỨNG DỤNG NEXT.JS TRÊN UBUNTU 24.04
# ==============================================================================
#
# Hướng dẫn sử dụng:
# 1. Sao chép tập lệnh này vào máy chủ Ubuntu của bạn:
#    scp deploy.sh user@your_server_ip:~/
#
# 2. Cấp quyền thực thi cho tập lệnh:
#    chmod +x deploy.sh
#
# 3. Chỉnh sửa các biến cấu hình bên dưới cho phù hợp với dự án của bạn.
#
# 4. Chạy tập lệnh:
#    ./deploy.sh
#
# ==============================================================================

# Dừng lại ngay khi có lỗi
set -e

# --- CẤU HÌNH ---
GIT_REPO_URL="https://github.com/your-username/your-repo.git" # <<< THAY THẾ bằng URL kho Git của bạn
PROJECT_DIR_NAME="my-seo-app"                                 # <<< THAY THẾ bằng tên thư mục dự án của bạn
DOMAIN_NAME="your_domain.com"                                 # <<< THAY THẾ bằng tên miền của bạn (hoặc IP máy chủ)
NODE_VERSION="20"

# --- BIẾN TOÀN CỤC ---
PROJECT_PATH="/var/www/${PROJECT_DIR_NAME}"
NGINX_CONFIG_PATH="/etc/nginx/sites-available/${PROJECT_DIR_NAME}"

# --- BẮT ĐẦU TẬP LỆNH ---
echo "🚀 Bắt đầu quá trình triển khai tự động..."

# 1. CẬP NHẬT HỆ THỐNG
echo "-> (1/5) Đang cập nhật các gói hệ thống..."
sudo apt-get update
sudo apt-get upgrade -y
echo "✅ Cập nhật hệ thống hoàn tất."

# 2. CÀI ĐẶT NGINX, NODE.JS VÀ PM2
echo "-> (2/5) Đang cài đặt các phụ thuộc (Nginx, Node.js, PM2)..."
# Cài đặt Nginx
if ! command -v nginx &> /dev/null; then
    sudo apt-get install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
    echo "✅ Nginx đã được cài đặt và kích hoạt."
else
    echo "👍 Nginx đã được cài đặt."
fi

# Cài đặt Node.js bằng NodeSource
if ! command -v node &> /dev/null; then
    sudo apt-get install -y ca-certificates curl gnupg
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_VERSION.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
    sudo apt-get update
    sudo apt-get install nodejs -y
    echo "✅ Node.js phiên bản $NODE_VERSION đã được cài đặt."
else
    echo "👍 Node.js đã được cài đặt."
fi

# Cài đặt PM2
if ! command -v pm2 &> /dev/null; then
    sudo npm install pm2@latest -g
    echo "✅ PM2 đã được cài đặt."
else
    echo "👍 PM2 đã được cài đặt."
fi

# 3. SAO CHÉP VÀ CÀI ĐẶT DỰ ÁN
echo "-> (3/5) Đang thiết lập dự án..."
if [ -d "$PROJECT_PATH" ]; then
    echo "🔄 Thư mục dự án đã tồn tại. Đang kéo các thay đổi mới nhất..."
    cd "$PROJECT_PATH"
    sudo git pull
else
    echo "📂 Đang sao chép kho lưu trữ từ Git..."
    sudo git clone "$GIT_REPO_URL" "$PROJECT_PATH"
    cd "$PROJECT_PATH"
fi

echo "📦 Đang cài đặt các gói phụ thuộc NPM..."
sudo npm install

echo "🏗️ Đang xây dựng ứng dụng Next.js cho môi trường sản xuất..."
sudo npm run build
echo "✅ Dự án đã được thiết lập và xây dựng thành công."

# 4. CẤU HÌNH NGINX LÀM PROXY NGƯỢC
echo "-> (4/5) Đang cấu hình Nginx..."
sudo tee "$NGINX_CONFIG_PATH" > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;

    server_name $DOMAIN_NAME www.$DOMAIN_NAME;

    # Chuyển hướng HTTP sang HTTPS (nếu bạn dùng SSL)
    # Ghi chú: Bỏ ghi chú các dòng bên dưới sau khi cài đặt SSL
    # location / {
    #     return 301 https://\$host\$request_uri;
    # }

    # Cấu hình cho xác thực Let's Encrypt
    location ~ /.well-known/acme-challenge {
        allow all;
        root /var/www/html;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;

    # Đường dẫn chứng chỉ SSL (thay thế sau khi có)
    # ssl_certificate /etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/$DOMAIN_NAME/privkey.pem;

    # Cải thiện bảo mật SSL
    # ssl_protocols TLSv1.2 TLSv1.3;
    # ssl_prefer_server_ciphers off;

    location / {
        proxy_pass http://localhost:3000; # Ứng dụng Next.js chạy trên cổng 3000
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Kích hoạt cấu hình Nginx
if [ ! -L "/etc/nginx/sites-enabled/${PROJECT_DIR_NAME}" ]; then
    sudo ln -s "$NGINX_CONFIG_PATH" /etc/nginx/sites-enabled/
fi

# Xóa cấu hình mặc định nếu nó vẫn tồn tại
if [ -L "/etc/nginx/sites-enabled/default" ]; then
    sudo rm /etc/nginx/sites-enabled/default
fi

# Kiểm tra cú pháp Nginx và khởi động lại
sudo nginx -t
sudo systemctl restart nginx
echo "✅ Nginx đã được cấu hình làm proxy ngược."
echo "👉 Lưu ý: Cấu hình SSL đang được ghi chú. Hãy cài đặt Certbot để kích hoạt HTTPS."

# 5. KHỞI ĐỘNG ỨNG DỤNG VỚI PM2
echo "-> (5/5) Đang khởi động ứng dụng với PM2..."
cd "$PROJECT_PATH"

# Dừng quy trình cũ nếu có và bắt đầu quy trình mới
sudo pm2 stop "$PROJECT_DIR_NAME" || true
sudo pm2 delete "$PROJECT_DIR_NAME" || true
sudo pm2 start npm --name "$PROJECT_DIR_NAME" -- start

# Thiết lập PM2 để tự khởi động cùng hệ thống
sudo pm2 startup systemd -u $USER --hp /home/$USER
sudo pm2 save

echo "🎉 Hoàn tất! Ứng dụng của bạn đang chạy và được quản lý bởi PM2."
echo "----------------------------------------------------------------"
echo "🌐 Bạn có thể truy cập ứng dụng tại: http://$DOMAIN_NAME"
echo "📈 Để xem trạng thái ứng dụng, chạy: pm2 status"
echo "📜 Để xem nhật ký, chạy: pm2 logs $PROJECT_DIR_NAME"
echo "----------------------------------------------------------------"

