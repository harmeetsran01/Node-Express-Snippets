@echo off
set /p msg="Enter commit message: "

cd "E:\Project\Backend"

:: 1. Add the specific folder
git add "04proj"

:: 2. Commit with the input message
git commit -m "%msg%"

:: 3. Push to origin master
git push origin master
