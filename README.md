# Lá thư 20/10

Trang quà tặng ngày Phụ nữ Việt Nam. Chỉ gồm HTML, CSS và JavaScript thuần, không cần cài đặt gì.

## Cách chạy

Mở file `index.html` bằng trình duyệt (nhấp đúp là được). Cần có mạng để tải phông chữ từ Google Fonts. Nếu mất mạng, trang vẫn chạy nhưng dùng phông dự phòng.

## Các file

| File | Vai trò |
|---|---|
| `index.html` | Khung trang: phong bì, lá thư, vườn hoa, nút gửi tim, bảng tuỳ chỉnh |
| `style.css` | Màu sắc, phông chữ, bố cục, hiệu ứng |
| `script.js` | Nội dung thư, phong bì mở, cánh hoa rơi, vườn hoa, trái tim bay |

## Sửa nội dung thư

Mở `script.js`, phần `CONFIG` nằm ngay đầu file. Ở đó bạn đổi được:

- `name`: tên người nhận
- `from`: tên bạn ký cuối thư
- `rel`: cách xưng hô (`friend`, `love`, `mom`, `sis`). Muốn thêm kiểu xưng hô mới, thêm một dòng vào `RELS` trong cùng file
- `note`: lời riêng
- `lines`: từng đoạn của thư. Dùng `{I}`, `{U}`, `{Ic}`, `{Uc}` để tự điền cách xưng hô
- `closing`: câu kết
- `autoOpenMs`: thời gian phong bì tự mở
- `showCustomizer`: đặt `false` để ẩn nút "Tuỳ chỉnh" trước khi gửi cho người ấy

Ngày hiển thị trên thư ("Thứ Ba", "20.10.2026") và dòng chữ cuối trang nằm trong `index.html`, tìm `sheet-top` và `foot`.

## Sửa giao diện

Mở đầu `style.css` có khối `:root` chứa toàn bộ màu và phông chữ:

- `--night`, `--night-2`: màu nền đêm
- `--rose`, `--petal`, `--gold`: màu nhấn
- `--paper`, `--paper-ink`: màu tờ giấy và chữ trên giấy
- `--display`, `--script`, `--ui`: phông chữ tiêu đề và thư, phông viết tay, phông giao diện

Muốn đổi phông, thay tên trong dòng `<link>` Google Fonts ở `index.html` và trong các biến trên.

Trong `script.js`:

- `PCOL`: màu cánh hoa rơi
- `PAL`: bảng màu các bông hoa trong vườn (mỗi bộ gồm màu trong, màu ngoài, màu nhuỵ)
- `HCOL`: màu trái tim bay
- Số cánh hoa rơi: biến `n` trong hàm `sizeP`

## Đưa lên mạng để gửi link

Có thể thả cả thư mục này lên các dịch vụ host tĩnh miễn phí như GitHub Pages, Netlify hay Cloudflare Pages. Nhớ đặt `showCustomizer: false` trước khi đăng.
