# Đi cà phê — Hanoi Coffee Shuffle

Bản xuất ngày **25/09/2026**, lấy từ **phiên bản Sites 55 đang công bố**, không phải bản cũ ngày 11/09.

Website tĩnh: HTML, CSS, JavaScript thuần và JSON. Không cần React, cài thư viện, API key, tài khoản ChatGPT hoặc máy chủ cơ sở dữ liệu để chạy bản công khai. Node.js chỉ dùng khi xem thử và kiểm tra trên máy.

## Đưa lên GitHub Pages bằng giao diện web

1. Giải nén gói này.
2. Tạo repository **Public** trên GitHub, ví dụ `hanoi-coffee-shuffle`.
3. Chọn **Add file → Upload files**. Kéo toàn bộ nội dung bên trong thư mục đã giải nén vào repository, giữ nguyên cấu trúc thư mục. **Không upload file ZIP.**
4. Ở thư mục gốc repository phải nhìn thấy `README.md`, `package.json`, `docs/`, `database/` và các file kiểm tra. Trang chính phải là `docs/index.html`.
5. Vào **Settings → Pages → Build and deployment**.
6. Chọn **Source: Deploy from a branch**, **Branch: main**, thư mục **/docs**, rồi **Save**. Nếu nhánh của bạn có tên khác, chọn nhánh đó.
7. Khi GitHub xử lý xong, lấy URL tại **Settings → Pages** và mở trên điện thoại hoặc máy tính.

URL thường có dạng `https://TEN-GITHUB.github.io/hanoi-coffee-shuffle/`. Website đã dùng đường dẫn tương đối nên hỗ trợ tên repository trong URL.

Nếu GitHub không nhận file ẩn `docs/.nojekyll`, tạo nó bằng **Add file → Create new file**, đặt tên `docs/.nojekyll` rồi lưu. Không cần GitHub Actions tùy chỉnh cho bản này.

Hướng dẫn chính thức: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Có trong gói

- `docs/`: toàn bộ website đang công bố, giữ nguyên nội dung file: giao diện sáng/tối, Việt/Anh, vòng quay, lọc khu vực, danh sách quán, bản đồ, menu, điều khoản và quyền riêng tư.
- `docs/cafes.json`: 50 địa điểm đang dùng.
- `docs/menus.json`: 1.250 mục đồ uống trong snapshot công khai hiện tại; không phải kiểm chứng lại vào ngày xuất.
- `database/`: dữ liệu menu để chỉnh sửa, bộ kiểm tra/tạo snapshot, công cụ review offline và cấu hình Airtable không chứa token.
- `serve.cjs`: máy chủ xem thử trên máy.
- `test-features.cjs`, `test-menus.cjs`, `verify.cjs`: kiểm tra chức năng và dữ liệu.
- `PLATFORM.md`: nền tảng, phụ thuộc và cách vận hành sau khi chuyển hosting.
- `EXPORT-MANIFEST.json`: phiên bản nguồn và SHA-256 từng file website để đối chiếu.
- `ATTRIBUTION.md`: nguồn ảnh minh họa.

## Chạy thử trên máy — tùy chọn

Cài Node.js 20 trở lên, mở terminal trong thư mục dự án:

```sh
npm start
```

Mở http://127.0.0.1:4173/ . Không mở trực tiếp `docs/index.html` bằng file:// vì trình duyệt có thể chặn đọc JSON. Không cần chạy npm install.

Kiểm tra: `npm test`.

## Sửa website và dữ liệu

- Giao diện: `docs/index.html`, `docs/style.css`.
- Nội dung Việt/Anh: `docs/i18n.js`.
- Logic chọn quán: `docs/app.js`, `docs/cafe-logic.js`.
- Logic nguồn menu, thời hạn và signature: `docs/menu-logic.js`.
- Quán và địa chỉ: `docs/cafes.json`. `hanoi-cafes.json` là bản đối chiếu, không phải file trình duyệt đọc.
- Menu: chỉnh `database/menu-database.json`, chạy `npm run build:menus` rồi kiểm tra `npm test`.
- Công cụ review: chạy `npm run build:review` để tạo lại `database/menu-editor.html` từ dữ liệu hiện tại, rồi mở file HTML đó. Tải file review về để giữ thay đổi; công cụ không tự cập nhật website hay Airtable.
- Commit cả dữ liệu nguồn lẫn `docs/menus.json` đã tạo lại. GitHub Pages phục vụ thư mục docs; nó không tự chạy bộ tạo menu.

Không có đồng bộ Airtable tự động trong gói này. Có thể tiếp tục quản lý bằng Airtable hoặc chỉnh JSON trực tiếp. Xem PLATFORM.md.

Kho mã nguồn Public làm các file trong database cũng có thể được tải về, dù GitHub Pages chỉ phục vụ docs. Không thêm ghi chú riêng tư hay khóa truy cập vào repository. Email liên hệ công khai hiện tại vẫn được giữ nguyên.

## Quyền sử dụng

Gói không tự gán giấy phép MIT hay giấy phép nguồn mở khác. Bạn có thể chọn giấy phép cho mã do mình sở hữu khi công bố. Ảnh, tên thương hiệu và dữ liệu bên thứ ba vẫn theo quyền tương ứng; xem ATTRIBUTION.md. Công bố repository không đồng nghĩa tự động cấp giấy phép sử dụng lại mọi tài nguyên.
