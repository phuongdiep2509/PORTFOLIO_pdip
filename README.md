# Phương Diệp’s Portfolio

Website portfolio một trang (HTML/CSS/JS thuần, không cần build).

## Chạy thử
Mở `index.html` trực tiếp, hoặc chạy `python3 -m http.server` trong thư mục này.

## Đưa lên GitHub Pages
1. Tạo repository mới, tải toàn bộ thư mục này lên nhánh `main`.
2. Vào Settings → Pages → Source: `Deploy from a branch` → `main` / `(root)`.
3. Chờ khoảng một phút, website sẽ có tại `https://<tên-tài-khoản>.github.io/<tên-repo>/`.

## Cập nhật nội dung
Toàn bộ nội dung nằm trong `js/data.js`:
- `skills`: danh sách kỹ năng.
- `projects`: thêm dự án (tên, mô tả, mục tiêu, vai trò, công cụ, kết quả, link). Khi có dự án, thẻ và cửa sổ chi tiết tự xuất hiện.
- `contact`: điền `email`, `phone`, `linkedin`, `github`. Mục nào để trống sẽ không hiển thị.

File CV nằm ở `assets/Nguyen-Tran-Phuong-Diep-CV.pdf` (thay bằng bản mới nhất khi cần, giữ nguyên tên file).
