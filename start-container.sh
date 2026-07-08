#!/bin/sh
set -e

echo "Waiting for PostgreSQL..."

until nc -z postgres 5432
do
  sleep 2
done

echo "Database ready"

cd /app/backend
exec node server.js
