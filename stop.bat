@echo off
title DUTA - Tat du an
color 0C

echo Dang tat Backend va Frontend...

:: Tat process tren port 8000 (backend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000 "') do (
    taskkill /PID %%a /F >nul 2>&1
)

:: Tat process tren port 5173 (frontend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173 "') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo  Da tat Backend va Frontend.
echo  MySQL (XAMPP) van dang chay.
echo.
timeout /t 2 /nobreak >nul
