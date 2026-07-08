#!/bin/sh
set -e

nginx
cd /app/backend
exec node server.js
