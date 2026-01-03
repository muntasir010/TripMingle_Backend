#!/usr/bin/env bash
#exit on error

set -o errexit

npm install
npx prisma generate
npm run build
npm install --include=dev && npx prisma generate && npm run build
npm install --save-dev @types/express @types/cors @types/cookie-parser @types/jsonwebtoken @types/multer @types/node @types/nodemailer