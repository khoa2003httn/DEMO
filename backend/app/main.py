from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
import app.models  # noqa: F401 — registers all models before create_all
from app.routers import auth, users, universities, majors, posts, chatbot

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DUTA - Nền tảng Tư vấn & Tuyển sinh Đại học",
    description="API cho hệ thống tư vấn và tuyển sinh tích hợp AI Chatbot",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(universities.router, prefix="/api")
app.include_router(majors.router, prefix="/api")
app.include_router(posts.router, prefix="/api")
app.include_router(chatbot.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "DUTA API đang chạy", "docs": "/docs"}
