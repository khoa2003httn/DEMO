# ĐATN - Nền tảng Tư vấn và Tuyển sinh Đại học tích hợp AI Chatbot

**Sinh viên:** Tạ Quốc Dự — Lớp KTPM K20D  
**Giáo viên hướng dẫn:** TS. Nguyễn Thế Vịnh  
**Trường:** ĐH Công nghệ Thông tin và Truyền thông — ĐH Thái Nguyên  
**Năm:** 2026

---

## Tóm tắt đề tài

Xây dựng nền tảng web tuyển sinh đại học hiện đại, thay thế quy trình tư vấn thủ công (điện thoại, email, hotline) bằng hệ thống tự động hóa có tích hợp AI Chatbot hoạt động 24/7. Hệ thống phục vụ hai nhóm đối tượng: **Admin** quản trị nội dung và **User** (học sinh/phụ huynh) tra cứu, tư vấn.

---

## Yêu cầu chức năng

### Admin
| UC | Chức năng | Mô tả |
|----|-----------|-------|
| UC01 | Đăng nhập / Đăng xuất | Xác thực bằng tài khoản + mật khẩu |
| UC03 | Quản lý thí sinh | Xem danh sách, khóa/mở tài khoản, tìm kiếm |
| UC04 | Quản lý ngành học | CRUD ngành học (tên, mô tả, điểm chuẩn, chỉ tiêu) |
| UC05 | Quản lý trường đại học | CRUD trường (địa chỉ, thông tin tuyển sinh) |
| UC06 | Quản lý nội dung tuyển sinh | Đăng/sửa/xóa tin tức, thông báo tuyển sinh |
| UC07 | Quản lý AI Chatbot | Cập nhật dữ liệu huấn luyện (FAQ, ngành học), xem lịch sử chat |

### User (Học sinh / Phụ huynh)
| UC | Chức năng | Mô tả |
|----|-----------|-------|
| UC01 | Đăng ký / Đăng nhập | Tạo tài khoản, đăng nhập, quên mật khẩu |
| UC08 | Tra cứu ngành học | Tìm theo tên/khối thi, xem chi tiết ngành |
| UC09 | Tra cứu trường đại học | Xem danh sách trường, thông tin tuyển sinh |
| UC10 | Quản lý hồ sơ cá nhân | Nhập điểm học tập, sở thích, cập nhật hồ sơ |
| UC11 | Chat tư vấn với AI | Hỏi về ngành học, định hướng nghề nghiệp; AI trả lời 24/7 |

---

## Yêu cầu phi chức năng

- **Bảo mật:** Mã hóa mật khẩu bcrypt, xác thực JWT, chặn truy cập trái phép
- **Hiệu suất:** Thời gian phản hồi thấp, xử lý tốt trong mùa cao điểm tuyển sinh
- **Khả năng mở rộng:** Tăng số lượng người dùng, thêm tính năng mới
- **Sẵn sàng cao:** Chatbot và hệ thống hoạt động 24/7, hạn chế downtime
- **Giao diện:** Thân thiện, responsive — hỗ trợ cả web và mobile
- **Bảo trì:** Dễ nâng cấp, sửa lỗi, cập nhật dữ liệu

---

## Gợi ý kiến trúc & công nghệ

### Kiến trúc tổng thể

```
[React Frontend] ←→ [REST API / NestJS Backend] ←→ [PostgreSQL]
                                    ↓
                        [AI Chatbot Service]
                        (Claude API + RAG)
                                    ↓
                         [Vector DB - pgvector]
```

---

### Stack đề xuất (Fullstack TypeScript)

#### Frontend — React + Next.js
| Công nghệ | Mục đích |
|-----------|----------|
| **Next.js 14** (App Router) | SSR/SSG, SEO tốt cho trang tuyển sinh |
| **Tailwind CSS** | Styling nhanh, responsive |
| **shadcn/ui** | Component UI đẹp, dễ tùy chỉnh |
| **React Query / TanStack Query** | Quản lý state server, caching API |
| **React Hook Form + Zod** | Validate form đăng ký, hồ sơ |

