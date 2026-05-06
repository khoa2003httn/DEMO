"""
Chạy một lần để khởi tạo dữ liệu mẫu:
    cd backend
    python seed.py
"""
import sys
import os

sys.path.append(os.path.dirname(__file__))

from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.university import University
from app.models.major import Major
from app.models.post import Post
from app.core.security import hash_password

Base.metadata.create_all(bind=engine)

db = SessionLocal()

# ── Admin ──────────────────────────────────────────────────────────────────
if not db.query(User).filter(User.email == "admin@duta.edu.vn").first():
    admin = User(
        full_name="Quản trị viên",
        email="admin@duta.edu.vn",
        password_hash=hash_password("Admin@123"),
        role="admin",
    )
    db.add(admin)
    db.commit()
    print("✅ Tạo admin: admin@duta.edu.vn / Admin@123")
else:
    print("⚠️  Admin đã tồn tại, bỏ qua.")

# ── Trường đại học ─────────────────────────────────────────────────────────
universities_data = [
    {
        "name": "Trường ĐH Công nghệ Thông tin và Truyền thông - ĐH Thái Nguyên",
        "address": "Phường Tân Thịnh, TP. Thái Nguyên",
        "website": "https://ictu.edu.vn",
        "description": "Trường đào tạo chuyên ngành CNTT hàng đầu khu vực Đông Bắc.",
    },
    {
        "name": "Trường ĐH Bách khoa Hà Nội",
        "address": "Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
        "website": "https://hust.edu.vn",
        "description": "Một trong những trường kỹ thuật hàng đầu Việt Nam.",
    },
    {
        "name": "Trường ĐH Công nghệ - ĐH Quốc gia Hà Nội",
        "address": "144 Xuân Thủy, Cầu Giấy, Hà Nội",
        "website": "https://uet.vnu.edu.vn",
        "description": "Trường đào tạo công nghệ trực thuộc ĐH Quốc gia Hà Nội.",
    },
    {
        "name": "Trường ĐH FPT",
        "address": "Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội",
        "website": "https://daihoc.fpt.edu.vn",
        "description": "Trường đại học tư thục định hướng doanh nghiệp FPT.",
    },
]

uni_map = {}
for ud in universities_data:
    existing = db.query(University).filter(University.name == ud["name"]).first()
    if not existing:
        uni = University(**ud)
        db.add(uni)
        db.commit()
        db.refresh(uni)
        uni_map[ud["name"]] = uni.id
        print(f"✅ Tạo trường: {ud['name']}")
    else:
        uni_map[ud["name"]] = existing.id
        print(f"⚠️  Trường đã tồn tại: {ud['name']}")

# ── Ngành học ──────────────────────────────────────────────────────────────
ictu_id = uni_map.get("Trường ĐH Công nghệ Thông tin và Truyền thông - ĐH Thái Nguyên")
hust_id = uni_map.get("Trường ĐH Bách khoa Hà Nội")
uet_id  = uni_map.get("Trường ĐH Công nghệ - ĐH Quốc gia Hà Nội")
fpt_id  = uni_map.get("Trường ĐH FPT")

