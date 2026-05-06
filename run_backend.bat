@echo off
set "PATH=%PATH%;C:\Users\TQV\AppData\Local\Programs\Python\Python312"
set "PATH=%PATH%;C:\Users\TQV\AppData\Local\Programs\Python\Python312\Scripts"
set PYTHONUTF8=1
cd /d d:\DATN_Duta\backend
title DUTA Backend
echo === DUTA Backend dang chay tren http://localhost:8000 ===
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
pause
