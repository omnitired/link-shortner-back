#!/bin/bash

set -e
echo "building in $PWD"

SERVER_NAME=prod

npm install
npm run build

PM2_SERVICE=rivia
PM2_HOME=/home/$SERVER_NAME/.pm2

set +e
PM2_HOME=/home/$SERVER_NAME/.pm2 pm2 describe $PM2_SERVICE > /dev/null
RUNNING=$?
set -e

if [ "${RUNNING}" -ne 0 ]; then
  echo "starting $PM2_SERVICE"
  PM2_HOME=/home/$SERVER_NAME/.pm2 pm2 start build/server.js --name $PM2_SERVICE --max-memory-restart 1500M --time -i max
else
  echo "restarting $PM2_SERVICE"
  PM2_HOME=/home/$SERVER_NAME/.pm2 pm2 restart $PM2_SERVICE
fi
