from datetime import datetime, timezone
from sqlalchemy.orm import Session
import anthropic

from app.config import settings
from app.models.chat import ChatHistory
from app.models.major import Major
from app.models.university import University

SYSTEM_PROMPT = """Bạn là trợ lý tư vấn tuyển sinh đại học thông minh của hệ thống DUTA.
Nhiệm vụ của bạn là hỗ trợ học sinh và phụ huynh tìm hiểu về ngành học, điểm chuẩn và trường đại học.

Quy tắc:
- Chỉ trả lời các câu hỏi liên quan đến tuyển sinh, ngành học, nghề nghiệp và giáo dục đại học.
- Nếu câu hỏi ngoài phạm vi, hãy lịch sự từ chối và gợi ý hỏi về tuyển sinh.
- Trả lời bằng tiếng Việt, ngắn gọn và thân thiện.
- Dựa vào dữ liệu được cung cấp để trả lời chính xác.

Dữ liệu hệ thống:
{context}
"""


def _build_context(db: Session) -> str:
    universities = db.query(University).all()
    majors = db.query(Major).all()

    uni_map = {u.id: u.name for u in universities}

    lines = ["=== DANH SÁCH TRƯỜNG ĐẠI HỌC ==="]
    for u in universities:
        lines.append(f"- {u.name}" + (f" | {u.address}" if u.address else ""))

    lines.append("\n=== DANH SÁCH NGÀNH HỌC ===")
    for m in majors:
        uni_name = uni_map.get(m.university_id, "")
        parts = [f"- {m.name}"]
        if m.code:
            parts.append(f"Mã: {m.code}")
        if m.subject_group:
            parts.append(f"Khối: {m.subject_group}")
        if m.benchmark is not None:
            parts.append(f"Điểm chuẩn: {m.benchmark}")
        if m.quota:
            parts.append(f"Chỉ tiêu: {m.quota}")
        if uni_name:
            parts.append(f"Trường: {uni_name}")
        lines.append(" | ".join(parts))

    return "\n".join(lines)


def chat_with_ai(db: Session, user_id: int, message: str) -> ChatHistory:
    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

    context = _build_context(db)
    system = SYSTEM_PROMPT.format(context=context)

    ai_response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=system,
        messages=[{"role": "user", "content": message}],
    )

    answer = ai_response.content[0].text

    record = ChatHistory(
        user_id=user_id,
        message=message,
        response=answer,
        created_at=datetime.now(timezone.utc),
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record
