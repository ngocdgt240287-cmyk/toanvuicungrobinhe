# TOÁN VUI – ROBI | BẢN NÂNG CẤP HÌNH HỌC LỚP 3

## 1. Nội dung trong bản này
- Website Next.js với nội dung học Toán mẫu cho lớp 1–5, bộ lọc khối lớp/mạch kiến thức và câu hỏi luyện tập.
- Mô phỏng tia số, gộp số theo hàng, phân số, đồng hồ.
- Khu vực hình học có lựa chọn hình chữ nhật, hình vuông, tam giác và tứ giác minh họa; thanh trượt số đo hình phẳng có giới hạn tối đa 100 cm; nhãn số đo hiển thị cạnh hình; đường cao minh họa bằng nét đứt.
- Hoạt động khám phá cắt ghép các mảnh hình để thảo luận cách phân chia/ghép hình và bảo toàn diện tích.
- Kết quả phân số được trình bày theo dạng tử số – gạch phân số – mẫu số.
- Trợ lý Robi AI ở phía máy chủ. Phần AI cần khóa API riêng; các khu vực học và mô phỏng vẫn sử dụng được khi chưa cấu hình AI.

## 2. Lưu ý về nội dung Toán 3 – Bài 50
Mô phỏng chu vi tập trung vào việc nhận biết chu vi là tổng độ dài các cạnh. Khu vực cắt ghép diện tích là hoạt động khám phá/mở rộng riêng, không nên hiểu là nội dung đồng nhất với bài học chu vi. Hình minh họa không thay thế hình vẽ theo tỉ lệ và cần giáo viên kiểm tra trước khi dùng chính thức.

## 3. Yêu cầu cài đặt
- Windows 10/11
- Node.js phiên bản 20.9 trở lên (khuyến nghị bản LTS)
- npm đi kèm Node.js
- VS Code và trình duyệt hiện đại

## 4. Mở đúng thư mục dự án
Sau khi giải nén, mở thư mục `Toan_Vui_Robi_Hoan_Chinh` trong VS Code. Ngay ở cấp đầu tiên của thư mục này phải nhìn thấy `package.json`, `app`, `lib`, `next.config.ts`.
**Không mở thư mục cha chứa thư mục dự án và không mở riêng thư mục `app` hoặc `lib`.**

## 5. Chạy lần đầu trên Windows
Trong VS Code chọn Terminal → New Terminal. Kiểm tra đang ở thư mục chứa package.json bằng lệnh:

```powershell
 dir package.json
```

Nếu nhìn thấy package.json, chạy lần lượt:

```powershell
npm install
npm run dev
```

Khi terminal hiện `Ready` và `http://localhost:3000`, mở địa chỉ đó trong Chrome hoặc Edge.

Nếu `dir package.json` báo không tìm thấy, chạy lệnh sau để tìm vị trí:

```powershell
Get-ChildItem -Path . -Filter package.json -Recurse -File | Select-Object -ExpandProperty FullName
```

Sau đó mở đúng thư mục cha trực tiếp chứa `package.json` bằng File → Open Folder trong VS Code.

## 6. Những lần chạy tiếp theo
Mở đúng thư mục dự án trong VS Code → Terminal → New Terminal → chạy:

```powershell
npm run dev
```

Dừng máy chủ bằng `Ctrl + C` trong terminal.

## 7. Cấu hình Robi AI (không bắt buộc)
Sao chép `.env.example` thành `.env.local`, mở `.env.local` và điền khóa API do chính bạn quản lý:

```env
OPENAI_API_KEY=your_secret_key
OPENAI_MODEL=gpt-4.1-mini
```

Không chia sẻ `.env.local`, không gửi khóa API cho người khác và không đưa khóa lên GitHub. Khởi động lại `npm run dev` sau khi thay đổi tệp này. Nếu không cấu hình khóa, các phần học và mô phỏng vẫn dùng được; chỉ tính năng AI không hoạt động.

## 8. Kiểm tra bản dựng
Sau khi `npm install` hoàn tất, có thể chạy:

```powershell
npm run typecheck
npm run build
```

## 9. Cấu trúc
- `app/page.tsx`: trang chính, hoạt động học và mô phỏng.
- `app/globals.css`: giao diện.
- `lib/curriculum.ts`: dữ liệu bài học và câu hỏi mẫu.
- `app/api/tutor/route.ts`: API trợ lý AI.
- `package.json`: lệnh và thư viện của dự án.

## 10. Phạm vi
Đây là dự án học tập có thể chạy cục bộ và tiếp tục phát triển. Dữ liệu bài học/câu hỏi là dữ liệu mẫu, không phải bản sao đầy đủ hay nội dung được chứng nhận của SGK Kết nối tri thức. Cần giáo viên rà soát kiến thức, lời giải, hình vẽ và độ phù hợp lứa tuổi trước khi triển khai cho học sinh. Điểm và tiến độ hiện lưu trong phiên trình duyệt, chưa có tài khoản/cơ sở dữ liệu đồng bộ.


## 11. Nut doc cau tra loi Robi
- Khu vuc Hoi Robi co nut "Nghe Robi doc" va "Dung doc".
- Su dung SpeechSynthesis cua trinh duyet, khong can API doc giong tra phi.
- Ma dat ngon ngu `vi-VN`, nhung giong doc cu the tuy vao giong he dieu hanh/trinh duyet cai dat. Khong the bao dam luon co giong nu mien Nam.
- Tro chuyen AI hien tai van dung OpenAI API qua `app/api/tutor/route.ts`; API key/model co the phat sinh chi phi theo tai khoan va chinh sach hien hanh. Khong xem day la dich vu mien phi khong gioi han.
- Xem `HUONG_DAN_ROBI_AI_VA_GIONG_DOC.txt` de lam theo tung buoc va cap nhat len Vercel.