majors_data = [
    # ICTU
    {"name": "Kỹ thuật Phần mềm", "code": "7480103", "subject_group": "A00, A01", "benchmark": 22.5, "quota": 200, "university_id": ictu_id,
     "description": "Đào tạo kỹ sư phần mềm có khả năng thiết kế, xây dựng và vận hành hệ thống phần mềm."},
    {"name": "Công nghệ Thông tin", "code": "7480201", "subject_group": "A00, A01, D01", "benchmark": 21.0, "quota": 300, "university_id": ictu_id,
     "description": "Đào tạo cử nhân CNTT toàn diện về lập trình, mạng máy tính và hệ thống thông tin."},
    {"name": "Mạng máy tính và Truyền thông dữ liệu", "code": "7480102", "subject_group": "A00, A01", "benchmark": 20.0, "quota": 100, "university_id": ictu_id,
     "description": "Chuyên sâu về hạ tầng mạng, bảo mật và truyền thông số."},
    {"name": "Trí tuệ nhân tạo", "code": "7480107", "subject_group": "A00, A01", "benchmark": 24.0, "quota": 80, "university_id": ictu_id,
     "description": "Đào tạo chuyên gia AI/ML, xử lý ngôn ngữ tự nhiên và thị giác máy tính."},
    # HUST
    {"name": "Khoa học Máy tính", "code": "7480101", "subject_group": "A00, A01", "benchmark": 28.5, "quota": 150, "university_id": hust_id,
     "description": "Chương trình tiên tiến về lý thuyết và thực hành khoa học máy tính."},
    {"name": "Kỹ thuật Điện tử Viễn thông", "code": "7520207", "subject_group": "A00, A01", "benchmark": 27.0, "quota": 200, "university_id": hust_id,
     "description": "Đào tạo kỹ sư điện tử, vi xử lý và hệ thống nhúng."},
    # UET
    {"name": "Công nghệ Thông tin (Chất lượng cao)", "code": "7480201CLC", "subject_group": "A00, A01", "benchmark": 27.5, "quota": 100, "university_id": uet_id,
     "description": "Chương trình chất lượng cao, giảng dạy bằng tiếng Anh."},
    {"name": "Kỹ thuật Phần mềm (ĐHQGHN)", "code": "7480103", "subject_group": "A00, A01, D01", "benchmark": 26.0, "quota": 120, "university_id": uet_id,
     "description": "Đào tạo kỹ sư phần mềm theo chuẩn quốc tế của ĐHQGHN."},
    # FPT
    {"name": "Kỹ thuật Phần mềm (FPT)", "code": "7480103F", "subject_group": "A00, A01, D01", "benchmark": 24.5, "quota": 500, "university_id": fpt_id,
     "description": "Học theo dự án thực tế, kết nối doanh nghiệp FPT Software."},
    {"name": "Thiết kế mỹ thuật số", "code": "7210403", "subject_group": "H00, V00", "benchmark": 22.0, "quota": 200, "university_id": fpt_id,
     "description": "Đào tạo thiết kế đồ họa, UI/UX và truyền thông đa phương tiện."},
    {"name": "Trí tuệ nhân tạo (FPT)", "code": "7480107F", "subject_group": "A00, A01", "benchmark": 26.0, "quota": 150, "university_id": fpt_id,
     "description": "Chuyên sâu AI, Machine Learning và Data Science ứng dụng."},
]

for md in majors_data:
    if md["university_id"] is None:
        continue
    existing = db.query(Major).filter(Major.name == md["name"], Major.university_id == md["university_id"]).first()
    if not existing:
        major = Major(**md)
        db.add(major)
        db.commit()
        print(f"✅ Tạo ngành: {md['name']}")
    else:
        print(f"⚠️  Ngành đã tồn tại: {md['name']}")

# ── Bài viết mẫu ──────────────────────────────────────────────────────────
admin_user = db.query(User).filter(User.email == "admin@duta.edu.vn").first()
if admin_user:
    posts_data = [
        {"title": "Thông báo tuyển sinh đại học năm 2026", "type": "notice",
         "content": "Bộ Giáo dục và Đào tạo thông báo kế hoạch tuyển sinh đại học năm 2026. Thí sinh có thể đăng ký xét tuyển từ ngày 01/07/2026 đến 30/07/2026 trên Cổng thông tin tuyển sinh quốc gia."},
        {"title": "Điểm chuẩn đại học 2025 cập nhật đầy đủ", "type": "news",
         "content": "Tổng hợp điểm chuẩn các trường đại học khối kỹ thuật năm 2025. Nhìn chung, điểm chuẩn ngành CNTT và Kỹ thuật phần mềm tăng 0.5-1.5 điểm so với năm 2024."},
        {"title": "Hướng dẫn sử dụng chatbot tư vấn tuyển sinh DUTA", "type": "notice",
         "content": "Hệ thống chatbot AI DUTA hỗ trợ tư vấn tuyển sinh 24/7. Học sinh có thể đặt câu hỏi về ngành học, điểm chuẩn và định hướng nghề nghiệp. Truy cập mục 'Tư vấn AI' sau khi đăng nhập."},
    ]
    for pd in posts_data:
        if not db.query(Post).filter(Post.title == pd["title"]).first():
            post = Post(**pd, author_id=admin_user.id)
            db.add(post)
            db.commit()
            print(f"✅ Tạo bài viết: {pd['title']}")

db.close()
print("\n🎉 Seed hoàn tất!")
print("   Admin: admin@duta.edu.vn / Admin@123")
