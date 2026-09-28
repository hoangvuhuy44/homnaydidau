# Hôm nay đi đâu? ☕

**Bớt nghĩ một quán. Thêm một chỗ quen.**

Chưa biết đi cà phê ở đâu? Chọn khu vực, quay một lượt hoặc tự tìm một quán trong danh sách.

**[Mở website](https://hoangvuhuy44.github.io/homnaydidau/)** · **[Báo lỗi / góp ý](https://github.com/hoangvuhuy44/homnaydidau/issues)**

Hôm nay đi đâu? khởi đầu từ một danh sách quán cà phê ở Hà Nội. Repo này chứa mã website và dữ liệu đi kèm để bạn chạy trên máy, tìm hiểu cách hoạt động và tùy chỉnh thành phiên bản của mình: đổi giao diện, thêm những quán yêu thích hoặc xây một danh sách cho thành phố khác.

Website dùng **HTML, CSS, JavaScript thuần và JSON**. Không cần framework, cài thư viện, API key hay tài khoản ChatGPT để chạy bản hiện tại.

## Có gì trong ứng dụng?

- Quay chọn quán ngẫu nhiên theo một hoặc nhiều khu vực.
- Tìm quán theo tên, địa chỉ, khu vực và chọn trực tiếp từ danh sách.
- Xem bản đồ và mở chỉ đường trên Google Maps.
- Xem menu theo từng chi nhánh; lọc gợi ý cà phê hoặc đồ uống khác, ưu tiên món signature / quán đề xuất khi có nguồn phù hợp.
- Chuyển Tiếng Việt / English và giao diện sáng / tối.

Giá và menu là dữ liệu đã lưu kèm nguồn, không phải thông tin tồn kho hay giá được cập nhật trực tiếp từ quán.

## Chạy trên máy

Cần **Git** và **Node.js 20 trở lên**. Mở Terminal, PowerShell hoặc terminal trong VS Code:

```sh
git clone https://github.com/hoangvuhuy44/homnaydidau.git
cd homnaydidau
npm start
```

Mở **[http://127.0.0.1:4173/](http://127.0.0.1:4173/)**. Nhấn `Ctrl + C` trong terminal để dừng.

Không cần chạy `npm install`, tạo `.env` hay thiết lập database. Đừng mở trực tiếp `docs/index.html` bằng `file://`: trình duyệt có thể chặn tải các file JSON.

Nếu chưa dùng Git, chọn **Code → Download ZIP** trên GitHub, giải nén rồi mở terminal trong thư mục có `package.json` và chạy `npm start`.

Các lệnh có sẵn:

| Lệnh | Công dụng |
| --- | --- |
| `npm start` | Chạy website tại `127.0.0.1:4173` |
| `npm test` | Kiểm tra logic, dữ liệu và đường dẫn nội bộ |
| `npm run build:menus` | Kiểm tra dữ liệu menu nguồn và tạo lại `docs/menus.json` |
| `npm run build:review` | Tạo lại công cụ review menu từ dữ liệu nguồn |

Repo không có lệnh `npm run build` hoặc `npm run dev`. Các file trong `docs/` được phục vụ trực tiếp.

## Làm phiên bản của bạn

Nếu muốn lưu thay đổi lên tài khoản GitHub của mình, hãy **Fork** repo trước, rồi clone bản fork. Thay `YOUR-USERNAME` bằng tên tài khoản của bạn:

```sh
git clone https://github.com/YOUR-USERNAME/homnaydidau.git
cd homnaydidau
git switch -c customize
npm start
```

Bạn có thể bắt đầu từ một thay đổi nhỏ, như đổi câu giới thiệu hoặc màu nền, rồi tải lại trình duyệt để xem kết quả.

### 1. Đổi tên, nội dung và giao diện

| Bạn muốn đổi gì? | File cần xem |
| --- | --- |
| Tên thương hiệu, bố cục, nội dung HTML tĩnh | [`docs/index.html`](docs/index.html) |
| Câu giới thiệu, nhãn nút, tiêu đề và nội dung Việt / Anh | [`docs/i18n.js`](docs/i18n.js) |
| Màu sắc, font, khoảng cách, giao diện sáng / tối | [`docs/style.css`](docs/style.css) |
| Ảnh minh họa | `docs/coffee.jpg` và thẻ ảnh trong `docs/index.html` |
| Vòng quay, hiển thị kết quả, tương tác bản đồ, email nhận góp ý menu | [`docs/app.js`](docs/app.js) |
| Quy tắc lọc, tìm kiếm và chọn quán | [`docs/cafe-logic.js`](docs/cafe-logic.js) |
| Quy tắc chọn món và kiểm tra nguồn menu | [`docs/menu-logic.js`](docs/menu-logic.js) |

Nhiều nội dung được JavaScript cập nhật khi tải trang. Nếu sửa chữ trong HTML nhưng vẫn thấy nội dung cũ, kiểm tra cả `docs/i18n.js`. Khi sửa bản dịch, giữ cùng bộ khóa cho hai ngôn ngữ.

Trước khi công bố bản riêng, cập nhật cả tên thành phố, email nhận góp ý, các trang `terms*.html`, `privacy*.html` và ghi công ảnh tương ứng. Dùng ảnh mà bạn có quyền sử dụng.

### 2. Thêm hoặc thay danh sách quán

Chỉnh **[`docs/cafes.json`](docs/cafes.json)** — đây là file website thực sự đọc. File `hanoi-cafes.json` ở thư mục gốc chỉ là bản đối chiếu.

Mỗi phần tử trong mảng `cafes` có dạng như bản ghi đang dùng:

```json
{
  "id": "cafe-001",
  "name": "ORO cafe",
  "address": "17 P. Trương Hán Siêu, Cửa Nam, Hà Nội",
  "district": "Hoàn Kiếm",
  "addressCheckedAt": "2026-09-11",
  "source": "https://maps.app.goo.gl/ByN8MiVXCTDPZoCa7"
}
```

Khi thêm hoặc sửa quán:

- Dùng `id` duy nhất và giữ ID ổn định cho cùng một chi nhánh. Menu liên kết với quán qua ID này.
- Giá trị `district` phải có trong mảng `districts` của cùng file.
- Cập nhật mảng `places` để khớp tên và thứ tự trong `cafes`.
- Cập nhật nguồn và ngày kiểm tra theo thông tin bạn thực sự xác minh.
- Khi thêm hoặc xóa quán, cập nhật bản ghi menu tương ứng trong `database/menu-database.json` để mỗi quán có một bản ghi `cafeId` khớp, kể cả khi `items` còn rỗng.

Các nhãn khu vực Hà Nội hiện tại dùng để lọc theo vùng quận/huyện quen thuộc. Bạn có thể thay chúng bằng hệ khu vực phù hợp với danh sách riêng.

### 3. Cập nhật menu

Dữ liệu nguồn nằm ở **[`database/menu-database.json`](database/menu-database.json)**. Sau khi sửa, chạy:

```sh
npm run build:menus
npm test
```

Commit cả `database/menu-database.json` và `docs/menus.json` được tạo lại. **Không sửa riêng `docs/menus.json`**, vì lần tạo tiếp theo sẽ ghi đè thay đổi đó.

Mỗi món cần tên Việt / Anh, loại `coffee` hoặc `other`, giá và trạng thái. Giá chưa biết để `null`. Món `published` cần nguồn phù hợp với chi nhánh; `draft` và `retired` không được đưa vào menu công khai. Nhãn `signature` / `house_pick` cũng cần bằng chứng riêng.

Menu quá hạn theo quy tắc 180 ngày có thể không còn được gợi ý. Hãy kiểm tra lại nguồn trước khi cập nhật ngày xác minh.

Nếu thích chỉnh qua giao diện, chạy `npm run build:review`, rồi mở `database/menu-editor.html`. Nhấn **Download review file** để giữ thay đổi. File tải về là bản đề xuất để đối chiếu và đưa vào dữ liệu nguồn; công cụ không tự ghi lại website hay Airtable.

Xem thêm schema và quy tắc tại [`database/README.md`](database/README.md); đối chiếu JSON hiện tại khi cần kiểm tra số lượng bản ghi.

### 4. Dùng bản đồ của bạn

Bản đồ tổng hiện tại là một Google My Maps riêng. Sửa danh sách JSON **không tự cập nhật các điểm trên bản đồ tổng**.

Để thay bản đồ, cập nhật cả:

- `src` của iframe `collectionMap` trong `docs/index.html`.
- Giá trị `mapAllSrc` trong `docs/app.js`, dùng khi trở về bản đồ tổng.

Chức năng xem một quán trên bản đồ lấy tên và địa chỉ của quán từ dữ liệu. Khi chuyển sang thành phố khác, cập nhật cả các nhãn Hà Nội trong HTML, JavaScript và bản dịch.

### 5. Kiểm tra và lưu thay đổi

Chạy `npm test`, rồi thử trên trình duyệt: lọc khu vực, quay quán, tìm kiếm, đổi ngôn ngữ, mở menu và bản đồ.

**Bộ test hiện tại gắn với dữ liệu Hà Nội**, gồm số lượng quán, khu vực, một số tên, món và URL bản đồ cụ thể. Nếu thay danh sách hoặc bản đồ, cần cập nhật các kỳ vọng tương ứng trong `test-features.cjs` và `test-menus.cjs`. Giữ lại các kiểm tra về ID duy nhất, nguồn menu, lọc đúng khu vực và đường dẫn hợp lệ.

Lưu và đẩy nhánh của bạn:

```sh
git add .
git commit -m "Customize my coffee picker"
git push -u origin customize
```

Trên GitHub, mở pull request từ `customize` vào `main` **của bản fork của bạn** và merge khi sẵn sàng công bố.

## Đưa bản riêng lên GitHub Pages

Sau khi thay đổi đã nằm trên nhánh `main` của repo bạn:

1. Vào **Settings → Pages → Build and deployment**.
2. Chọn **Source: Deploy from a branch**.
3. Chọn **Branch: main**, thư mục **/docs**, rồi **Save**.
4. Chờ GitHub hoàn tất triển khai và mở URL được hiển thị tại trang Pages.

Nếu giữ tên repo `homnaydidau`, địa chỉ thường là `https://YOUR-USERNAME.github.io/homnaydidau/`. Chọn đúng nhánh nếu repo của bạn dùng tên khác `main`.

Giữ file `docs/.nojekyll` và dùng đường dẫn tương đối cho tài nguyên nội bộ, như `style.css` hoặc `cafes.json`. GitHub Pages phục vụ `docs/` trực tiếp; nó không tự chạy `build:menus` khi bạn chỉnh dữ liệu nguồn.

[Hướng dẫn cấu hình GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Dữ liệu và dịch vụ bên ngoài

Trình duyệt tải danh sách quán và menu từ JSON cùng website. **Bản repo này chưa có đồng bộ Airtable hoặc Supabase tự động.** Bạn có thể quản lý dữ liệu bằng công cụ riêng, nhưng cần xuất về schema hiện có, kiểm tra và cập nhật snapshot để website nhận thay đổi.

Giao diện và ngôn ngữ được lưu bằng `localStorage` trong trình duyệt hiện tại; chúng không đồng bộ giữa thiết bị. Xóa dữ liệu website sẽ xóa các tùy chọn đã lưu.

Google Fonts, bản đồ và các liên kết nguồn cần kết nối bên ngoài. Vì vậy, chạy local không đồng nghĩa mọi tính năng hoạt động hoàn toàn offline.

Nếu repo Public, các file trong `database/` cũng có thể được đọc dù Pages chỉ phục vụ `docs/`. Không đưa token, mật khẩu hoặc ghi chú riêng tư vào repo. Xem [`PLATFORM.md`](PLATFORM.md) để biết thêm về cách vận hành.

## Gặp lỗi?

| Hiện tượng | Cách kiểm tra |
| --- | --- |
| `npm` hoặc `node` không được nhận diện | Cài Node.js đáp ứng yêu cầu rồi mở lại terminal |
| Không tải được danh sách quán | Chạy bằng `npm start`; kiểm tra JSON hợp lệ và `district` thuộc mảng `districts` |
| Cổng `4173` đang được dùng | Dừng tiến trình đang chiếm cổng hoặc sửa cổng trong `serve.cjs`; script hiện tại không nhận cờ `--port` |
| Sửa menu nhưng website chưa đổi | Chạy `npm run build:menus`, commit file sinh ra và đợi Pages triển khai |
| Bản đồ tổng vẫn có quán cũ | Cập nhật Google My Maps và cả hai vị trí URL nhúng nêu trên |
| Pages báo 404 | Kiểm tra nhánh xuất bản, thư mục `/docs` và file `docs/index.html` |
| Test lỗi sau khi đổi danh sách | Đọc lỗi và cập nhật các kỳ vọng dữ liệu cụ thể trong bộ test |

## Đóng góp và ghi công

Chào đón [báo lỗi, đề xuất quán hoặc ý tưởng](https://github.com/hoangvuhuy44/homnaydidau/issues). Với góp ý menu, gửi đúng chi nhánh, món, giá, nguồn và ngày kiểm tra để dễ đối chiếu.

Muốn đóng góp code, hãy fork repo, tạo nhánh và gửi pull request về repo gốc. Mô tả thay đổi và cách đã kiểm tra; nếu có sửa giao diện, kèm ảnh trước / sau sẽ giúp việc review dễ hơn.

Ảnh minh họa hiện tại: **Drew Gilliam / Unsplash**. Xem [`ATTRIBUTION.md`](ATTRIBUTION.md).

Repo hiện chưa kèm file `LICENSE`. README này không tự gán giấy phép MIT hoặc giấy phép nguồn mở khác; khi cần điều khoản sử dụng lại và phân phối, hãy trao đổi với tác giả. Ảnh và tài nguyên bên thứ ba cần được xem xét theo quyền tương ứng.
