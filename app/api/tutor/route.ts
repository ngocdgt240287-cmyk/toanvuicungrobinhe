
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const InputSchema = z.object({
  question: z.string().trim().min(1).max(500),
  grade: z.number().int().min(1).max(5),
  mode: z.enum(["concept", "hint", "review", "practice"]).default("concept")
});


const instructions = `
Bạn là Robi, trợ lý học Toán vui vẻ, kiên nhẫn dành cho học sinh tiểu học Việt Nam lớp 1 đến lớp 5.

MỤC TIÊU:
- Giúp học sinh hiểu bản chất Toán học, không chỉ đưa ra đáp án.
- Giải thích đúng chương trình và trình độ của lớp học sinh đã chọn.
- Dùng câu ngắn, từ ngữ đơn giản, gần gũi và khuyến khích học sinh suy nghĩ.

QUY TẮC THEO LỚP:
1. Luôn căn cứ vào lớp học sinh đã chọn để quyết định kiến thức và cách giải thích.
2. Không tự ý đưa kiến thức của lớp trên vào bài học của lớp dưới.
3. Nếu học sinh hỏi kiến thức vượt quá lớp đang học, hãy nhẹ nhàng nói rằng đây là kiến thức sẽ học ở lớp cao hơn.
4. Chỉ giải thích mở rộng thật đơn giản khi cần thiết; không dùng thuật ngữ khó hoặc bắt học sinh ghi nhớ kiến thức vượt trình độ.
5. Ví dụ: học sinh lớp 2 hỏi về phân số thì chỉ nên dùng hình ảnh chia bánh, chia đồ vật thành các phần bằng nhau. Không trình bày kiến thức phân số phức tạp như quy đồng hoặc rút gọn.

CÁCH TRÌNH BÀY:
6. Mở đầu thân thiện, không cần chào hỏi dài dòng ở mọi câu trả lời.
7. Chia lời giải thành các bước ngắn, có tiêu đề rõ ràng.
8. Dùng chữ đậm cho tiêu đề và ý quan trọng.
9. Chỉ dùng danh sách khi thực sự cần thiết.
10. Không lạm dụng Markdown, ký hiệu trang trí hoặc công thức LaTeX.
11. Với phép tính đơn giản, ưu tiên viết phép tính bằng ký hiệu thông thường, ví dụ: 125 + 234 = 359.
12. Chỉ dùng công thức riêng một dòng khi điều đó giúp học sinh dễ hiểu.
13. Không lặp lại cùng một ý nhiều lần.
14. Không để câu trả lời kết thúc giữa chừng.

CÁCH HƯỚNG DẪN:
15. Với bài toán có lời văn, trình bày phép tính, lời giải và đáp số nếu phù hợp với lớp học sinh.
16. Giải thích vì sao chọn phép cộng, trừ, nhân hoặc chia.
17. Với học sinh làm sai, nhẹ nhàng chỉ ra chỗ cần xem lại và hướng dẫn từng bước.
18. Với câu hỏi khái niệm, đưa ra một ví dụ gần gũi.
19. Với bài luyện tập, chỉ đưa đề bài nếu học sinh đang ở chế độ luyện tập.
20. Kiểm tra lại phép tính và đơn vị trước khi trả lời.

QUY TẮC AN TOÀN:
21. Không hỏi tên đầy đủ, địa chỉ, số điện thoại, tên trường hoặc thông tin riêng tư.
22. Không mắng hoặc làm học sinh xấu hổ khi trả lời sai.
23. Nếu câu hỏi ngoài phạm vi Toán tiểu học, lịch sự hướng cuộc trò chuyện trở lại việc học Toán.
24. Không bịa số trang, tên bài trong sách giáo khoa hoặc dữ kiện không được cung cấp.
`;

export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Không đọc được GEMINI_API_KEY." },
      { status: 503 }
    );
  }

  let raw: unknown;

  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Dữ liệu câu hỏi không hợp lệ." },
      { status: 400 }
    );
  }

  const parsed = InputSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Em hãy nhập câu hỏi ngắn gọn nhé." },
      { status: 400 }
    );
  }

 
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        timeout: 12000
      }
    });

    const { question, grade, mode } = parsed.data;

    const modeText = {
      concept: `Học sinh lớp ${grade}. Giải thích khái niệm Toán bằng 3-5 câu ngắn và một ví dụ đơn giản.`,
      hint: `Học sinh lớp ${grade}. Chỉ đưa ra một gợi ý nhỏ, không nêu đáp án cuối cùng ngay.`,
      review: `Học sinh lớp ${grade}. Nhắc một ý chính và đưa một câu hỏi ngắn để em tự trả lời.`,
      practice: `Học sinh lớp ${grade}. Tạo đúng một bài toán ngắn, vui, phù hợp trình độ. Chỉ đưa đề bài, không tiết lộ đáp án hoặc lời giải.`
    }[mode];

    const config = {
      systemInstruction: `${instructions}\n${modeText}`,
      maxOutputTokens: 700,
      thinkingConfig: {
        thinkingBudget: 0
      }
    };

    let result;

    // Ưu tiên Gemini 3.8 Flash
    try {
      console.log("ROBI: Đang thử Gemini 3.8 Flash");

      result = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: question,
        config
      });

      console.log("ROBI: Gemini 3.8 Flash đã phản hồi");

    } catch (firstError) {
      const message =
        firstError instanceof Error
          ? firstError.message.toLowerCase()
          : String(firstError).toLowerCase();

      const status =
        typeof firstError === "object" &&
        firstError !== null &&
        "status" in firstError
          ? Number(firstError.status)
          : 0;

      const canUseFallback =
        status === 503 ||
        status === 429 ||
        message.includes("timeout") ||
        message.includes("timed out");

      if (!canUseFallback) {
        throw firstError;
      }

      console.warn(
        "ROBI: Gemini 3.8 gặp sự cố. Đang chuyển sang Gemini 3.6 Flash."
      );

      // Tự động chuyển sang model dự phòng
      result = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: question,
        config
      });

      console.log("ROBI: Gemini 3.6 Flash đã phản hồi");
    }

    const answer = result.text?.trim();

    if (!answer) {
      return NextResponse.json(
        { error: "Robi chưa tạo được câu trả lời. Em thử hỏi lại nhé!" },
        { status: 502 }
      );
    }

    return NextResponse.json({ answer });

  } catch (error) {
    console.error("Robi Gemini API error:", error);

    const message =
      error instanceof Error
        ? error.message.toLowerCase()
        : String(error).toLowerCase();

    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error
        ? Number(error.status)
        : 0;

    const isTimeout =
      message.includes("timeout") ||
      message.includes("timed out");

    return NextResponse.json(
      {
        error: isTimeout
          ? "Robi đang mất nhiều thời gian để suy nghĩ. Em thử lại nhé!"
          : status === 503 || status === 429
            ? "Hiện tại các máy chủ AI đều đang bận. Em đợi một lát rồi hỏi Robi lại nhé!"
            : "Robi đang gặp sự cố kết nối. Em thử lại nhé!"
      },
      {
        status: isTimeout ? 504 : status || 500
      }
    );
  }
}
