# 🐹 SachMac

SachMac là một ứng dụng giao diện trực quan (GUI) hỗ trợ dọn dẹp và tối ưu hóa hệ thống macOS. Ứng dụng hoạt động dựa trên sự kết hợp của backend Node.js, frontend React hiện đại và nhân quét đĩa tốc độ cao **Mole CLI** (được viết bằng Go), tất cả được đóng gói gọn nhẹ thành một ứng dụng native thông qua Apple Swift Wrapper.

## ✨ Tính Năng Chính

- **📊 Bảng Điều Khiển (Dashboard):** Giám sát hiệu năng hệ thống theo thời gian thực (CPU, RAM, Disk), theo dõi nhiệt độ CPU và tình trạng sức khỏe pin.
- **🧹 Dọn Dẹp (Clean):** Dọn dẹp tệp tin rác một cách an toàn với 3 cấp độ (An toàn, Nâng cao, Quét sâu). Hệ thống được trang bị cơ chế *whitelist* thông minh để bảo vệ các tệp tin cấu hình quan trọng (SSH, GPG, Keychain, 1Password...).
- **🗑️ Gỡ Cài Đặt (Uninstaller):** Quét và xóa tận gốc các ứng dụng cùng với các tệp tin "mồ côi" (leftovers/caches) mà ứng dụng để lại trong hệ thống.
- **🚀 Quản Lý Khởi Động (Startup Manager):** Quản lý các dịch vụ Launch Agents và Daemons, giúp macOS khởi động nhanh và mượt mà hơn.
- **🗺️ Phân Tích Ổ Đĩa (Disk Analyzer):** Phân tích trực quan dung lượng các thư mục con, hỗ trợ người dùng nhanh chóng tìm và dọn dẹp các tệp tin chiếm nhiều không gian ổ đĩa.

## 🏗️ Kiến Trúc Công Nghệ

Dự án được cấu trúc thành 3 phần độc lập, giúp dễ dàng phát triển và bảo trì:

1. **Frontend (React + Vite):**
   Mang đến trải nghiệm mượt mà với giao diện theo phong cách Apple Premium UI. Hỗ trợ Dark Mode và hiệu ứng Glassmorphism.
2. **Backend (Node.js + Express):**
   Cung cấp API nội bộ (chỉ nhận yêu cầu từ localhost để đảm bảo bảo mật tuyệt đối). Tương tác trực tiếp với nhân `mo` (Mole CLI) và trích xuất thông tin hệ thống qua package `systeminformation`.
3. **Swift Wrapper:**
   Ứng dụng native macOS viết bằng Swift, sử dụng `WKWebView` để hiển thị giao diện Web và tự động quản lý vòng đời của Backend Node.js một cách trong suốt đối với người dùng.

## 🚀 Hướng Dẫn Cài Đặt và Build

### Yêu Cầu Hệ Thống
- Hệ điều hành macOS.
- Đã cài đặt **Node.js** & **npm**.
- Apple Swift Compiler (`swiftc` - đi kèm với Xcode Command Line Tools).
- Đã cài đặt nhân phân tích **Mole CLI** tại đường dẫn `~/.local/bin/mo`.

### Các Bước Cài Đặt

**Bước 1: Clone kho lưu trữ**
```bash
git clone https://github.com/trinhhaox/SachMac.git
cd SachMac
```

**Bước 2: Cài đặt thư viện cho Backend và Frontend**
```bash
# Cài đặt dependency cho backend
cd backend
npm install
cd ..

# Cài đặt và build ứng dụng frontend
cd frontend
npm install
npm run build
cd ..
```

**Bước 3: Biên dịch ứng dụng**
Dự án đi kèm một script tự động biên dịch và tạo bundle `.app`.
```bash
chmod +x wrapper/build.sh
./wrapper/build.sh
```
*Lưu ý: Script sẽ biên dịch Swift wrapper, sao chép code backend và frontend đã build vào thư mục resources, sau đó tạo file `SachMac.app` trực tiếp tại thư mục `/Applications`.*

**Bước 4: Mở ứng dụng**
Khởi chạy ứng dụng từ Launchpad hoặc chạy lệnh:
```bash
open /Applications/SachMac.app
```

## 🛡️ Bảo Mật và Quyền Riêng Tư

- **Local API:** 100% dữ liệu của bạn được xử lý và lưu trữ hoàn toàn tại máy cá nhân. Ứng dụng không gửi bất kỳ báo cáo dữ liệu nào ra bên ngoài.
- **Quyền Truy Cập:** Để ứng dụng hoạt động trơn tru (đặc biệt là tính năng Quét sâu), bạn có thể cần cấp quyền **Full Disk Access (Quyền truy cập đĩa toàn bộ)** trong System Settings của macOS.

## 🤝 Đóng Góp (Contributing)

Dự án này là mã nguồn mở. Mọi ý tưởng đóng góp (Pull Requests) hoặc báo lỗi (Issues) đều được chào đón!

---
*Được phát triển với ❤️ dành riêng cho người dùng macOS.*
