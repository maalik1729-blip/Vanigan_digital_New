@echo off
REM Business Data Sync - Windows Batch Script
REM This script helps you sync business data safely

echo.
echo ================================================================
echo              Business Data Sync Tool
echo ================================================================
echo.

:menu
echo Please select an option:
echo.
echo 1. Check Database Readiness
echo 2. Run Incremental Sync (Recommended - No Data Loss)
echo 3. Run Full Sync (WARNING: Clears existing data)
echo 4. Verify Sync Results
echo 5. Create Database Table
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto check
if "%choice%"=="2" goto incremental
if "%choice%"=="3" goto full
if "%choice%"=="4" goto verify
if "%choice%"=="5" goto createtable
if "%choice%"=="6" goto end
goto menu

:check
echo.
echo Checking database readiness...
node scripts\check-db-ready.js
echo.
pause
goto menu

:incremental
echo.
echo Starting INCREMENTAL SYNC...
echo This will update existing records and add new ones.
echo Your existing data will be preserved.
echo.
pause
node scripts\sync-businesses-safe.js
echo.
pause
goto menu

:full
echo.
echo ============================================================
echo                    WARNING!!!
echo ============================================================
echo This will DELETE ALL existing data and download fresh data!
echo Make sure you have a backup before proceeding.
echo.
set /p confirm="Are you sure? Type YES to confirm: "
if not "%confirm%"=="YES" (
    echo Cancelled.
    pause
    goto menu
)
echo.
echo Starting FULL SYNC...
node scripts\sync-businesses-safe.js --full
echo.
pause
goto menu

:verify
echo.
echo Verifying sync results...
node scripts\verify-sync.js
echo.
pause
goto menu

:createtable
echo.
echo Creating business_list table...
echo Please ensure MySQL is running.
echo.
set /p password="Enter MySQL root password (or press Enter if none): "
if "%password%"=="" (
    mysql -u root vanigan < scripts\create-business-table.sql
) else (
    mysql -u root -p%password% vanigan < scripts\create-business-table.sql
)
echo.
echo Table creation complete!
pause
goto menu

:end
echo.
echo Goodbye!
exit