#### Backend — NestJS (Node.js)
| Công nghệ | Mục đích |
|-----------|----------|
| **NestJS** (TypeScript) | Framework có cấu trúc rõ ràng, phân module |
| **Prisma ORM** | Tương tác database an toàn với TypeScript |
| **JWT + Passport.js** | Authentication, phân quyền Admin/User |
| **bcrypt** | Mã hóa mật khẩu |
| **Swagger** | Tự động sinh API docs |

> **Lý do chọn NestJS:** Cấu trúc module rõ ràng (auth, users, majors, universities, chatbot...), TypeScript end-to-end, dễ mở rộng, phù hợp đồ án có phân quyền nhiều tầng.

#### Database
| Công nghệ | Mục đích |
|-----------|----------|
| **PostgreSQL** | Database chính: thí sinh, ngành học, trường, bài viết |
| **pgvector** (extension) | Lưu vector embedding cho RAG chatbot |
| **Redis** | Cache, session, rate limiting |

#### AI Chatbot — RAG Architecture
| Công nghệ | Mục đích |
|-----------|----------|
| **Claude API** (Anthropic) | LLM chính để sinh câu trả lời |
| **LangChain.js** | Orchestrate RAG pipeline |
| **pgvector** | Vector search — tìm context phù hợp |
| **text-embedding-3-small** (OpenAI) hoặc **voyage-3** (Anthropic) | Embedding văn bản ngành học, FAQ |

**Luồng RAG Chatbot:**
```
User hỏi → Embed câu hỏi → Tìm top-K docs liên quan trong pgvector
→ Ghép context vào prompt → Claude API sinh câu trả lời
→ Lưu lịch sử chat vào DB
```

#### DevOps
| Công nghệ | Mục đích |
|-----------|----------|
| **Docker + Docker Compose** | Container hóa toàn bộ hệ thống |
| **Nginx** | Reverse proxy, load balancing |
| **GitHub Actions** | CI/CD tự động |

---

### Cấu trúc thư mục dự án (đề xuất)

```
/
├── frontend/               # Next.js app
│   ├── app/
│   │   ├── (auth)/         # Login, Register
│   │   ├── (user)/         # Dashboard, Profile, Chat, Majors, Universities
│   │   └── (admin)/        # Admin panel
│   └── components/
│
├── backend/                # NestJS app
│   ├── src/
│   │   ├── auth/           # JWT, bcrypt, guards
│   │   ├── users/          # Quản lý thí sinh
│   │   ├── majors/         # Quản lý ngành học
│   │   ├── universities/   # Quản lý trường đại học
│   │   ├── posts/          # Nội dung tuyển sinh
│   │   └── chatbot/        # AI chatbot + RAG
│   └── prisma/
│       └── schema.prisma
│
└── docker-compose.yml
```

---

### Các bảng database chính (Prisma Schema)

```
User (id, email, password, role, name, phone, locked, createdAt)
Major (id, name, description, benchmark, quota, universityId)
University (id, name, address, website, description)
Post (id, title, content, type, authorId, publishedAt)
ChatHistory (id, userId, message, response, createdAt)
Document (id, content, embedding, type, refId)  -- cho RAG
```

---

## Thứ tự triển khai (roadmap)

1. **Sprint 1** — Khởi tạo dự án, thiết kế DB, auth (đăng ký/đăng nhập/JWT)
2. **Sprint 2** — CRUD ngành học, trường đại học (Admin)
3. **Sprint 3** — Trang tra cứu ngành, trường (User), quản lý bài viết
4. **Sprint 4** — Hồ sơ cá nhân User, quản lý thí sinh (Admin)
5. **Sprint 5** — Tích hợp AI Chatbot (RAG + Claude API)
6. **Sprint 6** — Admin quản lý chatbot, xem lịch sử chat, nhúng dữ liệu FAQ
7. **Sprint 7** — UI/UX hoàn thiện, responsive, kiểm thử, deploy Docker

---

## Lưu ý kỹ thuật

- Chatbot cần **system prompt** rõ ràng: chỉ trả lời về ngành học, tuyển sinh — tránh hallucination
- Dữ liệu huấn luyện ban đầu: danh sách ngành học, FAQ tuyển sinh (do Admin nhập)
- JWT nên có access token ngắn hạn (15 phút) + refresh token (7 ngày)
- API phải có rate limiting để bảo vệ endpoint chatbot khỏi abuse
