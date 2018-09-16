@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\node_modules\burst-miner-watchdog\bin\watchdog-plugin.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\node_modules\burst-miner-watchdog\bin\watchdog-plugin.js" %*
)
