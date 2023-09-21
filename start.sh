#!/bin/sh

npx prisma generate
npm run build
npx prisma db push
npm run start