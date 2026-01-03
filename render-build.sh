#!/usr/bin/env bash
# exit on error
set -o errexit

npm install --include=dev 
npx prisma generate
npm run build