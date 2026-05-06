@echo off
title DUTA - Khoi dong du an
color 0A
set "PATH=%PATH%;C:\xampp\mysql\bin"

echo ==========================================
echo     DUTA - Tu van Tuyen sinh Dai hoc
echo ==========================================
echo.

:: Kiem tra MySQL
echo [1/3] Kiem tra MySQL...
mysql -u root -e "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo  [!] MySQL chua chay!
    echo  Hay mo XAMPP Control Panel va bat MySQL truoc.
    echo.
    start "" "C:\xampp\xampp-control.exe"
    echo  Sau khi bat MySQL xong, chay lai file nay.
    pause
    exit
)
echo  MySQL: OK

:: Khoi dong Backend
echo [2/3] Khoi dong Backend (port 8000)...
start "DUTA Backend" d:\DATN_Duta\run_backend.bat

echo  Cho backend khoi dong (6 giay)...
timeout /t 6 /nobreak >nul

:: Khoi dong Frontend
echo [3/3] Khoi dong Frontend (port 5173)...
start "DUTA Frontend" d:\DATN_Duta\run_frontend.bat

echo  Cho frontend khoi dong (8 giay)...
timeout /t 8 /nobreak >nul

:: Mo trinh duyet
echo  Mo trinh duyet...
start "" "http://localhost:5173"

echo.
echo ==========================================
echo   Frontend ^> http://localhost:5173
echo   Backend  ^> http://localhost:8000
echo   API Docs ^> http://localhost:8000/docs
echo ==========================================
echo   Admin: admin@duta.edu.vn / Admin@123
echo ==========================================
echo.
echo Nhan phim bat ky de dong cua so nay...
pause >nul
