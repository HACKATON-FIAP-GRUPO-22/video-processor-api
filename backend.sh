#!/usr/bin/env bash

if [ ! -d node_modules ]; then
  npm install
fi
apk add --no-cache ffmpeg
npm run start:dev
