@echo off
REM Quick verification script for Campus Room Scheduler v2.0.0

echo =================================================
echo Campus Room Scheduler - Installation Verification
echo =================================================
echo.

REM Check Node.js version
echo Checking Node.js version...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [OK] Node.js: !NODE_VERSION!
) else (
    echo [ERROR] Node.js not found!
    echo         Install from: https://nodejs.org/
    exit /b 1
)
echo.

REM Check npm version
echo Checking npm version...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo [OK] npm: v!NPM_VERSION!
) else (
    echo [ERROR] npm not found!
    exit /b 1
)
echo.

REM Check if node_modules exists
echo Checking dependencies...
if exist "node_modules\" (
    echo [OK] node_modules directory exists
    
    if exist "node_modules\electron\" (
        echo [OK] Electron installed
    ) else (
        echo [WARNING] Electron not found in node_modules
    )
) else (
    echo [WARNING] node_modules not found - run 'npm install'
)
echo.

REM Check main files
echo Checking core files...
if exist "main.js" (echo [OK] main.js) else (echo [ERROR] main.js NOT FOUND)
if exist "mainWindow.html" (echo [OK] mainWindow.html) else (echo [ERROR] mainWindow.html NOT FOUND)
if exist "Schedule.html" (echo [OK] Schedule.html) else (echo [ERROR] Schedule.html NOT FOUND)
if exist "README.md" (echo [OK] README.md) else (echo [ERROR] README.md NOT FOUND)
echo.

REM Check config files
echo Checking configuration files...
if exist ".eslintrc.json" (echo [OK] .eslintrc.json) else (echo [INFO] .eslintrc.json not found)
if exist ".prettierrc.json" (echo [OK] .prettierrc.json) else (echo [INFO] .prettierrc.json not found)
if exist ".gitignore" (echo [OK] .gitignore) else (echo [INFO] .gitignore not found)
echo.

echo =================================================
echo All checks complete!
echo.
echo Next steps:
echo   1. npm install    (if not done yet)
echo   2. npm start      (to run the app)
echo   3. npm run build  (to create distributable)
echo =================================================
pause
