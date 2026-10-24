@echo off
title NyaayaAI – Setup and Start
color 0B

echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║         NyaayaAI – Citizen Rights Assistant          ║
echo  ║          Setting up and starting the app...          ║
echo  ╚══════════════════════════════════════════════════════╝
echo.

:: ─── Step 1: Install Python dependencies ───────────────────
echo [1/3] Installing Python backend dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo.
    echo  ERROR: pip install failed. Make sure Python 3.9+ is installed and in PATH.
    echo  Download Python: https://www.python.org/downloads/
    pause
    exit /b 1
)
echo  ✓ Python dependencies installed.
echo.

:: ─── Step 2: Install frontend npm dependencies ─────────────
echo [2/3] Installing frontend npm dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo.
    echo  ERROR: npm install failed. Make sure Node.js 18+ is installed and in PATH.
    echo  Download Node.js: https://nodejs.org/
    pause
    exit /b 1
)
cd ..
echo  ✓ Frontend dependencies installed.
echo.

:: ─── Step 3: Create .env if it doesn't exist ───────────────
if not exist ".env" (
    copy ".env.example" ".env" >nul
    echo  ✓ Created .env from .env.example  (edit it to add an AI API key if you have one)
) else (
    echo  ✓ .env already exists, skipping.
)
echo.

:: ─── Step 4: Launch both servers ───────────────────────────
echo [3/3] Starting backend (FastAPI) and frontend (Vite)...
echo.

:: Open Backend in a new window
start "NyaayaAI Backend (port 8000)" cmd /k "python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"

:: Wait 2 seconds for backend to boot
timeout /t 2 /nobreak >nul

:: Open Frontend in a new window
start "NyaayaAI Frontend (port 5173)" cmd /k "cd frontend && npm run dev"

:: Wait 3 seconds then open browser
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║  ✅ NyaayaAI is running!                             ║
echo  ║                                                      ║
echo  ║  Frontend : http://localhost:5173                    ║
echo  ║  Backend  : http://localhost:8000                    ║
echo  ║  API Docs : http://localhost:8000/docs               ║
echo  ║                                                      ║
echo  ║  Close the two server windows to stop the app.       ║
echo  ╚══════════════════════════════════════════════════════╝
echo.
pause
