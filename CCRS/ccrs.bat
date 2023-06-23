start cmd /c "cd /d %~dp0\sos-ws-relay-master && npm install && node ws-relay.js & pause"
start cmd /c "cd /d %~dp0\config && node config.js & pause"