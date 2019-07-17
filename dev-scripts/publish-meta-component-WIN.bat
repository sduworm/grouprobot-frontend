D:
set SOURCE_DIST=D:\frontend-dev\frontend-framework\src\meta-component\dist
set META_CMP=D:\frontend-dev\meta-component

cd %META_CMP%
git pull
copy /Y %SOURCE_DIST%\index.js %META_CMP%\dist\
set /p version=Input the Version. YYYYMMDDHHmm:
echo Version:%version%>version.txt
git add .
git commit -m "%version%"
git push
echo SUCCESS!
pause
