# syntax=docker/dockerfile:1.2
FROM node:20-alpine as builder

WORKDIR /usr/src/app
COPY package*.json pnpm-lock.yaml ./
RUN apk add --no-cache build-base && npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build ${APP_NAME} && pnpm prune --production

# running stage 
FROM node:20-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
CMD node dist/apps/${APP_NAME}/main.js