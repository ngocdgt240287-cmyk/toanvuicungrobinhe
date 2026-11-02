@echo off
cd /d "%~dp0"
echo TOAN VUI - ROBI
if not exist package.json (
  echo Khong tim thay package.json. Hay mo dung thu muc du an.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Dang cai dat thu vien lan dau...
  call npm install
  if errorlevel 1 pause & exit /b 1
)
echo Dang khoi dong website tai http://localhost:3000
call npm run dev
pause
