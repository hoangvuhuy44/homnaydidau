# Nền tảng và khả năng chuyển hosting

## Website

Frontend là HTML5, CSS và JavaScript thuần. Không framework, không bước biên dịch, không thư viện npm bắt buộc. Các file trong docs là mã nguồn trực tiếp của trang công khai, không phải bản rút gọn thiếu mã nguồn.

Hosting hiện tại: OpenAI Sites tại https://hanoi-coffee-shuffle.hoang-vuhuy44.chatgpt.site/ . Bản gốc khai báo static.directory = dist. Gói GitHub đổi tên thư mục xuất thành docs để có thể chọn main /docs trong GitHub Pages; nội dung website không đổi. Không cần tài khoản Sites để chạy bản GitHub.

Máy chủ Sites và hệ thống nội bộ GitHub/Airtable/Google là dịch vụ của nhà cung cấp, không phải mã nguồn thuộc dự án để xuất. Gói này chứa mã ứng dụng và dữ liệu snapshot có trong kho nguồn đã công bố; không giả lập hay kèm mã nội bộ của những nền tảng đó.

## Menu và Airtable

Theo cấu hình kho nguồn hiện tại, cơ sở dữ liệu vận hành là Airtable **Hanoi Coffee Shuffle — Menu Operations**, gồm bốn bảng được ánh xạ trong database/airtable-sync-config.json: cafes, menuItems, sources, menuVerifications.

Trình duyệt không gọi Airtable. Nó tải cafes.json và menus.json cùng miền website. Các thay đổi ở Airtable phải được đưa vào snapshot, kiểm tra và công bố lại. Không có chương trình tự đồng bộ Airtable trong kho nguồn hiện tại; không cần token Airtable để phục vụ bản GitHub Pages.

Gói chứa snapshot JSON hiện có và các ID cấu hình không bí mật. Đây không phải bản sao toàn bộ Airtable base, lịch sử, views, automations, quyền truy cập hoặc ảnh đính kèm. Các menu dùng evidenceId tham chiếu ảnh đã kiểm tra; ảnh gốc không nằm trong kho nguồn nên không có trong ZIP. Website vẫn hoạt động với dữ liệu đã chép, nhưng cần giữ ảnh bằng chứng riêng để kiểm tra lại sau này.

## Phụ thuộc bên ngoài

- Google Fonts: tải font Be Vietnam Pro; khi không tải được, trình duyệt dùng font dự phòng.
- Google Maps / My Maps: iframe bản đồ và liên kết địa điểm. Bản đồ nhúng hiện tại được giữ nguyên; tài khoản sở hữu bản đồ vẫn kiểm soát quyền chia sẻ.
- Liên kết nguồn menu và email: mở dịch vụ bên ngoài khi người dùng chọn.
- WebMCP: tích hợp tùy chọn nếu trình duyệt có document.modelContext; không phải điều kiện để dùng website.
- localStorage chỉ ghi nhớ giao diện và ngôn ngữ trên thiết bị.

## Những gì đã kiểm tra khi xuất

Mã nguồn khớp commit của phiên bản Sites 55 đã triển khai thành công. Các file công khai trong docs giữ nguyên byte so với dist của commit đó. Đã chạy bộ kiểm tra chức năng, đường dẫn nội bộ và menu trong gói xuất. Việc này không xác minh lại giờ mở cửa, giá hoặc món có sẵn tại quán.

## Bảo trì

Menu quá hạn theo quy tắc 180 ngày có thể không được gợi ý. Cần kiểm tra lại nguồn thực tế; không tự sửa ngày để làm dữ liệu có vẻ mới. Sau khi cập nhật và kiểm tra, commit lại docs/menus.json để GitHub Pages nhận bản mới.
